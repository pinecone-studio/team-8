"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  ImageIcon,
  Info,
  LayoutGrid,
  MapPin,
  Monitor,
  Plus,
  RefreshCw,
  Send,
  Shield,
  Trash2,
  Upload,
  UserCheck,
  Wallet,
  Zap,
} from "lucide-react";
import Sidebar from "../../_components/SideBar";
import {
  BenefitFlowType,
  useCreateBenefitMutation,
  useProposeRuleChangeMutation,
  useUpsertScreenTimeProgramMutation,
  GetAdminBenefitsDocument,
} from "@/graphql/generated/graphql";
import { useCurrentEmployee } from "@/lib/current-employee-provider";
import { isHrAdmin } from "../../_lib/access";

// ── Benefit type config ───────────────────────────────────────────────────────

type BenefitTypeKey =
  | "contract"
  | "normal"
  | "finance"
  | "viewonly"
  | "screen_time";

const BENEFIT_TYPES: {
  key: BenefitTypeKey;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  bg: string;
  examples: string[];
  requiresContract: boolean;
  approvalPolicy: string;
  flowType: BenefitFlowType;
}[] = [
  {
    key: "contract",
    label: "Contract-based",
    desc: "Requires contract signature before activation",
    icon: <FileText className="h-5 w-5" />,
    color: "text-violet-600",
    border: "border-violet-200",
    bg: "bg-violet-50",
    examples: ["Gym", "MacBook", "Travel", "EMD"],
    requiresContract: true,
    approvalPolicy: "hr",
    flowType: BenefitFlowType.Contract,
  },
  {
    key: "normal",
    label: "Normal Benefit",
    desc: "Standard request, approved by HR",
    icon: <UserCheck className="h-5 w-5" />,
    color: "text-emerald-600",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    examples: ["Extra Responsibility", "UX Engineer Tools"],
    requiresContract: false,
    approvalPolicy: "hr",
    flowType: BenefitFlowType.Normal,
  },
  {
    key: "finance",
    label: "Finance Benefit",
    desc: "Employee requests an amount, reviewed by Finance",
    icon: <Wallet className="h-5 w-5" />,
    color: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    examples: ["Down Payment Assistance"],
    requiresContract: true,
    approvalPolicy: "dual",
    flowType: BenefitFlowType.DownPayment,
  },
  {
    key: "viewonly",
    label: "Automatic / View-only",
    desc: "No request needed, automatically visible on dashboard",
    icon: <Monitor className="h-5 w-5" />,
    color: "text-orange-600",
    border: "border-orange-200",
    bg: "bg-orange-50",
    examples: ["Remote Work", "Shit Happened Days", "OKR Bonus"],
    requiresContract: false,
    approvalPolicy: "hr",
    flowType: BenefitFlowType.SelfService,
  },
];

type WorkflowStep = {
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
};

const WORKFLOWS: Record<BenefitTypeKey, WorkflowStep[]> = {
  contract: [
    {
      icon: <Send className="h-4 w-4" />,
      label: "Employee Request",
      desc: "Employee submits a benefit request",
      color: "bg-slate-100 text-slate-600",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Contract Generated",
      desc: "Contract is automatically created",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: <Eye className="h-4 w-4" />,
      label: "Employee Signs",
      desc: "Employee reviews and signs the contract",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: <UserCheck className="h-4 w-4" />,
      label: "HR Review",
      desc: "HR admin reviews the request",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "Approved",
      desc: "Benefit becomes active",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <CreditCard className="h-4 w-4" />,
      label: "Payment",
      desc: "Processed by vendor",
      color: "bg-emerald-100 text-emerald-600",
    },
  ],
  normal: [
    {
      icon: <Send className="h-4 w-4" />,
      label: "Employee Request",
      desc: "Employee submits a benefit request",
      color: "bg-slate-100 text-slate-600",
    },
    {
      icon: <UserCheck className="h-4 w-4" />,
      label: "HR Review",
      desc: "HR admin reviews the request",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "Approve / Decline",
      desc: "Final decision is made",
      color: "bg-emerald-100 text-emerald-600",
    },
  ],
  finance: [
    {
      icon: <Wallet className="h-4 w-4" />,
      label: "Amount Request",
      desc: "Employee submits the amount needed",
      color: "bg-slate-100 text-slate-600",
    },
    {
      icon: <LayoutGrid className="h-4 w-4" />,
      label: "Finance Proposal",
      desc: "Finance team proposes a repayment plan",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <UserCheck className="h-4 w-4" />,
      label: "Employee Decision",
      desc: "Employee accepts or declines the plan",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Contract Generated",
      desc: "Contract is automatically created",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: "HR / C-Level Approval",
      desc: "Final sign-off",
      color: "bg-emerald-100 text-emerald-600",
    },
  ],
  viewonly: [
    {
      icon: <Zap className="h-4 w-4" />,
      label: "System Eligibility Check",
      desc: "Eligibility is evaluated automatically",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <Monitor className="h-4 w-4" />,
      label: "Visible on Dashboard",
      desc: "Employee sees their benefit status",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <RefreshCw className="h-4 w-4" />,
      label: "Auto-update",
      desc: "Status updates in real-time",
      color: "bg-slate-100 text-slate-600",
    },
  ],
  screen_time: [
    {
      icon: <Monitor className="h-4 w-4" />,
      label: "Friday Screenshot",
      desc: "Employee uploads a 7-day average screenshot every required Friday slot",
      color: "bg-fuchsia-100 text-fuchsia-600",
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: "Gemini Extraction",
      desc: "System extracts average daily screen time automatically",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "Monthly Ranking",
      desc: "All required Friday slots must be present to stay in the competition",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <Wallet className="h-4 w-4" />,
      label: "Cash Reward",
      desc: "The top X% employees receive a fixed MNT reward",
      color: "bg-emerald-100 text-emerald-600",
    },
  ],
};

function getWorkflowPreviewSteps(
  type: BenefitTypeKey,
  options?: { hasPricing?: boolean },
): WorkflowStep[] {
  if (type === "normal" && options?.hasPricing) {
    return [
      { icon: <Send className="h-4 w-4" />, label: "Employee Request", desc: "Employee submits a benefit request", color: "bg-slate-100 text-slate-600" },
      { icon: <UserCheck className="h-4 w-4" />, label: "HR Review", desc: "HR admin reviews the request", color: "bg-blue-100 text-blue-600" },
      { icon: <CreditCard className="h-4 w-4" />, label: "Bonum Payment", desc: "Employee pays the remaining balance through Bonum", color: "bg-amber-100 text-amber-600" },
      { icon: <CheckCircle2 className="h-4 w-4" />, label: "Approved", desc: "Benefit becomes active automatically after payment", color: "bg-emerald-100 text-emerald-600" },
    ];
  }

  return WORKFLOWS[type];
}

// ── Rule builder config ───────────────────────────────────────────────────────

type RuleFieldKey =
  | "employment_status"
  | "okr_submitted"
  | "attendance"
  | "responsibility_level"
  | "role"
  | "tenure_days";

const RULE_FIELDS: {
  key: RuleFieldKey;
  label: string;
  valueType: "select" | "boolean" | "number" | "text";
  options?: { value: string; label: string }[];
  unit?: string;
  defaultValue: string;
  operators: { value: string; label: string }[];
  preview: (op: string, val: string) => string;
  defaultError: (op: string, val: string) => string;
}[] = [
  {
    key: "employment_status",
    label: "Employment Status",
    valueType: "select",
    options: [
      { value: '"active"', label: "Active" },
      { value: '"probation"', label: "Probation" },
      { value: '"leave"', label: "On Leave" },
      { value: '"terminated"', label: "Terminated" },
    ],
    defaultValue: '"active"',
    operators: [
      { value: "eq", label: "is" },
      { value: "neq", label: "is not" },
    ],
    preview: (op, val) => {
      const label =
        {
          '"active"': "active",
          '"probation"': "on probation",
          '"leave"': "on leave",
          '"terminated"': "terminated",
        }[val] ?? val;
      return op === "eq"
        ? `Employee must be ${label}`
        : `Employee must not be ${label}`;
    },
    defaultError: (op, val) => {
      const label =
        { '"active"': "active", '"probation"': "on probation" }[val] ??
        "in the required status";
      return op === "eq"
        ? `Only ${label} employees are eligible.`
        : `Employees with this status are not eligible.`;
    },
  },
  {
    key: "okr_submitted",
    label: "OKR Submitted",
    valueType: "boolean",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    defaultValue: "true",
    operators: [{ value: "eq", label: "is" }],
    preview: (_, val) =>
      val === "true"
        ? "Employee must have submitted their OKR this quarter"
        : "OKR submission not required",
    defaultError: () => "Submit your quarterly OKR to unlock this benefit.",
  },
  {
    key: "attendance",
    label: "Attendance (late arrivals)",
    valueType: "number",
    unit: "times",
    defaultValue: "3",
    operators: [
      { value: "lt", label: "less than" },
      { value: "lte", label: "at most" },
      { value: "gte", label: "at least" },
    ],
    preview: (op, val) =>
      op === "lt"
        ? `Monthly late arrivals must be fewer than ${val}`
        : `Monthly late arrivals must be ${op === "lte" ? "at most" : "at least"} ${val}`,
    defaultError: (op, val) =>
      op === "lt"
        ? `Monthly late arrivals must be fewer than ${val}.`
        : `Attendance requirement not met.`,
  },
  {
    key: "responsibility_level",
    label: "Responsibility Level",
    valueType: "select",
    options: [
      { value: "1", label: "Standard (1)" },
      { value: "2", label: "Senior (2)" },
      { value: "3", label: "Lead (3)" },
      { value: "4", label: "Principal (4)" },
    ],
    defaultValue: "1",
    operators: [
      { value: "gte", label: "or above" },
      { value: "eq", label: "exactly" },
      { value: "lte", label: "or below" },
    ],
    preview: (op, val) => {
      const levels: Record<string, string> = {
        "1": "Standard",
        "2": "Senior",
        "3": "Lead",
        "4": "Principal",
      };
      return op === "gte"
        ? `Employee must be at least ${levels[val] ?? val} level`
        : `Employee responsibility level must be ${levels[val] ?? val}`;
    },
    defaultError: (_, val) => {
      const levels: Record<string, string> = {
        "1": "Standard",
        "2": "Senior",
        "3": "Lead",
        "4": "Principal",
      };
      return `Available to employees at ${levels[val] ?? val} level or above.`;
    },
  },
  {
    key: "role",
    label: "Role",
    valueType: "text",
    defaultValue: '"engineer"',
    operators: [
      { value: "eq", label: "is" },
      { value: "neq", label: "is not" },
    ],
    preview: (op, val) =>
      op === "eq"
        ? `Employee role must be ${val.replace(/"/g, "")}`
        : `Not available to employees with role ${val.replace(/"/g, "")}`,
    defaultError: (op, val) =>
      op === "eq"
        ? `Only available to ${val.replace(/"/g, "")} employees.`
        : `Employees with this role are not eligible.`,
  },
  {
    key: "tenure_days",
    label: "Tenure (days)",
    valueType: "number",
    unit: "days",
    defaultValue: "180",
    operators: [
      { value: "gte", label: "or more" },
      { value: "lte", label: "or less" },
      { value: "gt", label: "more than" },
    ],
    preview: (_op, val) => {
      const months = Math.round(Number(val) / 30);
      return `Employee must have been employed for at least ${months} month${months !== 1 ? "s" : ""}`;
    },
    defaultError: (_, val) => {
      const months = Math.round(Number(val) / 30);
      return `Available to employees with at least ${months} month${months !== 1 ? "s" : ""} of tenure.`;
    },
  },
];

type RuleRow = {
  id: string;
  fieldKey: RuleFieldKey;
  operator: string;
  value: string;
  errorMessage: string;
};

const CATEGORIES = [
  "wellness",
  "equipment",
  "financial",
  "career",
  "flexibility",
  "other",
];

function getFlowTypeForBenefitType(type: BenefitTypeKey): BenefitFlowType {
  if (type === "contract") return BenefitFlowType.Contract;
  if (type === "finance") return BenefitFlowType.DownPayment;
  if (type === "viewonly") return BenefitFlowType.SelfService;
  return BenefitFlowType.Normal;
}

function getApiBaseUrl(): string {
  const base =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GRAPHQL_URL) ||
    "https://team8-api.team8pinequest.workers.dev/";
  return base.replace(/\/$/, "");
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreateBenefitPage() {
  const router = useRouter();
  const { employee } = useCurrentEmployee();
  const { getToken } = useAuth();
  const canCreate = isHrAdmin(employee);

  const [selectedType, setSelectedType] = useState<BenefitTypeKey | null>(null);
  const [hasPricing, setHasPricing] = useState(false);
  const [viewOnlySubsidyEnabled, setViewOnlySubsidyEnabled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "wellness",
    subsidyPercent: 50,
    vendorName: "",
    amount: "" as string,
    location: "",
    effectiveDate: "",
    expiryDate: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractMeta, setContractMeta] = useState({
    version: "1.0",
    effectiveDate: "",
    expiryDate: "",
  });
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [screenTimeWinnerPercent, setScreenTimeWinnerPercent] = useState("20");
  const [screenTimeRewardAmountMnt, setScreenTimeRewardAmountMnt] = useState("100000");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createBenefit] = useCreateBenefitMutation({
    refetchQueries: [{ query: GetAdminBenefitsDocument }],
  });
  const [proposeRule] = useProposeRuleChangeMutation();
  const [upsertScreenTimeProgram] = useUpsertScreenTimeProgramMutation();

  const selectedTypeConfig = BENEFIT_TYPES.find((t) => t.key === selectedType);
  const workflowPreviewSteps = selectedType
    ? getWorkflowPreviewSteps(selectedType, { hasPricing })
    : [];

  function addRule() {
    const field = RULE_FIELDS[0];
    const op = field.operators[0].value;
    const val = field.defaultValue;
    setRules((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        fieldKey: field.key,
        operator: op,
        value: val,
        errorMessage: field.defaultError(op, val),
      },
    ]);
  }

  function updateRule(id: string, patch: Partial<RuleRow>) {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...patch };
        if (patch.fieldKey || patch.operator || patch.value) {
          const fieldCfg = RULE_FIELDS.find((f) => f.key === updated.fieldKey);
          if (fieldCfg) {
            updated.errorMessage = fieldCfg.defaultError(
              updated.operator,
              updated.value,
            );
          }
        }
        return updated;
      }),
    );
  }

  function removeRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function getRulePreview(rule: RuleRow): string {
    const fieldCfg = RULE_FIELDS.find((f) => f.key === rule.fieldKey);
    if (!fieldCfg) return "";
    return fieldCfg.preview(rule.operator, rule.value);
  }

  async function handleSubmit() {
    if (!selectedType || !form.name.trim()) {
      setError("Please select a benefit type and enter a name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const typeConfig = BENEFIT_TYPES.find((t) => t.key === selectedType)!;
      const apiBaseUrl = getApiBaseUrl();
      const descriptionTrimmed = form.description.trim();
      if (selectedType === "screen_time") {
        const parsedWinnerPercent = Number(screenTimeWinnerPercent);
        const parsedRewardAmount = Number(screenTimeRewardAmountMnt);
        if (!Number.isFinite(parsedWinnerPercent) || parsedWinnerPercent <= 0 || parsedWinnerPercent > 100) {
          throw new Error("Screen time winner percent must be between 1 and 100.");
        }
        if (!Number.isFinite(parsedRewardAmount) || parsedRewardAmount <= 0) {
          throw new Error("Screen time reward amount must be a positive MNT value.");
        }
      }
      if (
        selectedType === "contract" &&
        (!form.amount.trim() || Number(form.amount) <= 0)
      ) {
        throw new Error("Contract-based benefits require a valid total price.");
      }
      if (selectedType === "contract" && form.subsidyPercent >= 100) {
        throw new Error(
          "Contract-based benefits must leave an employee payment share. Set company subsidy below 100%.",
        );
      }
      if (selectedType === "normal" && hasPricing && (!form.amount.trim() || Number(form.amount) <= 0)) {
        throw new Error("Paid normal benefits require a valid total price.");
      }
      if (selectedType === "normal" && hasPricing && form.subsidyPercent >= 100) {
        throw new Error("Paid normal benefits must leave an employee payment share. Set company subsidy below 100%.");
      }
      const flowType = getFlowTypeForBenefitType(selectedType);
      const subsidyPercent =
        selectedType === "viewonly"
          ? viewOnlySubsidyEnabled
            ? 100
            : 0
          : form.subsidyPercent;
      // For normal type, only include amount when the payment toggle is on
      const amountNum =
        selectedType === "normal"
          ? hasPricing && form.amount.trim()
            ? Number(form.amount)
            : undefined
          : form.amount.trim()
            ? Number(form.amount)
            : undefined;
      const result = await createBenefit({
        variables: {
          input: {
            name: form.name.trim(),
            ...(descriptionTrimmed ? { description: descriptionTrimmed } : {}),
            category: form.category,
            subsidyPercent,
            vendorName: form.vendorName.trim() || undefined,
            requiresContract: typeConfig.requiresContract,
            approvalPolicy: typeConfig.approvalPolicy,
            flowType,
            ...(amountNum ? { amount: amountNum } : {}),
            ...(form.location.trim() ? { location: form.location.trim() } : {}),
          },
        },
      });
      const benefitId = result.data?.createBenefit.id;
      const token = await getToken();
      const uploadHeaders = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;

      // Upload image if selected
      if (benefitId && imageFile) {
        const imgData = new FormData();
        imgData.append("benefitId", benefitId);
        imgData.append("file", imageFile);
        const imageRes = await fetch(
          `${apiBaseUrl}/api/benefits/upload-image`,
          {
            method: "POST",
            body: imgData,
            headers: uploadHeaders,
          },
        );
        const imageJson = await imageRes.json().catch(() => ({}));
        if (!imageRes.ok) {
          throw new Error(
            imageJson?.error ||
              "Benefit was created, but the image upload failed.",
          );
        }
      }

      // Upload contract if this benefit requires it (contract-based + finance)
      if (benefitId && contractFile && typeConfig.requiresContract) {
        const today = new Date().toISOString().split("T")[0];
        const ctData = new FormData();
        ctData.append("benefitId", benefitId);
        ctData.append("version", contractMeta.version || "1.0");
        ctData.append("effectiveDate", contractMeta.effectiveDate || today);
        ctData.append("expiryDate", contractMeta.expiryDate || today);
        ctData.append("vendorName", form.vendorName.trim() || "Vendor");
        ctData.append("file", contractFile);
        const contractRes = await fetch(`${apiBaseUrl}/api/contracts/upload`, {
          method: "POST",
          body: ctData,
          headers: uploadHeaders,
        });
        const contractJson = await contractRes.json().catch(() => ({}));
        if (!contractRes.ok) {
          throw new Error(
            contractJson?.error ||
              "Benefit was created, but the contract upload failed.",
          );
        }
      }

      if (benefitId && selectedType === "screen_time") {
        await upsertScreenTimeProgram({
          variables: {
            input: {
              benefitId,
              winnerPercent: Number(screenTimeWinnerPercent),
              rewardAmountMnt: Number(screenTimeRewardAmountMnt),
            },
          },
        });
      }

      if (benefitId && rules.length > 0) {
        for (const rule of rules) {
          const fieldCfg = RULE_FIELDS.find((f) => f.key === rule.fieldKey)!;
          await proposeRule({
            variables: {
              input: {
                benefitId,
                changeType: "create",
                proposedData: JSON.stringify({
                  ruleType: rule.fieldKey,
                  operator: rule.operator,
                  value: rule.value,
                  errorMessage: rule.errorMessage,
                  priority: rules.indexOf(rule),
                  isActive: true,
                }),
                summary: `Add rule: ${fieldCfg.preview(rule.operator, rule.value)}`,
              },
            },
          });
        }
      }
      router.push(`/admin-panel/company-benefits/${benefitId}`);
    } catch (e: unknown) {
      let message = "Failed to create benefit. Please try again.";
      const err = e as {
        message?: string;
        graphQLErrors?: Array<{ message?: string }>;
        networkError?: Error & {
          result?: { errors?: Array<{ message?: string }>; message?: string };
        };
      };
      if (err?.graphQLErrors?.[0]?.message)
        message = err.graphQLErrors[0].message;
      else if (err?.networkError?.result?.errors?.[0]?.message)
        message = err.networkError.result.errors[0].message;
      else if (err?.networkError?.result?.message)
        message = err.networkError.result.message;
      else if (err?.networkError?.message) message = err.networkError.message;
      else if (err?.message) message = err.message;
      setError(message);
      setSaving(false);
    }
  }

  if (!canCreate) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">HR Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin-panel/company-benefits"
              className="flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Company Benefits
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-gray-700">
              Create New Benefit
            </span>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
            {/* ── LEFT: Form ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 xl:col-span-3">
              {/* Step 1: Benefit type */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                    1
                  </span>
                  <h2 className="text-base font-semibold text-gray-900">
                    Select Benefit Type
                  </h2>
                </div>
                <p className="mb-5 ml-8 text-sm text-gray-400">
                  The workflow preview updates automatically when you select a
                  type
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {BENEFIT_TYPES.map((type) => (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => setSelectedType(type.key)}
                      className={`group relative rounded-xl border-2 p-4 text-left transition-all ${
                        selectedType === type.key
                          ? `${type.border} ${type.bg}`
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${selectedType === type.key ? type.bg : "bg-gray-100"} ${selectedType === type.key ? type.color : "text-gray-500"}`}
                      >
                        {type.icon}
                      </div>
                      <p
                        className={`text-sm font-semibold ${selectedType === type.key ? "text-gray-900" : "text-gray-700"}`}
                      >
                        {type.label}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {type.desc}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {type.examples.map((ex) => (
                          <span
                            key={ex}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                      {selectedType === type.key && (
                        <div
                          className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${type.bg}`}
                        >
                          <CheckCircle2 className={`h-4 w-4 ${type.color}`} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Basic info */}
              <div
                className={`rounded-2xl border bg-white p-6 transition-opacity ${!selectedType ? "opacity-40 pointer-events-none" : "border-gray-100"}`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                    2
                  </span>
                  <h2 className="text-base font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>
                <p className="mb-5 ml-8 text-sm text-gray-400">
                  Name and configuration for this benefit
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Benefit Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g. Gym Membership — Pulse 50%"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Description{" "}
                      <span className="text-gray-300">(optional)</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="e.g. Company-subsidized gym access at Pulse Fitness. 50% covered by employer."
                      rows={3}
                      className="w-full resize-y rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3">
                    <div className="w-full min-w-0">
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, category: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-gray-400 focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(selectedType === "normal" ||
                      selectedType === "viewonly") && (
                      <>
                        <div className="w-full min-w-0">
                          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-600">
                            Effective Date
                            <span className="text-[11px] font-normal text-gray-400">
                              yyyy.mm.dd
                            </span>
                          </label>
                          <input
                            type="date"
                            value={form.effectiveDate}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                effectiveDate: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-gray-400 focus:outline-none"
                          />
                        </div>
                        <div className="w-full min-w-0">
                          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-600">
                            Expiry Date
                            <span className="text-[11px] font-normal text-gray-400">
                              yyyy.mm.dd
                            </span>
                          </label>
                          <input
                            type="date"
                            value={form.expiryDate}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                expiryDate: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-gray-400 focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {selectedType !== "normal" && selectedType !== "viewonly" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Company Subsidy (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={selectedType === "contract" ? 99 : 100}
                          value={form.subsidyPercent}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              subsidyPercent: Number(e.target.value) || 0,
                            }))
                          }
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-gray-400 focus:outline-none"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          Employee: {100 - form.subsidyPercent}%
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedType === "viewonly" && (
                    <div className="sm:col-span-2 rounded-xl border border-orange-100 bg-orange-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Company Subsidy
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Turn this on only if the company should fund part of
                            this automatic benefit.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setViewOnlySubsidyEnabled((enabled) => !enabled)
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                            viewOnlySubsidyEnabled
                              ? "bg-orange-500"
                              : "bg-gray-200"
                          }`}
                          aria-pressed={viewOnlySubsidyEnabled}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              viewOnlySubsidyEnabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {viewOnlySubsidyEnabled ? (
                        <div className="mt-4 rounded-xl border border-gray-200 bg-white px-3.5 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-gray-700">
                              Company Subsidy
                            </span>
                            <span className="text-sm font-semibold text-orange-600">
                              100%
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Enabled automatic benefits are always fully funded
                            by the company.
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-xs text-gray-500">
                          Subsidy is disabled. This benefit will be saved with
                          `0%` company subsidy.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Vendor Name{" "}
                      <span className="text-gray-300">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.vendorName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, vendorName: e.target.value }))
                      }
                      placeholder="e.g. Pulse Fitness"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                {selectedTypeConfig && (
                  <div
                    className={`mt-4 flex items-start gap-2 rounded-xl border ${selectedTypeConfig.border} ${selectedTypeConfig.bg} p-3`}
                  >
                    <Info
                      className={`mt-0.5 h-4 w-4 shrink-0 ${selectedTypeConfig.color}`}
                    />
                    <p className={`text-xs ${selectedTypeConfig.color}`}>
                      {selectedType === "contract" && "A contract signature is required before payment is processed. HR admin must approve."}
                      {selectedType === "normal" &&
                        (hasPricing
                          ? "Employee submits a request, HR reviews it, and the benefit activates only after the employee completes their Bonum co-payment."
                          : "Employee submits a request and HR admin reviews and makes the final decision.")}
                      {selectedType === "finance" && "Both Finance and HR approval are required. A repayment plan will be proposed."}
                      {selectedType === "viewonly" && "Employees can only view this benefit on their dashboard. No request needed."}
                      {selectedType === "screen_time" && "Employees upload a 7-day average screen-time screenshot on each required Friday. Missing or rejected required slots removes them from that month’s competition."}
                    </p>
                  </div>
                )}

                {/* Normal benefit — optional payment section */}
                {selectedType === "normal" && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          Payment
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Toggle on if employees need to pay for this benefit
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHasPricing((v) => !v);
                          if (hasPricing)
                            setForm((f) => ({ ...f, amount: "" }));
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${hasPricing ? "bg-emerald-500" : "bg-gray-200"}`}
                        aria-pressed={hasPricing}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${hasPricing ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>

                    {hasPricing && (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Company Subsidy (%)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={form.subsidyPercent}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  subsidyPercent: Number(e.target.value) || 0,
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-emerald-400 focus:outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              Employee: {100 - form.subsidyPercent}%
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Total Price (₮){" "}
                            <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={form.amount}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, amount: e.target.value }))
                            }
                            placeholder="e.g. 120000"
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-emerald-400 focus:outline-none"
                          />
                          {form.amount && (
                            <p className="mt-1 text-xs text-gray-400">
                              Company:{" "}
                              {Math.round(
                                (Number(form.amount) * form.subsidyPercent) /
                                  100,
                              ).toLocaleString()}
                              ₮
                              {100 - form.subsidyPercent > 0 && (
                                <>
                                  {" "}
                                  · Employee:{" "}
                                  {Math.round(
                                    (Number(form.amount) *
                                      (100 - form.subsidyPercent)) /
                                      100,
                                  ).toLocaleString()}
                                  ₮
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contract-specific extra fields */}
                {selectedType === "contract" && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-600">
                      Contract Benefit Details
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          Total Price (₮){" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.amount}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, amount: e.target.value }))
                          }
                          placeholder="e.g. 120000"
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-violet-400 focus:outline-none"
                        />
                        {form.amount && form.subsidyPercent > 0 && (
                          <p className="mt-1 text-xs text-gray-400">
                            Company:{" "}
                            {Math.round(
                              (Number(form.amount) * form.subsidyPercent) / 100,
                            ).toLocaleString()}
                            ₮ · You:{" "}
                            {Math.round(
                              (Number(form.amount) *
                                (100 - form.subsidyPercent)) /
                                100,
                            ).toLocaleString()}
                            ₮
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <MapPin className="h-3.5 w-3.5" />
                          Location{" "}
                          <span className="text-gray-300">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={form.location}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, location: e.target.value }))
                          }
                          placeholder="e.g. Ulaanbaatar, Khan-Uul"
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-violet-400 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <ImageIcon className="h-3.5 w-3.5" />
                          Benefit Image{" "}
                          <span className="text-gray-300">(optional)</span>
                        </label>
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 transition hover:border-violet-300 hover:bg-violet-50">
                          {imagePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-24 w-auto rounded-lg object-cover"
                            />
                          ) : (
                            <>
                              <Upload className="h-6 w-6 text-gray-300" />
                              <p className="text-xs text-gray-400">
                                Click to upload an image (JPG, PNG, WEBP)
                              </p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              setImageFile(f);
                              if (f) setImagePreview(URL.createObjectURL(f));
                              else setImagePreview(null);
                            }}
                          />
                        </label>
                        {imageFile && (
                          <p className="mt-1 text-xs text-gray-500">
                            {imageFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "screen_time" && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-600">
                          Screen Time Competition Rules
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Employees upload a weekly 7-day average screenshot on
                          each required Friday. Gemini extracts the average daily
                          minutes automatically. Missing or rejected required
                          slots disqualify the employee for that month.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                          Top Winner Percent
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={screenTimeWinnerPercent}
                            onChange={(e) => setScreenTimeWinnerPercent(e.target.value)}
                            className="w-full rounded-xl border border-fuchsia-100 bg-white px-3 py-2 text-sm text-gray-700 focus:border-fuchsia-400 focus:outline-none"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                          Reward Per Winner
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            step={1000}
                            value={screenTimeRewardAmountMnt}
                            onChange={(e) => setScreenTimeRewardAmountMnt(e.target.value)}
                            className="w-full rounded-xl border border-fuchsia-100 bg-white px-3 py-2 text-sm text-gray-700 focus:border-fuchsia-400 focus:outline-none"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">MNT</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-fuchsia-100 bg-fuchsia-50 p-3 text-xs text-fuchsia-700">
                      Example: Top {screenTimeWinnerPercent || "0"}% of qualified employees each receive {Number(screenTimeRewardAmountMnt || 0).toLocaleString()} MNT. Rankings are based on the lowest monthly average screen time.
                      minutes → 5%. Gemini extracts each weekly screenshot
                      automatically, and the system awards the first matching
                      band where the monthly average daily screen time is less
                      than or equal to the band limit.
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Rules */}
              <div
                className={`rounded-2xl border bg-white p-6 transition-opacity ${!selectedType ? "opacity-40 pointer-events-none" : "border-gray-100"}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                      3
                    </span>
                    <h2 className="text-base font-semibold text-gray-900">
                      Eligibility Rules
                    </h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      optional
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addRule}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Rule
                  </button>
                </div>
                <p className="mb-5 ml-8 text-sm text-gray-400">
                  Define the conditions an employee must meet to be eligible for
                  this benefit
                </p>

                {rules.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
                    <p className="text-sm text-gray-400">
                      No rules — all employees will be eligible
                    </p>
                    <button
                      type="button"
                      onClick={addRule}
                      className="mt-2 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
                    >
                      + Add first rule
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {rules.map((rule, idx) => {
                      const fieldCfg = RULE_FIELDS.find(
                        (f) => f.key === rule.fieldKey,
                      )!;
                      const preview = getRulePreview(rule);
                      return (
                        <div
                          key={rule.id}
                          className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                        >
                          {idx > 0 && (
                            <div className="mb-3 flex items-center gap-2">
                              <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">
                                AND
                              </span>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              {/* Field */}
                              <div>
                                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Condition
                                </label>
                                <select
                                  value={rule.fieldKey}
                                  onChange={(e) => {
                                    const newField = RULE_FIELDS.find(
                                      (f) =>
                                        f.key ===
                                        (e.target.value as RuleFieldKey),
                                    )!;
                                    updateRule(rule.id, {
                                      fieldKey: e.target.value as RuleFieldKey,
                                      operator: newField.operators[0].value,
                                      value: newField.defaultValue,
                                    });
                                  }}
                                  className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs focus:outline-none"
                                >
                                  {RULE_FIELDS.map((f) => (
                                    <option key={f.key} value={f.key}>
                                      {f.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {/* Operator */}
                              <div>
                                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Operator
                                </label>
                                <select
                                  value={rule.operator}
                                  onChange={(e) =>
                                    updateRule(rule.id, {
                                      operator: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs focus:outline-none"
                                >
                                  {fieldCfg.operators.map((op) => (
                                    <option key={op.value} value={op.value}>
                                      {op.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {/* Value */}
                              <div>
                                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                  Value{" "}
                                  {fieldCfg.unit ? `(${fieldCfg.unit})` : ""}
                                </label>
                                {fieldCfg.valueType === "select" ||
                                fieldCfg.valueType === "boolean" ? (
                                  <select
                                    value={rule.value}
                                    onChange={(e) =>
                                      updateRule(rule.id, {
                                        value: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs focus:outline-none"
                                  >
                                    {fieldCfg.options!.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={
                                      fieldCfg.valueType === "number"
                                        ? "number"
                                        : "text"
                                    }
                                    value={rule.value}
                                    onChange={(e) =>
                                      updateRule(rule.id, {
                                        value: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs focus:outline-none"
                                  />
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRule(rule.id)}
                              className="mt-5 shrink-0 rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {/* Preview sentence */}
                          {preview && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                              <p className="text-xs text-gray-600">{preview}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {rules.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-xs text-amber-700">
                      Rules will be submitted as proposals and require approval
                      from a second HR admin before taking effect.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 4: Contract Upload (for benefit types that require it) */}
              {selectedTypeConfig?.requiresContract && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                      4
                    </span>
                    <h2 className="text-base font-semibold text-gray-900">
                      Contract Upload
                    </h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      optional
                    </span>
                  </div>
                  <p className="mb-5 ml-8 text-sm text-gray-400">
                    Upload the vendor contract PDF that employees will need to
                    review and sign
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Version
                      </label>
                      <input
                        type="text"
                        value={contractMeta.version}
                        onChange={(e) =>
                          setContractMeta((m) => ({
                            ...m,
                            version: e.target.value,
                          }))
                        }
                        placeholder="e.g. 1.0"
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder-gray-300 transition focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div />
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Effective Date
                      </label>
                      <input
                        type="date"
                        value={contractMeta.effectiveDate}
                        onChange={(e) =>
                          setContractMeta((m) => ({
                            ...m,
                            effectiveDate: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={contractMeta.expiryDate}
                        onChange={(e) =>
                          setContractMeta((m) => ({
                            ...m,
                            expiryDate: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition focus:border-gray-400 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <FileText className="h-3.5 w-3.5" />
                        Contract PDF
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-4 transition hover:border-violet-300 hover:bg-violet-50">
                        <Upload className="h-5 w-5 shrink-0 text-gray-300" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {contractFile
                              ? contractFile.name
                              : "Upload contract PDF"}
                          </p>
                          <p className="text-xs text-gray-400">PDF, max 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            setContractFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || !selectedType || !form.name.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Create Benefit
                    </>
                  )}
                </button>
                <Link
                  href="/admin-panel/company-benefits"
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Workflow Preview ──────────────────────────────────── */}
            <div className="xl:col-span-2">
              <div className="sticky top-8">
                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Workflow Preview
                  </h3>
                  <p className="mb-5 text-xs text-gray-400">
                    Select a benefit type to see the workflow
                  </p>

                  {!selectedType ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        Select a benefit type
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        The workflow will appear here
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Type badge */}
                      <div
                        className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${selectedTypeConfig!.border} ${selectedTypeConfig!.bg}`}
                      >
                        <span className={selectedTypeConfig!.color}>
                          {selectedTypeConfig!.icon}
                        </span>
                        <span
                          className={`text-xs font-semibold ${selectedTypeConfig!.color}`}
                        >
                          {selectedTypeConfig!.label}
                        </span>
                      </div>

                      {/* Steps */}
                      <div className="flex flex-col gap-0">
                        {workflowPreviewSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.color}`}
                              >
                                {step.icon}
                              </div>
                              {idx < workflowPreviewSteps.length - 1 && (
                                <div className="mt-1 h-6 w-px bg-gray-100" />
                              )}
                            </div>
                            <div className="pb-5">
                              <p className="text-sm font-medium text-gray-800">
                                {step.label}
                              </p>
                              <p className="text-xs text-gray-400">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Rule summary */}
                      {rules.length > 0 && (
                        <div className="mt-4 border-t border-gray-50 pt-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                            Eligibility Requirements
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {rules.map((rule) => (
                              <div
                                key={rule.id}
                                className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2"
                              >
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                                <p className="text-xs text-gray-600">
                                  {getRulePreview(rule)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
