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
  const flowType = input.flowType ?? (input.requiresContract ? "contract" : "normal");
  if (flowType === "screen_time" && input.requiresContract) {
    throw new Error("Screen time benefits cannot require a contract.");
  }
  if (flowType === "contract" && (!input.amount || input.amount <= 0)) {
    throw new Error("Contract-based benefits must include a valid total price.");
  }
  if (flowType === "contract" && input.subsidyPercent >= 100) {
    throw new Error("Contract-based benefits must leave an employee payment share. Set company subsidy below 100%.");
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
