import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import { requireHrAdmin } from "../../../auth";
import { invalidateAllEmployeeEligibilityCaches } from "../helpers/benefitCatalogRefresh";
import {
  assertSingleActiveFinanceBenefit,
  isFinanceBenefitFlowType,
} from "../../../benefits/finance";

export const updateBenefit = async (
  _: unknown,
  {
    id,
    input,
  }: {
    id: string;
    input: {
      name?: string | null;
      description?: string | null;
      category?: string | null;
      subsidyPercent?: number | null;
      vendorName?: string | null;
      requiresContract?: boolean | null;
      isActive?: boolean | null;
      approvalPolicy?: string | null;
      flowType?:
        | "contract"
        | "normal"
        | "down_payment"
        | "self_service"
        | "screen_time"
        | null;
      amount?: number | null;
      location?: string | null;
      imageUrl?: string | null;
    };
  },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);

  const existingRows = await db
    .select()
    .from(schema.benefits)
    .where(eq(schema.benefits.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) throw new Error("Benefit not found");

  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if ("description" in input) updates.description = input.description ?? null;
  if (input.category != null) updates.category = input.category;
  if ("vendorName" in input) updates.vendorName = input.vendorName ?? null;
  const effectiveFlowType = input.flowType ?? existing.flowType ?? "normal";
  const effectiveIsActive = input.isActive ?? existing.isActive;
  const effectiveRequiresContract =
    effectiveFlowType === "screen_time"
      ? false
      : isFinanceBenefitFlowType(effectiveFlowType)
        ? true
        : input.requiresContract ?? existing.requiresContract;
  if (input.requiresContract != null || effectiveFlowType === "screen_time") {
    updates.requiresContract = effectiveRequiresContract;
  }
  if (input.flowType != null) updates.flowType = input.flowType;
  if (input.isActive != null) updates.isActive = input.isActive;
  if (input.approvalPolicy != null || isFinanceBenefitFlowType(effectiveFlowType)) {
    updates.approvalPolicy = isFinanceBenefitFlowType(effectiveFlowType)
      ? "finance"
      : input.approvalPolicy ?? existing.approvalPolicy;
  }
  if ("amount" in input || isFinanceBenefitFlowType(effectiveFlowType)) {
    updates.amount = isFinanceBenefitFlowType(effectiveFlowType)
      ? null
      : input.amount ?? null;
  }
  if ("location" in input) updates.location = input.location ?? null;
  if ("imageUrl" in input) updates.imageUrl = input.imageUrl ?? null;
  if (input.subsidyPercent != null || isFinanceBenefitFlowType(effectiveFlowType)) {
    updates.subsidyPercent = isFinanceBenefitFlowType(effectiveFlowType)
      ? 0
      : input.subsidyPercent ?? existing.subsidyPercent;
  }


  const effectiveAmount =
    isFinanceBenefitFlowType(effectiveFlowType)
      ? null
      : "amount" in input
        ? input.amount ?? null
        : existing.amount;
  const effectiveSubsidyPercent =
    isFinanceBenefitFlowType(effectiveFlowType)
      ? 0
      : input.subsidyPercent != null
        ? input.subsidyPercent
        : existing.subsidyPercent;
  if (isFinanceBenefitFlowType(effectiveFlowType) && effectiveIsActive) {
    await assertSingleActiveFinanceBenefit(db, { excludeBenefitId: id });
  }
  if (effectiveFlowType === "screen_time" && effectiveRequiresContract) {
    throw new Error("Screen time benefits cannot require a contract.");
  }
  if (effectiveFlowType === "contract" && (!effectiveAmount || effectiveAmount <= 0)) {
    throw new Error("Contract-based benefits must include a valid total price.");
  }
  if (effectiveFlowType === "contract" && effectiveSubsidyPercent >= 100) {
    throw new Error("Contract-based benefits must leave an employee payment share. Set company subsidy below 100%.");
  }

  const [row] = await db
    .update(schema.benefits)
    .set(updates)
    .where(eq(schema.benefits.id, id))
    .returning();
  if (!row) throw new Error("Benefit not found");

  try {
    await invalidateAllEmployeeEligibilityCaches(
      db,
      env.ELIGIBILITY_CACHE,
      "updateBenefit",
    );
  } catch (err) {
    console.error(
      `[updateBenefit] Failed to invalidate employee eligibility caches for benefit ${id}:`,
      err,
    );
  }

  return mapBenefitRecordToGraphql(row);
};
