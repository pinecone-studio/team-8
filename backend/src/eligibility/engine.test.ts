import { describe, it, expect } from "vitest";
import {
  evaluateBenefit,
  computeStatus,
  getBenefitConfig,
  getAllBenefitConfigs,
} from "./engine";
import type { Employee } from "../db/employee";

/** Full-time active employee, OKR submitted, good attendance — qualifies for most benefits. */
const eligibleEmployee: Employee = {
  id: "emp-1",
  email: "e@co.com",
  clerkUserId: null,
  avatarUrl: null,
  name: "Test",
  nameEng: null,
  role: "engineer",
  department: "Eng",
  responsibilityLevel: 2,
  employmentStatus: "active",
  hireDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~400 days ago
  okrSubmitted: 1,
  lateArrivalCount: 0,
  lateArrivalUpdatedAt: null,
  createdAt: "",
  updatedAt: "",
};

/** On probation — locked from gym, insurance, etc. */
const probationEmployee: Employee = {
  ...eligibleEmployee,
  id: "emp-prob",
  employmentStatus: "probation",
};

/** OKR not submitted — locked from non-core benefits. */
const noOkrEmployee: Employee = {
  ...eligibleEmployee,
  id: "emp-nookr",
  okrSubmitted: 0,
};

/** Too many late arrivals. */
const badAttendanceEmployee: Employee = {
  ...eligibleEmployee,
  id: "emp-late",
  lateArrivalCount: 3,
};

/** UX role for ux_engineer_tools. */
const uxEmployee: Employee = {
  ...eligibleEmployee,
  id: "emp-ux",
  role: "ux_engineer",
};

describe("Eligibility engine (no GraphQL)", () => {
  describe("getBenefitConfig / getAllBenefitConfigs", () => {
    it("returns config for known benefit", () => {
      const cfg = getBenefitConfig("gym_pinefit");
      expect(cfg).toBeDefined();
      expect(cfg?.name).toBe("Gym — PineFit 50%");
      expect(cfg?.rules.length).toBeGreaterThan(0);
    });

    it("returns undefined for unknown benefit", () => {
      expect(getBenefitConfig("unknown")).toBeUndefined();
    });

    it("returns all 11 benefits", () => {
      const all = getAllBenefitConfigs();
      expect(all).toHaveLength(11);
    });
  });

  describe("evaluateBenefit — rules only", () => {
    it("eligible employee passes gym_pinefit", () => {
      const r = evaluateBenefit(eligibleEmployee, "gym_pinefit");
      expect(r.status).toBe("eligible");
      expect(r.ruleEvaluation.every((e) => e.passed)).toBe(true);
    });

    it("probation employee is locked for gym_pinefit", () => {
      const r = evaluateBenefit(probationEmployee, "gym_pinefit");
      expect(r.status).toBe("locked");
      expect(r.failedRule?.errorMessage).toContain("probation");
    });

    it("no OKR employee is locked for gym_pinefit", () => {
      const r = evaluateBenefit(noOkrEmployee, "gym_pinefit");
      expect(r.status).toBe("locked");
      expect(r.failedRule?.errorMessage).toMatch(/OKR/i);
    });

    it("bad attendance employee is locked for gym_pinefit", () => {
      const r = evaluateBenefit(badAttendanceEmployee, "gym_pinefit");
      expect(r.status).toBe("locked");
      expect(r.failedRule?.errorMessage).toMatch(/[Aa]ttendance/);
    });

    it("digital_wellness (core) only requires not terminated", () => {
      const r = evaluateBenefit(probationEmployee, "digital_wellness");
      expect(r.status).toBe("eligible");
    });

    it("ux_engineer_tools requires role ux_engineer", () => {
      expect(evaluateBenefit(eligibleEmployee, "ux_engineer_tools").status).toBe("locked");
      expect(evaluateBenefit(uxEmployee, "ux_engineer_tools").status).toBe("eligible");
    });

    it("extra_responsibility requires responsibility_level >= 2", () => {
      const level1 = { ...eligibleEmployee, responsibilityLevel: 1 };
      expect(evaluateBenefit(level1, "extra_responsibility").status).toBe("locked");
      expect(evaluateBenefit(eligibleEmployee, "extra_responsibility").status).toBe("eligible");
    });

    it("unknown benefit returns locked", () => {
      const r = evaluateBenefit(eligibleEmployee, "unknown_benefit");
      expect(r.status).toBe("locked");
      expect(r.failedRule?.errorMessage).toBe("Unknown benefit.");
    });
  });

  describe("computeStatus — ACTIVE / ELIGIBLE / LOCKED / PENDING", () => {
    it("eligible + no request → ELIGIBLE", () => {
      const r = computeStatus(eligibleEmployee, "gym_pinefit");
      expect(r.status).toBe("ELIGIBLE");
    });

    it("eligible + approved request → ACTIVE", () => {
      const r = computeStatus(eligibleEmployee, "gym_pinefit", "approved");
      expect(r.status).toBe("ACTIVE");
    });

    it("eligible + pending request → PENDING", () => {
      const r = computeStatus(eligibleEmployee, "gym_pinefit", "pending");
      expect(r.status).toBe("PENDING");
    });

    it("eligible + rejected/cancelled → ELIGIBLE (can request again)", () => {
      expect(computeStatus(eligibleEmployee, "gym_pinefit", "rejected").status).toBe("ELIGIBLE");
      expect(computeStatus(eligibleEmployee, "gym_pinefit", "cancelled").status).toBe("ELIGIBLE");
    });

    it("rules fail → LOCKED regardless of request status", () => {
      expect(computeStatus(probationEmployee, "gym_pinefit").status).toBe("LOCKED");
      expect(computeStatus(probationEmployee, "gym_pinefit", "pending").status).toBe("LOCKED");
      expect(computeStatus(probationEmployee, "gym_pinefit", "approved").status).toBe("LOCKED");
    });
  });
});
