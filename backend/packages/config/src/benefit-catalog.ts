export type BenefitCategory =
  | "wellness"
  | "equipment"
  | "financial"
  | "career"
  | "flexibility";

export type RuleType =
  | "employment_status"
  | "okr_submitted"
  | "attendance"
  | "responsibility_level"
  | "role"
  | "tenure_days";

export type RuleOperator = "eq" | "neq" | "gte" | "lte" | "in" | "not_in";

export interface BenefitRuleSeed {
  id: string;
  ruleType: RuleType;
  operator: RuleOperator;
  value: string | number | boolean | string[];
  errorMessage: string;
  priority: number;
}

export interface BenefitSeed {
  id: string;
  slug: string;
  name: string;
  category: BenefitCategory;
  subsidyPercent: number;
  vendorName: string | null;
  requiresContract: boolean;
  requiresFinanceApproval: boolean;
  requiresManagerApproval: boolean;
  isCoreBenefit: boolean;
  rules: BenefitRuleSeed[];
}

export const benefitCatalog: BenefitSeed[] = [
  {
    id: "benefit-gym-pinefit",
    slug: "gym-pinefit",
    name: "Gym - PineFit",
    category: "wellness",
    subsidyPercent: 50,
    vendorName: "PineFit",
    requiresContract: true,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "gym-employment-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Not available during probation or leave.",
        priority: 10
      },
      {
        id: "gym-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "Submit your current OKR to unlock this benefit.",
        priority: 20
      },
      {
        id: "gym-attendance",
        ruleType: "attendance",
        operator: "lte",
        value: 2,
        errorMessage: "Attendance threshold exceeded this month.",
        priority: 30
      }
    ]
  },
  {
    id: "benefit-private-insurance",
    slug: "private-insurance",
    name: "Private Insurance",
    category: "wellness",
    subsidyPercent: 50,
    vendorName: "Insurance Partner",
    requiresContract: true,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "insurance-employment-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Not available during probation or leave.",
        priority: 10
      },
      {
        id: "insurance-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "Submit your current OKR to unlock this benefit.",
        priority: 20
      },
      {
        id: "insurance-attendance",
        ruleType: "attendance",
        operator: "lte",
        value: 2,
        errorMessage: "Attendance threshold exceeded this month.",
        priority: 30
      }
    ]
  },
  {
    id: "benefit-digital-wellness",
    slug: "digital-wellness",
    name: "Digital Wellness",
    category: "wellness",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: true,
    rules: [
      {
        id: "digital-wellness-status",
        ruleType: "employment_status",
        operator: "neq",
        value: "terminated",
        errorMessage: "Not available after termination.",
        priority: 10
      }
    ]
  },
  {
    id: "benefit-macbook",
    slug: "macbook",
    name: "MacBook Subsidy",
    category: "equipment",
    subsidyPercent: 50,
    vendorName: "Apple Reseller",
    requiresContract: true,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "macbook-tenure",
        ruleType: "tenure_days",
        operator: "gte",
        value: 180,
        errorMessage: "Available after 6 months of employment.",
        priority: 10
      },
      {
        id: "macbook-employment-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Not available during probation or leave.",
        priority: 20
      },
      {
        id: "macbook-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "Submit your current OKR to unlock this benefit.",
        priority: 30
      },
      {
        id: "macbook-responsibility",
        ruleType: "responsibility_level",
        operator: "gte",
        value: 1,
        errorMessage: "Requires level 1 or above.",
        priority: 40
      }
    ]
  },
  {
    id: "benefit-extra-responsibility",
    slug: "extra-responsibility",
    name: "Extra Responsibility",
    category: "career",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "extra-responsibility-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Not available during probation.",
        priority: 10
      },
      {
        id: "extra-responsibility-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "OKR submission required.",
        priority: 20
      },
      {
        id: "extra-responsibility-attendance",
        ruleType: "attendance",
        operator: "lte",
        value: 2,
        errorMessage: "Attendance threshold exceeded.",
        priority: 30
      },
      {
        id: "extra-responsibility-level",
        ruleType: "responsibility_level",
        operator: "gte",
        value: 2,
        errorMessage: "Requires Senior level (Level 2+).",
        priority: 40
      }
    ]
  },
  {
    id: "benefit-ux-engineer-tools",
    slug: "ux-engineer-tools",
    name: "UX Engineer Tools",
    category: "career",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "ux-tools-role",
        ruleType: "role",
        operator: "eq",
        value: "ux_engineer",
        errorMessage: "Available to UX/Design role only.",
        priority: 10
      },
      {
        id: "ux-tools-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Active employment required.",
        priority: 20
      },
      {
        id: "ux-tools-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "OKR submission required.",
        priority: 30
      }
    ]
  },
  {
    id: "benefit-down-payment",
    slug: "down-payment",
    name: "Down Payment Assistance",
    category: "financial",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: true,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "down-payment-tenure",
        ruleType: "tenure_days",
        operator: "gte",
        value: 730,
        errorMessage: "Available after 2 years of employment.",
        priority: 10
      },
      {
        id: "down-payment-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Active employment required.",
        priority: 20
      },
      {
        id: "down-payment-level",
        ruleType: "responsibility_level",
        operator: "gte",
        value: 2,
        errorMessage: "Requires Senior level (Level 2+).",
        priority: 30
      },
      {
        id: "down-payment-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "OKR submission required.",
        priority: 40
      }
    ]
  },
  {
    id: "benefit-shit-happened-days",
    slug: "shit-happened-days",
    name: "Shit Happened Days",
    category: "flexibility",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: true,
    rules: [
      {
        id: "shd-status",
        ruleType: "employment_status",
        operator: "in",
        value: ["probation", "active"],
        errorMessage: "Probation allocation: 1 day maximum.",
        priority: 10
      }
    ]
  },
  {
    id: "benefit-remote-work",
    slug: "remote-work",
    name: "Remote Work",
    category: "flexibility",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: false,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "remote-work-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Not available during probation.",
        priority: 10
      },
      {
        id: "remote-work-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "OKR submission required.",
        priority: 20
      },
      {
        id: "remote-work-attendance",
        ruleType: "attendance",
        operator: "lte",
        value: 2,
        errorMessage: "Attendance threshold exceeded.",
        priority: 30
      }
    ]
  },
  {
    id: "benefit-travel",
    slug: "travel",
    name: "Travel",
    category: "financial",
    subsidyPercent: 50,
    vendorName: "Travel Partner",
    requiresContract: true,
    requiresFinanceApproval: false,
    requiresManagerApproval: true,
    isCoreBenefit: false,
    rules: [
      {
        id: "travel-tenure",
        ruleType: "tenure_days",
        operator: "gte",
        value: 365,
        errorMessage: "Available after 12 months of employment.",
        priority: 10
      },
      {
        id: "travel-level",
        ruleType: "responsibility_level",
        operator: "gte",
        value: 1,
        errorMessage: "Requires level 1 or above.",
        priority: 20
      },
      {
        id: "travel-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "OKR submission required.",
        priority: 30
      }
    ]
  },
  {
    id: "benefit-bonus-based-on-okr",
    slug: "bonus-based-on-okr",
    name: "Bonus Based on OKR",
    category: "financial",
    subsidyPercent: 100,
    vendorName: null,
    requiresContract: false,
    requiresFinanceApproval: true,
    requiresManagerApproval: false,
    isCoreBenefit: false,
    rules: [
      {
        id: "bonus-okr",
        ruleType: "okr_submitted",
        operator: "eq",
        value: true,
        errorMessage: "OKR not submitted or score below threshold.",
        priority: 10
      },
      {
        id: "bonus-attendance",
        ruleType: "attendance",
        operator: "lte",
        value: 2,
        errorMessage: "Attendance threshold exceeded.",
        priority: 20
      },
      {
        id: "bonus-status",
        ruleType: "employment_status",
        operator: "eq",
        value: "active",
        errorMessage: "Active employment required.",
        priority: 30
      }
    ]
  }
];
