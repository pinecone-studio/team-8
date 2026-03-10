import { describe, expect, it } from "vitest";

import { benefitCatalog } from "@ebms/config";

import { evaluateAllBenefits, evaluateBenefit, type EmployeeSnapshot } from "./evaluator";

function daysAgo(days: number): string {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() - days);
  return now.toISOString();
}

function baseEmployee(overrides: Partial<EmployeeSnapshot> = {}): EmployeeSnapshot {
  return {
    id: "emp-001",
    role: "engineer",
    responsibilityLevel: 1,
    employmentStatus: "active",
    hireDate: daysAgo(400),
    okrSubmitted: true,
    lateArrivalCount: 0,
    ...overrides
  };
}

describe("eligibility evaluator", () => {
  it("marks Gym as eligible when all rules pass", () => {
    const gym = benefitCatalog.find((benefit) => benefit.slug === "gym-pinefit");

    const result = evaluateBenefit(baseEmployee(), gym!);

    expect(result.status).toBe("eligible");
    expect(result.evaluations.every((entry) => entry.passed)).toBe(true);
  });

  it("locks probationary employees out of Gym", () => {
    const gym = benefitCatalog.find((benefit) => benefit.slug === "gym-pinefit");

    const result = evaluateBenefit(
      baseEmployee({
        employmentStatus: "probation"
      }),
      gym!
    );

    expect(result.status).toBe("locked");
    expect(result.evaluations.some((entry) => entry.passed === false)).toBe(true);
  });

  it("keeps Digital Wellness available even when OKR is not submitted", () => {
    const digitalWellness = benefitCatalog.find((benefit) => benefit.slug === "digital-wellness");

    const result = evaluateBenefit(
      baseEmployee({
        okrSubmitted: false,
        lateArrivalCount: 4
      }),
      digitalWellness!
    );

    expect(result.status).toBe("eligible");
  });

  it("locks attendance-gated benefits when late arrivals reach three", () => {
    const results = evaluateAllBenefits(
      baseEmployee({
        lateArrivalCount: 3
      })
    );

    const gym = results.find((entry) => entry.benefitSlug === "gym-pinefit");
    const remoteWork = results.find((entry) => entry.benefitSlug === "remote-work");

    expect(gym?.status).toBe("locked");
    expect(remoteWork?.status).toBe("locked");
  });

  it("locks tenure-gated MacBook benefit before 180 days", () => {
    const macbook = benefitCatalog.find((benefit) => benefit.slug === "macbook");

    const result = evaluateBenefit(
      baseEmployee({
        hireDate: daysAgo(90)
      }),
      macbook!
    );

    expect(result.status).toBe("locked");
    expect(
      result.evaluations.find((entry) => entry.ruleType === "tenure_days")?.passed
    ).toBe(false);
  });
});
