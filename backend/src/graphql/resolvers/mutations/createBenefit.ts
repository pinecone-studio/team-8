import { schema } from "../../../db";
import type { GraphQLContext } from "../../context";
import { mapBenefitRecordToGraphql } from "../helpers/employeeBenefits";
import { requireHrAdmin } from "../../../auth";
import { invalidateAllEmployeeEligibilityCaches } from "../helpers/benefitCatalogRefresh";

export const createBenefit = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      name: string;
      description?: string | null;
      category: string;
      subsidyPercent: number;
      vendorName?: string | null;
      requiresContract?: boolean | null;
      flowType?: string | null;
      approvalPolicy?: string | null;
      flowType?: "contract" | "normal" | "down_payment" | "self_service" | null;
      amount?: number | null;
      location?: string | null;
      imageUrl?: string | null;
    };
  },
  { db, env, currentEmployee }: GraphQLContext,
) => {
  requireHrAdmin(currentEmployee);
  const flowType = input.flowType ?? (input.requiresContract ? "contract" : "normal");
  if (flowType === "screen_time" && input.requiresContract) {
    throw new Error("Screen time benefits cannot require a contract.");
  }
  const [row] = await db
    .insert(schema.benefits)
    .values({
      name: input.name,
      description: input.description ?? null,
      category: input.category,
      subsidyPercent: input.subsidyPercent,
      vendorName: input.vendorName ?? null,
      requiresContract: flowType === "screen_time" ? false : input.requiresContract ?? false,
      flowType,
      approvalPolicy: input.approvalPolicy ?? "hr",
      flowType:
        input.flowType ??
        (input.requiresContract ? "contract" : "normal"),
      amount: input.amount ?? null,
      location: input.location ?? null,
      imageUrl: input.imageUrl ?? null,
    })
    .returning();
  if (!row) throw new Error("Failed to create benefit");

  try {
    await invalidateAllEmployeeEligibilityCaches(
      db,
      env.ELIGIBILITY_CACHE,
      "createBenefit",
    );
  } catch (err) {
    console.error(
      `[createBenefit] Failed to invalidate employee eligibility caches for benefit ${row.id}:`,
      err,
    );
  }

  return mapBenefitRecordToGraphql(row);
};
