import { requireHrAdmin } from "../../../auth";
import type { GraphQLContext } from "../../context";
import { ensureScreenTimeBenefit, upsertScreenTimeProgramConfig } from "../../../screen-time/service";
import { writeAuditLog } from "../helpers/audit";

export const upsertScreenTimeProgram = async (
  _: unknown,
  {
    input,
  }: {
    input: {
      benefitId: string;
      screenshotRetentionDays?: number | null;
      winnerPercent: number;
      rewardAmountMnt: number;
    };
  },
  { db, currentEmployee }: GraphQLContext,
) => {
  const actor = requireHrAdmin(currentEmployee);
  await ensureScreenTimeBenefit(db, input.benefitId);

  const program = await upsertScreenTimeProgramConfig(db, input);

  await writeAuditLog({
    db,
    actor,
    actionType: "SCREEN_TIME_PROGRAM_UPSERTED",
    entityType: "screen_time_program",
    entityId: input.benefitId,
    benefitId: input.benefitId,
    metadata: {
      screenshotRetentionDays: program.screenshotRetentionDays,
      winnerPercent: program.winnerPercent,
      rewardAmountMnt: program.rewardAmountMnt,
    },
  });

  return program;
};
