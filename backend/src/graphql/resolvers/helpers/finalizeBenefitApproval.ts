import { and, eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { Benefit, BenefitRequest, Database, Employee } from "../../../db";
import { sendBenefitRequestApprovedEmail } from "../../../email/sendTransactionalEmail";
import type { Env } from "../../context";
import { writeAuditLog, type AuditActionType } from "./audit";
import { eligibilityCacheKey } from "./recomputeEligibility";

type FinalizeBenefitApprovalParams = {
  db: Database;
  env: Env;
  actor: Employee | null;
  benefitRequest: BenefitRequest;
  benefit: Benefit;
  beforeStatus: string;
  actionType: AuditActionType;
  metadata?: unknown;
  ipAddress?: string | null;
};

export async function finalizeBenefitApproval({
  db,
  env,
  actor,
  benefitRequest,
  benefit,
  beforeStatus,
  actionType,
  metadata,
  ipAddress,
}: FinalizeBenefitApprovalParams): Promise<void> {
  const approvedBy = benefitRequest.reviewedBy ?? actor?.id ?? null;
  const now = new Date().toISOString();

  const existingEnrollments = await db
    .select()
    .from(schema.employeeBenefitEnrollments)
    .where(
      and(
        eq(schema.employeeBenefitEnrollments.employeeId, benefitRequest.employeeId),
        eq(schema.employeeBenefitEnrollments.benefitId, benefitRequest.benefitId),
        eq(schema.employeeBenefitEnrollments.status, "active"),
      ),
    );

  if (!existingEnrollments[0]) {
    await db.insert(schema.employeeBenefitEnrollments).values({
      employeeId: benefitRequest.employeeId,
      benefitId: benefitRequest.benefitId,
      requestId: benefitRequest.id,
      status: "active",
      subsidyPercentApplied: benefit.subsidyPercent,
      employeePercentApplied: 100 - benefit.subsidyPercent,
      approvedBy,
      startedAt: now,
    });

    await writeAuditLog({
      db,
      actor,
      actionType: "ENROLLMENT_CREATED",
      entityType: "enrollment",
      entityId: benefitRequest.id,
      targetEmployeeId: benefitRequest.employeeId,
      benefitId: benefitRequest.benefitId,
      requestId: benefitRequest.id,
      metadata: {
        subsidyPercentApplied: benefit.subsidyPercent,
        employeePercentApplied: 100 - benefit.subsidyPercent,
        approvedBy,
      },
      ipAddress,
    });
  }

  await writeAuditLog({
    db,
    actor,
    actionType,
    entityType: "benefit_request",
    entityId: benefitRequest.id,
    targetEmployeeId: benefitRequest.employeeId,
    benefitId: benefitRequest.benefitId,
    requestId: benefitRequest.id,
    before: { status: beforeStatus },
    after: { status: "approved" },
    metadata,
    ipAddress,
  });

  const employeeRows = await db
    .select()
    .from(schema.employees)
    .where(eq(schema.employees.id, benefitRequest.employeeId))
    .limit(1);
  const targetEmployee = employeeRows[0];

  if (targetEmployee) {
    await sendBenefitRequestApprovedEmail(env, targetEmployee, benefit);
  }

  env.ELIGIBILITY_CACHE.delete(eligibilityCacheKey(benefitRequest.employeeId)).catch(
    (error) => {
      console.error(
        "[finalizeBenefitApproval] Failed to invalidate employee eligibility cache:",
        error,
      );
    },
  );
}
