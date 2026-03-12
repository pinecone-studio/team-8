import { eq } from "drizzle-orm";
import { schema } from "../../../db";
import { getBenefitConfig } from "../../../eligibility";

export const confirmBenefitRequest = async (
  _: unknown,
  { requestId, contractAccepted }: { requestId: string; contractAccepted: boolean },
  { db }: { db: import("../../../db").Database }
) => {
  const requests = await db
    .select()
    .from(schema.benefitRequests)
    .where(eq(schema.benefitRequests.id, requestId));
  const req = requests[0];
  if (!req) throw new Error("Benefit request not found");

  if (!contractAccepted) {
    const [updated] = await db
      .update(schema.benefitRequests)
      .set({ status: "cancelled", updatedAt: new Date().toISOString() })
      .where(eq(schema.benefitRequests.id, requestId))
      .returning();
    return updated;
  }

  const benefitConfig = getBenefitConfig(req.benefitId);
  let contractVersionAccepted: string | null = null;
  const contractAcceptedAt = new Date().toISOString();

  if (benefitConfig?.requiresContract) {
    const contracts = await db
      .select()
      .from(schema.contracts)
      .where(eq(schema.contracts.benefitId, req.benefitId));
    const active = contracts.find((c) => c.isActive);
    contractVersionAccepted = active ? `${active.version}:${active.sha256Hash}` : null;
  }

  const [updated] = await db
    .update(schema.benefitRequests)
    .set({
      contractVersionAccepted,
      contractAcceptedAt,
      employeeApprovedAt: contractAccepted ? contractAcceptedAt : null,
      updatedAt: contractAcceptedAt,
    })
    .where(eq(schema.benefitRequests.id, requestId))
    .returning();

  return updated;
};
