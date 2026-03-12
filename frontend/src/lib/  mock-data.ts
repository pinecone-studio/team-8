export type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "PENDING" | "LOCKED";

export type EligibilityItem = {
  label: string;
  detail: string;
  met: boolean;
};

export type Benefit = {
  id: string;
  name: string;
  vendor: string;
  category: string;
  description: string;
  subsidy: string;
  status: BenefitStatus;
  contractRequired: boolean;
  icon: string;
  eligibility: EligibilityItem[];
  lockMessage?: string;
};

export const benefits: Benefit[] = [
  {
    id: "gym-membership",
    name: "Gym Membership",
    vendor: "PineFit",
    category: "WELLNESS",
    description:
      "Access to premium gym facilities with personal training sessions",
    subsidy: "50%",
    status: "ELIGIBLE",
    contractRequired: true,
    icon: "dumbbell",
    eligibility: [
      {
        label: "Employment Status",
        detail: "Must be a permanent employee",
        met: true,
      },
      {
        label: "OKR Submission",
        detail: "Must have submitted current quarter OKRs",
        met: true,
      },
      {
        label: "Attendance",
        detail: "Less than 3 late arrivals this month",
        met: true,
      },
      {
        label: "Responsibility Level",
        detail: "Level 2 or above",
        met: true,
      },
    ],
  },
  {
    id: "private-health-insurance",
    name: "Private Health Insurance",
    vendor: "HealthPlus",
    category: "WELLNESS",
    description: "Comprehensive health coverage including dental and vision",
    subsidy: "50%",
    status: "ACTIVE",
    contractRequired: false,
    icon: "heart",
    eligibility: [
      {
        label: "Employment Status",
        detail: "Permanent employee",
        met: true,
      },
      {
        label: "Minimum Employment",
        detail: "At least 3 months employed",
        met: true,
      },
      {
        label: "Department Approval",
        detail: "Approved by department manager",
        met: true,
      },
    ],
  },
  {
    id: "digital-wellness",
    name: "Digital Wellness",
    vendor: "Calm & Headspace",
    category: "WELLNESS",
    description: "Meditation and mental health apps subscription",
    subsidy: "100%",
    status: "ACTIVE",
    contractRequired: false,
    icon: "brain",
    eligibility: [
      {
        label: "Availability",
        detail: "Available to all employees",
        met: true,
      },
      {
        label: "Approval",
        detail: "No manager approval needed",
        met: true,
      },
    ],
  },
  {
    id: "remote-work-stipend",
    name: "Remote Work Stipend",
    vendor: "Company",
    category: "FLEXIBILITY",
    description: "Monthly allowance for home office setup and internet",
    subsidy: "100%",
    status: "ACTIVE",
    contractRequired: false,
    icon: "home",
    eligibility: [
      {
        label: "Work Mode",
        detail: "Remote or hybrid employee",
        met: true,
      },
      {
        label: "Manager Approval",
        detail: "Approved by your reporting manager",
        met: true,
      },
    ],
  },
  {
    id: "macbook-subsidy",
    name: "MacBook Subsidy",
    vendor: "Apple",
    category: "EQUIPMENT",
    description: "One-time subsidy for purchasing a MacBook Pro",
    subsidy: "50%",
    status: "ELIGIBLE",
    contractRequired: true,
    icon: "laptop",
    eligibility: [
      {
        label: "Department",
        detail: "Engineering or Product team",
        met: true,
      },
      {
        label: "Minimum Employment",
        detail: "At least 12 months employed",
        met: true,
      },
      {
        label: "Asset Agreement",
        detail: "Asset agreement must be signed",
        met: true,
      },
    ],
  },
  {
    id: "travel-insurance",
    name: "Travel Insurance",
    vendor: "TravelGuard",
    category: "FLEXIBILITY",
    description: "Annual travel insurance for business and personal trips",
    subsidy: "75%",
    status: "PENDING",
    contractRequired: true,
    icon: "plane",
    eligibility: [
      {
        label: "OKR Submission",
        detail: "Current quarter OKRs submitted",
        met: true,
      },
      {
        label: "Manager Approval",
        detail: "Awaiting manager review",
        met: true,
      },
    ],
  },
  {
    id: "stock-options",
    name: "Stock Options",
    vendor: "Company",
    category: "FINANCIAL",
    description: "Employee stock ownership plan participation",
    subsidy: "100%",
    status: "LOCKED",
    contractRequired: true,
    icon: "chart",
    eligibility: [
      {
        label: "Employment Status",
        detail: "Must be a permanent employee",
        met: true,
      },
      {
        label: "Responsibility Level",
        detail: "Level 4 or above",
        met: false,
      },
      {
        label: "Tenure",
        detail: "Minimum 2 years of employment",
        met: false,
      },
    ],
    lockMessage: "Requires Level 4 responsibility and 2+ years tenure",
  },
];

export const dashboardStats = {
  active: benefits.filter((b) => b.status === "ACTIVE").length,
  eligible: benefits.filter((b) => b.status === "ELIGIBLE").length,
  pending: benefits.filter((b) => b.status === "PENDING").length,
};

export const getBenefitById = (id: string) =>
  benefits.find((benefit) => benefit.id === id);
