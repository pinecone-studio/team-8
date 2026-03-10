import { describe, expect, it } from "vitest";

import type { EmployeeSnapshot } from "./evaluator";
import { buildEligibilityPersistenceBundle, getEligibilityCacheKeys } from "./persistence";

function daysAgo(days: number): string {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() - days);
  return now.toISOString();
}

const employee: EmployeeSnapshot = {
  id: "emp-100",
  role: "engineer",
  responsibilityLevel: 1,
  employmentStatus: "active",
  hireDate: daysAgo(365),
  okrSubmitted: true,
  lateArrivalCount: 1
};

describe("eligibility persistence bundle", () => {
  it("builds benefit eligibility rows and audit log rows for every benefit", () => {
    const bundle = buildEligibilityPersistenceBundle({
      employee,
      trigger: "okr_sync",
      actor: {
        actorId: "system",
        actorRole: "system"
      },
      computedAt: "2026-03-09T00:00:00.000Z"
    });

    expect(bundle.evaluations.length).toBe(11);
    expect(bundle.benefitEligibilityRows.length).toBe(11);
    expect(bundle.auditLogRows.length).toBe(11);
    expect(bundle.auditLogRows[0]?.reason).toContain("okr_sync");
  });

  it("returns deterministic cache keys to invalidate for an employee", () => {
    expect(getEligibilityCacheKeys("emp-100")).toEqual([
      "employee:emp-100:benefits",
      "employee:emp-100:eligibility",
      "employee:emp-100:dashboard"
    ]);
  });
});

