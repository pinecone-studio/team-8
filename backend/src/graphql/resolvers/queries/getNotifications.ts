import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Database } from "../../../db";
import type { GraphQLContext } from "../../context";
import { isAdminEmployee, isHrAdmin } from "../../../auth";
import { getEmployeeRequestStatusContent } from "../../../notifications/request-status-content";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  linkPath?: string | null;
  createdAt: string;
  isRead: boolean;
};

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function buildStateAwareId(prefix: string, parts: Array<string | null | undefined>): string {
  const signature = createHash("sha1")
    .update(parts.filter(Boolean).join("|"))
    .digest("hex")
    .slice(0, 12);
  return `${prefix}:${signature}`;
}

function latestTimestamp(values: Array<string | null | undefined>, fallback: string): string {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? fallback;
}

function sortByStableKey<T>(rows: T[], getKey: (row: T) => string): T[] {
  return [...rows].sort((a, b) => getKey(a).localeCompare(getKey(b)));
}

function employeeDisplayName(
  employee: { name: string; nameEng: string | null; email: string } | undefined,
): string {
  if (!employee) return "An employee";
  return employee.nameEng?.trim() || employee.name.trim() || employee.email;
}

function formatCurrencyMnt(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  return `${Math.round(value).toLocaleString("en-US")}₮`;
}

function buildRequestSummary(params: {
  employeeName: string;
  benefitName: string;
  requestedAmount?: number | null;
  repaymentMonths?: number | null;
}): string {
  const { employeeName, benefitName, requestedAmount, repaymentMonths } = params;
  const terms =
    requestedAmount && repaymentMonths
      ? ` requested ${formatCurrencyMnt(requestedAmount)} over ${repaymentMonths} month${repaymentMonths === 1 ? "" : "s"}`
      : ` requested ${benefitName}`;
  return `${employeeName}${terms.includes(benefitName) ? "" : ` for ${benefitName}`}`;
}

function describeQueueBody(params: {
  rows: Array<{
    benefitName: string;
    employeeName: string;
    requestedAmount?: number | null;
    repaymentMonths?: number | null;
  }>;
  emptyBody: string;
}): string {
  const latest = params.rows[0];
  if (!latest) return params.emptyBody;
  const latestSummary = buildRequestSummary({
    employeeName: latest.employeeName,
    benefitName: latest.benefitName,
    requestedAmount: latest.requestedAmount,
    repaymentMonths: latest.repaymentMonths,
  });
  const remaining = params.rows.length - 1;
  if (remaining <= 0) {
    return `Latest: ${latestSummary}.`;
  }
  return `Latest: ${latestSummary}. ${remaining} more request${remaining === 1 ? "" : "s"} are still waiting.`;
}

async function getReadKeys(db: Database, employeeId: string): Promise<Set<string>> {
  const rows = await db
    .select({ notificationKey: schema.notificationReads.notificationKey })
    .from(schema.notificationReads)
    .where(eq(schema.notificationReads.employeeId, employeeId));
  return new Set(rows.map((r) => r.notificationKey));
}

export const getNotifications = async (
  _: unknown,
  __: unknown,
  { db, currentEmployee }: GraphQLContext & { db: Database },
): Promise<Notification[]> => {
  if (!currentEmployee) throw new Error("Not authenticated.");

  // Server-side read state — shared across all devices for this employee
  const readKeys = await getReadKeys(db, currentEmployee.id);

  const raw: Omit<Notification, "isRead">[] = [];

  if (isAdminEmployee(currentEmployee)) {
    const isHr = isHrAdmin(currentEmployee);

    const requestRows = await db
      .select({
        id: schema.benefitRequests.id,
        employeeId: schema.benefitRequests.employeeId,
        benefitId: schema.benefitRequests.benefitId,
        status: schema.benefitRequests.status,
        requestedAmount: schema.benefitRequests.requestedAmount,
        repaymentMonths: schema.benefitRequests.repaymentMonths,
        updatedAt: schema.benefitRequests.updatedAt,
        createdAt: schema.benefitRequests.createdAt,
      })
      .from(schema.benefitRequests);

    const [employeeRows, benefitRows] = await Promise.all([
      db
        .select({
          id: schema.employees.id,
          name: schema.employees.name,
          nameEng: schema.employees.nameEng,
          email: schema.employees.email,
        })
        .from(schema.employees),
      db
        .select({
          id: schema.benefits.id,
          name: schema.benefits.name,
          requiresContract: schema.benefits.requiresContract,
          isActive: schema.benefits.isActive,
        })
        .from(schema.benefits),
    ]);

    const employeeById = new Map(employeeRows.map((row) => [row.id, row]));
    const benefitById = new Map(benefitRows.map((row) => [row.id, row]));

    const financeQueueRows = requestRows.filter((r) =>
      [
        "awaiting_finance_review",
        "hr_approved",
        "awaiting_final_finance_approval",
      ].includes(r.status),
    );
    const financeQueueStateRows = sortByStableKey(
      financeQueueRows,
      (row) => `${row.id}|${row.updatedAt ?? row.createdAt}|${row.status}`,
    );
    const financeQueue = financeQueueRows.length;

    if (financeQueue > 0) {
      const createdAt = latestTimestamp(
        financeQueueRows.map((row) => row.updatedAt ?? row.createdAt),
        new Date().toISOString(),
      );
      raw.push({
        id: buildStateAwareId(
          "admin-finance-queue",
          financeQueueStateRows.flatMap((row) => [
            row.id,
            row.status,
            row.updatedAt ?? row.createdAt,
          ]),
        ),
        type: "queue_item",
        title: `${financeQueue} request${financeQueue > 1 ? "s" : ""} awaiting Finance review`,
        body: describeQueueBody({
          rows: financeQueueRows
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? b.createdAt).getTime() -
                new Date(a.updatedAt ?? a.createdAt).getTime(),
            )
            .map((row) => ({
              employeeName: employeeDisplayName(employeeById.get(row.employeeId)),
              benefitName: benefitById.get(row.benefitId)?.name ?? row.benefitId,
              requestedAmount: row.requestedAmount,
              repaymentMonths: row.repaymentMonths,
            })),
          emptyBody: "Pending requests are waiting in the Finance approval queue.",
        }),
        linkPath: "/admin-panel/pending-requests",
        createdAt,
      });
    }

    if (isHr) {
      const hrQueueRows = requestRows.filter((r) => r.status === "awaiting_hr_review");
      const contractQueueRows = requestRows.filter(
        (r) => r.status === "awaiting_contract_acceptance",
      );
      const hrQueueStateRows = sortByStableKey(
        hrQueueRows,
        (row) => `${row.id}|${row.updatedAt ?? row.createdAt}|${row.status}`,
      );
      const contractQueueStateRows = sortByStableKey(
        contractQueueRows,
        (row) => `${row.id}|${row.updatedAt ?? row.createdAt}|${row.status}`,
      );
      const hrQueue = hrQueueRows.length;
      const contractQueue = contractQueueRows.length;

      if (hrQueue > 0) {
        const createdAt = latestTimestamp(
          hrQueueRows.map((row) => row.updatedAt ?? row.createdAt),
          new Date().toISOString(),
        );
        raw.push({
          id: buildStateAwareId(
            "admin-hr-queue",
            hrQueueStateRows.flatMap((row) => [
              row.id,
              row.status,
              row.updatedAt ?? row.createdAt,
            ]),
          ),
          type: "queue_item",
          title: `${hrQueue} request${hrQueue > 1 ? "s" : ""} awaiting HR review`,
          body: describeQueueBody({
            rows: hrQueueRows
              .sort(
                (a, b) =>
                  new Date(b.updatedAt ?? b.createdAt).getTime() -
                  new Date(a.updatedAt ?? a.createdAt).getTime(),
              )
              .map((row) => ({
                employeeName: employeeDisplayName(employeeById.get(row.employeeId)),
                benefitName: benefitById.get(row.benefitId)?.name ?? row.benefitId,
                requestedAmount: row.requestedAmount,
                repaymentMonths: row.repaymentMonths,
              })),
            emptyBody: "Pending requests are waiting in the HR approval queue.",
          }),
          linkPath: "/admin-panel/pending-requests",
          createdAt,
        });
      }

      if (contractQueue > 0) {
        const createdAt = latestTimestamp(
          contractQueueRows.map((row) => row.updatedAt ?? row.createdAt),
          new Date().toISOString(),
        );
        raw.push({
          id: buildStateAwareId(
            "admin-contract-queue",
            contractQueueStateRows.flatMap((row) => [
              row.id,
              row.status,
              row.updatedAt ?? row.createdAt,
            ]),
          ),
          type: "queue_item",
          title: `${contractQueue} request${contractQueue > 1 ? "s" : ""} awaiting contract acceptance`,
          body: describeQueueBody({
            rows: contractQueueRows
              .sort(
                (a, b) =>
                  new Date(b.updatedAt ?? b.createdAt).getTime() -
                  new Date(a.updatedAt ?? a.createdAt).getTime(),
              )
              .map((row) => ({
                employeeName: employeeDisplayName(employeeById.get(row.employeeId)),
                benefitName: benefitById.get(row.benefitId)?.name ?? row.benefitId,
              })),
            emptyBody:
              "Employees need to accept their vendor contracts before HR can review.",
          }),
          linkPath: "/admin-panel/pending-requests",
          createdAt,
        });
      }

      const contractRows = await db
        .select({
          id: schema.contracts.id,
          benefitId: schema.contracts.benefitId,
          expiryDate: schema.contracts.expiryDate,
          isActive: schema.contracts.isActive,
          vendorName: schema.contracts.vendorName,
        })
        .from(schema.contracts);

      const activeContracts = contractRows.filter((c) => c.isActive);
      const now = new Date().toISOString();
      const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

      for (const contract of activeContracts) {
        if (contract.expiryDate && contract.expiryDate >= now && contract.expiryDate <= sixtyDaysFromNow) {
          const days = daysUntil(contract.expiryDate);
          if (days !== null) {
            raw.push({
              id: buildStateAwareId("contract-expiring", [
                contract.id,
                contract.expiryDate,
                String(days),
              ]),
              type: "contract_expiring",
              title: `Contract expiring in ${days} day${days !== 1 ? "s" : ""}`,
              body: `${benefitById.get(contract.benefitId)?.name ?? "A benefit"} contract with ${contract.vendorName ?? "the vendor"} expires soon. Renew it to avoid benefit disruption.`,
              linkPath: "/admin-panel/vendor-contracts",
              createdAt: contract.expiryDate,
            });
          }
        }
      }

      const activeContractBenefitIds = new Set(activeContracts.map((c) => c.benefitId));
      for (const benefit of benefitRows) {
        if (benefit.requiresContract && !activeContractBenefitIds.has(benefit.id)) {
          raw.push({
            id: `missing-contract-${benefit.id}`,
            type: "contract_missing",
            title: `No active contract: ${benefit.name}`,
            body: "This benefit requires a vendor contract but none is active. New requests will be blocked.",
            linkPath: "/admin-panel/vendor-contracts",
            createdAt: new Date().toISOString(),
          });
        }
      }

      const suspendedRows = await db
        .select({
          id: schema.employeeBenefitEnrollments.id,
          updatedAt: schema.employeeBenefitEnrollments.updatedAt,
          benefitId: schema.employeeBenefitEnrollments.benefitId,
          employeeId: schema.employeeBenefitEnrollments.employeeId,
        })
        .from(schema.employeeBenefitEnrollments)
        .where(eq(schema.employeeBenefitEnrollments.status, "suspended"));

      const suspendedCount = suspendedRows.length;
      if (suspendedCount > 0) {
        const suspendedStateRows = sortByStableKey(
          suspendedRows,
          (row) => `${row.id}|${row.employeeId}|${row.benefitId}|${row.updatedAt}`,
        );
        const createdAt = latestTimestamp(
          suspendedRows.map((row) => row.updatedAt),
          new Date().toISOString(),
        );
        raw.push({
          id: buildStateAwareId(
            "admin-suspended-enrollments",
            suspendedStateRows.flatMap((row) => [
              row.id,
              row.employeeId,
              row.benefitId,
              row.updatedAt,
            ]),
          ),
          type: "suspended_enrollments",
          title: `${suspendedCount} suspended enrollment${suspendedCount > 1 ? "s" : ""}`,
          body: "Some employees have suspended benefit enrollments requiring review.",
          linkPath: "/admin-panel/eligibility-inspector",
          createdAt,
        });
      }

      const pendingProposals = await db
        .select({ id: schema.ruleProposals.id, proposedAt: schema.ruleProposals.proposedAt })
        .from(schema.ruleProposals)
        .where(eq(schema.ruleProposals.status, "pending"));

      if (pendingProposals.length > 0) {
        const pendingProposalStateRows = sortByStableKey(
          pendingProposals,
          (proposal) => `${proposal.id}|${proposal.proposedAt}`,
        );
        const count = pendingProposals.length;
        const latestAt = pendingProposals.sort(
          (a, b) => new Date(b.proposedAt).getTime() - new Date(a.proposedAt).getTime(),
        )[0]?.proposedAt ?? new Date().toISOString();

        raw.push({
          id: buildStateAwareId(
            "admin-pending-rule-proposals",
            pendingProposalStateRows.flatMap((proposal) => [proposal.id, proposal.proposedAt]),
          ),
          type: "rule_proposal_pending",
          title: `${count} rule proposal${count > 1 ? "s" : ""} awaiting approval`,
          body: "Eligibility rule changes are pending a second HR admin review before taking effect.",
          linkPath: "/admin-panel/rule-configuration",
          createdAt: latestAt,
        });
      }
    }
  } else {
    // ── Employee notifications ─────────────────────────────────────────────────

    const requests = await db
      .select({
        id: schema.benefitRequests.id,
        benefitId: schema.benefitRequests.benefitId,
        status: schema.benefitRequests.status,
        updatedAt: schema.benefitRequests.updatedAt,
        declineReason: schema.benefitRequests.declineReason,
        requestedAmount: schema.benefitRequests.requestedAmount,
        repaymentMonths: schema.benefitRequests.repaymentMonths,
        financeProposedAmount: schema.benefitRequests.financeProposedAmount,
        financeProposedRepaymentMonths:
          schema.benefitRequests.financeProposedRepaymentMonths,
        financeProposalNote: schema.benefitRequests.financeProposalNote,
      })
      .from(schema.benefitRequests)
      .where(eq(schema.benefitRequests.employeeId, currentEmployee.id));

    const benefitIds = [...new Set(requests.map((req) => req.benefitId))];
    const benefitRows = benefitIds.length
      ? await db
          .select({ id: schema.benefits.id, name: schema.benefits.name })
          .from(schema.benefits)
      : [];
    const benefitNameById = new Map(
      benefitRows.map((benefit) => [benefit.id, benefit.name]),
    );

    for (const req of requests) {
      const benefitName = benefitNameById.get(req.benefitId) ?? "Benefit";
      const content = getEmployeeRequestStatusContent({
        status: req.status,
        benefitName,
        benefitId: req.benefitId,
        declineReason: req.declineReason,
        requestedAmount: req.requestedAmount,
        repaymentMonths: req.repaymentMonths,
        financeProposedAmount: req.financeProposedAmount,
        financeProposedRepaymentMonths: req.financeProposedRepaymentMonths,
        financeProposalNote: req.financeProposalNote,
      });
      if (!content) continue;

      raw.push({
        id: `req-${req.id}-${req.status}`,
        type: "request_status_change",
        title: content.title,
        body: content.body,
        linkPath: content.linkPath,
        createdAt: req.updatedAt ?? new Date().toISOString(),
      });
    }

    const suspendedEnrollments = await db
      .select({
        id: schema.employeeBenefitEnrollments.id,
        updatedAt: schema.employeeBenefitEnrollments.updatedAt,
      })
      .from(schema.employeeBenefitEnrollments)
      .where(
        and(
          eq(schema.employeeBenefitEnrollments.employeeId, currentEmployee.id),
          eq(schema.employeeBenefitEnrollments.status, "suspended"),
        ),
      );

    for (const enrollment of suspendedEnrollments) {
      raw.push({
        id: `enrollment-suspended-${enrollment.id}`,
        type: "enrollment_suspended",
        title: "Benefit enrollment suspended",
        body: "One of your benefit enrollments has been suspended due to an eligibility change. Please contact HR.",
        linkPath: "/employee-panel/mybenefits",
        createdAt: enrollment.updatedAt ?? new Date().toISOString(),
      });
    }
  }

  // Resolve isRead from server-backed state and sort newest first
  const notifications: Notification[] = raw.map((n) => ({
    ...n,
    isRead: readKeys.has(n.id),
  }));

  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
