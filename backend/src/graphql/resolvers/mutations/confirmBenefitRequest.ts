import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { requireAuth } from "../../../auth";
import { writeAuditLog } from "../helpers/audit";

const CANCELLABLE_FROM_CONFIRM = new Set([
  "pending",
  "awaiting_contract_acceptance",
]);

function routeAfterConfirm(approvalPolicy: string): string {
  if (approvalPolicy === "finance") return "awaiting_finance_review";
  return "awaiting_hr_review";
}

export const confirmBenefitRequest = async (
  _: unknown,
  { requestId, contractAccepted }: { requestId: string; contractAccepted: boolean },
  { db, currentEmployee, ipAddress }: GraphQLContext,
) => {
  const employee = requireAuth(currentEmployee);
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId));
  const req = requests[0];
  if (!req) throw new Error("Benefit request not found");
  if (req.employeeId !== employee.id) {
    throw new Error("You can only confirm your own request.");
  }
  if (!CANCELLABLE_FROM_CONFIRM.has(req.status)) {
    throw new Error(`Request cannot be confirmed from status: ${req.status}.`);
  }

  const now = new Date().toISOString();

  if (!contractAccepted) {
    const [updated] = await db
      .update(schema.benefitRequests)
      .set({ status: "cancelled", updatedAt: now })
      .where(eq(schema.benefitRequests.id, requestId))
      .returning();

    await writeAuditLog({
      db,
      actor: employee,
      actionType: "REQUEST_CANCELLED",
      entityType: "benefit_request",
      entityId: requestId,
      targetEmployeeId: employee.id,
      benefitId: req.benefitId,
      requestId,
      reason: "Contract declined by employee",
    });

    return updated;
  }

  // Resolve active contract for this benefit
  const benefitRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, req.benefitId));
  const benefit = benefitRows[0];
  const approvalPolicy = benefit?.approvalPolicy ?? "hr";

  let contractVersionAccepted: string | null = req.contractVersionAccepted;
  const contractAcceptedAt = now;

  if (benefit?.requiresContract) {
    const contracts = await db
      .select()
      .from(schema.contracts)
      .where(eq(schema.contracts.benefitId, req.benefitId));
    const active = contracts.find((c) => c.isActive);
    if (!active) {
      throw new Error(
        "This benefit requires a contract but no active contract is currently available. Please contact HR.",
      );
    }

    const signedContractRows = await db
      .select()
      .from(schema.employeeSignedContracts)
      .where(eq(schema.employeeSignedContracts.requestId, requestId))
      .limit(1);
    let signedContract = signedContractRows[0];

    if (!signedContract && req.employeeContractKey) {
      const fallbackRows = await db
        .select()
        .from(schema.employeeSignedContracts)
        .where(eq(schema.employeeSignedContracts.r2ObjectKey, req.employeeContractKey))
        .limit(1);
      signedContract = fallbackRows[0];
    }

    if (!signedContract && !req.employeeContractKey) {
      throw new Error(
        "Please upload your signed contract copy before confirming this request.",
      );
    }

    if (signedContract) {
      if (signedContract.employeeId !== employee.id) {
        throw new Error("Uploaded signed contract does not belong to this employee.");
      }
      if (signedContract.benefitId !== req.benefitId) {
        throw new Error("Uploaded signed contract does not match this benefit.");
      }
      if (
        signedContract.status !== "uploaded" &&
        signedContract.status !== "attached_to_request"
      ) {
        throw new Error(
          "This signed contract copy is no longer valid. Please upload a fresh scanned copy.",
        );
      }
      if (signedContract.requestId && signedContract.requestId !== requestId) {
        throw new Error(
          "This signed contract copy is already attached to a different request. Please upload a new copy.",
        );
      }
      if (signedContract.hrContractId !== active.id) {
        throw new Error(
          "The HR contract has changed since the signed copy was uploaded. Please upload a new signed copy.",
        );
      }
      if (
        signedContract.hrContractVersion !== active.version ||
        signedContract.hrContractHash !== active.sha256Hash
      ) {
        throw new Error(
          "Your uploaded signed copy does not match the current HR contract version. Please re-upload it.",
        );
      }
      if (signedContract.status !== "attached_to_request") {
        await db
          .update(schema.employeeSignedContracts)
          .set({
            requestId,
            status: "attached_to_request",
            updatedAt: now,
          })
          .where(eq(schema.employeeSignedContracts.id, signedContract.id));
      }
    }

    contractVersionAccepted = `${active.version}:${active.sha256Hash}`;

    // Write contract acceptance record — include IP for audit trail compliance.
    await db.insert(schema.contractAcceptances).values({
      employeeId: employee.id,
      benefitId: req.benefitId,
      contractId: active.id,
      contractVersion: active.version,
      contractHash: active.sha256Hash,
      acceptedAt: contractAcceptedAt,
      requestId,
      ipAddress: ipAddress ?? null,
    });
  }

  const nextStatus = routeAfterConfirm(approvalPolicy);

  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      status: nextStatus,
      contractVersionAccepted,
      contractAcceptedAt,
      employeeApprovedAt: contractAcceptedAt,
      updatedAt: contractAcceptedAt,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  await writeAuditLog({
    db,
    actor: employee,
    actionType: "CONTRACT_ACCEPTED",
    entityType: "benefit_request",
    entityId: requestId,
    targetEmployeeId: employee.id,
    benefitId: req.benefitId,
    requestId,
    metadata: { nextStatus, contractVersionAccepted },
    ipAddress,
  });

  return updated;
};
