import { createSchema, createYoga } from "graphql-yoga";

import type { AuthContext, AppRole } from "./auth";
import { authenticateRequest, hasRequiredRole } from "./auth";
import type { NotificationEventRow } from "./notifications";
import {
  queueBenefitRequestReviewedNotification,
  queueBenefitRequestSubmittedNotifications,
  queueNotificationEvent
} from "./notifications";
import { recomputeEmployeeEligibility } from "./recompute";
import { createSignedContractUrl } from "./r2";
import type { Env } from "./types";

interface GraphQLContext {
  env: Env;
  auth: AuthContext | null;
}

interface EmployeeRow {
  id: string;
  email: string;
  name: string;
  name_eng: string | null;
  role: string;
  department: string;
  responsibility_level: number;
  employment_status: string;
  hire_date: string;
  okr_submitted: number;
  late_arrival_count: number;
}

interface BenefitRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  subsidy_percent: number;
  vendor_name: string | null;
  requires_contract: number;
  requires_finance_approval: number;
  requires_manager_approval: number;
  is_core_benefit: number;
  is_active: number;
}

interface BenefitPortfolioRow extends BenefitRow {
  employee_id: string | null;
  status: string | null;
  computed_at: string | null;
  rule_evaluation_json: string | null;
  override_by: string | null;
  override_reason: string | null;
  override_expires_at: string | null;
}

interface AuditLogRow {
  id: string;
  employee_id: string | null;
  benefit_id: string | null;
  actor_id: string | null;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  reason: string | null;
  payload_json: string;
  created_at: string;
}

interface ContractRow {
  id: string;
  benefit_id: string;
  vendor_name: string;
  version: string;
  r2_object_key: string;
  sha256_hash: string;
  effective_date: string;
  expiry_date: string;
  is_active: number;
}

interface BenefitRequestRow {
  id: string;
  employee_id: string;
  benefit_id: string;
  status: string;
  contract_version_accepted: string | null;
  contract_accepted_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface NotificationEventGraphRow extends NotificationEventRow {}

interface SyncRunRow {
  id: string;
  sync_type: string;
  source: string;
  status: string;
  record_count: number;
  initiated_by: string;
  payload_json: string;
  summary_json: string | null;
  started_at: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

const triggerMap = {
  LOGIN: "login",
  OKR_SYNC: "okr_sync",
  ATTENDANCE_IMPORT: "attendance_import",
  MANUAL_OVERRIDE: "manual_override",
  RESPONSIBILITY_CHANGE: "responsibility_change",
  HIRE_DATE_CHANGE: "hire_date_change",
  ROLE_CHANGE: "role_change"
} as const;

type TriggerKey = keyof typeof triggerMap;
type ReviewStatus = "APPROVED" | "REJECTED" | "CANCELLED";

function requireAuth(context: GraphQLContext): AuthContext {
  if (!context.auth) {
    throw new Error("Unauthorized");
  }

  return context.auth;
}

function requireRoles(context: GraphQLContext, roles: AppRole[]): AuthContext {
  const auth = requireAuth(context);

  if (!hasRequiredRole(auth, roles)) {
    throw new Error("Forbidden");
  }

  return auth;
}

function mapBenefit(row: BenefitRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subsidyPercent: row.subsidy_percent,
    vendorName: row.vendor_name,
    requiresContract: Boolean(row.requires_contract),
    requiresFinanceApproval: Boolean(row.requires_finance_approval),
    requiresManagerApproval: Boolean(row.requires_manager_approval),
    isCoreBenefit: Boolean(row.is_core_benefit),
    isActive: Boolean(row.is_active)
  };
}

function mapEmployee(row: EmployeeRow) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    nameEng: row.name_eng,
    role: row.role,
    department: row.department,
    responsibilityLevel: row.responsibility_level,
    employmentStatus: row.employment_status,
    hireDate: row.hire_date,
    okrSubmitted: Boolean(row.okr_submitted),
    lateArrivalCount: row.late_arrival_count
  };
}

function mapPortfolioItem(row: BenefitPortfolioRow) {
  return {
    employeeId: row.employee_id,
    status: row.status ? row.status.toUpperCase() : null,
    computedAt: row.computed_at,
    ruleEvaluationJson: row.rule_evaluation_json,
    overrideBy: row.override_by,
    overrideReason: row.override_reason,
    overrideExpiresAt: row.override_expires_at,
    benefit: mapBenefit(row)
  };
}

function mapAuditLog(row: AuditLogRow) {
  return {
    id: row.id,
    employeeId: row.employee_id,
    benefitId: row.benefit_id,
    actorId: row.actor_id,
    actorRole: row.actor_role,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    reason: row.reason,
    payloadJson: row.payload_json,
    createdAt: row.created_at
  };
}

function mapContract(row: ContractRow) {
  return {
    id: row.id,
    benefitId: row.benefit_id,
    vendorName: row.vendor_name,
    version: row.version,
    r2ObjectKey: row.r2_object_key,
    sha256Hash: row.sha256_hash,
    effectiveDate: row.effective_date,
    expiryDate: row.expiry_date,
    isActive: Boolean(row.is_active)
  };
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function decodeBase64Content(base64Content: string): Uint8Array {
  const normalized = base64Content.includes(",")
    ? base64Content.slice(base64Content.indexOf(",") + 1)
    : base64Content;
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function mapBenefitRequest(row: BenefitRequestRow) {
  return {
    id: row.id,
    employeeId: row.employee_id,
    benefitId: row.benefit_id,
    status: row.status.toUpperCase(),
    contractVersionAccepted: row.contract_version_accepted,
    contractAcceptedAt: row.contract_accepted_at,
    reviewedBy: row.reviewed_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapNotificationEvent(row: NotificationEventGraphRow) {
  return {
    id: row.id,
    eventType: row.event_type,
    audience: row.audience,
    recipientEmployeeId: row.recipient_employee_id,
    recipientEmail: row.recipient_email,
    status: row.status.toUpperCase(),
    sourceEntityType: row.source_entity_type,
    sourceEntityId: row.source_entity_id,
    payloadJson: row.payload_json,
    dispatchedAt: row.dispatched_at,
    failedAt: row.failed_at,
    lastError: row.last_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSyncRun(row: SyncRunRow) {
  return {
    id: row.id,
    syncType: row.sync_type,
    source: row.source,
    status: row.status.toUpperCase(),
    recordCount: row.record_count,
    initiatedBy: row.initiated_by,
    payloadJson: row.payload_json,
    summaryJson: row.summary_json,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getBenefitById(env: Env, benefitId: string): Promise<BenefitRow | null> {
  return (
    await env.DB.prepare(
      `SELECT
        id,
        slug,
        name,
        category,
        subsidy_percent,
        vendor_name,
        requires_contract,
        requires_finance_approval,
        requires_manager_approval,
        is_core_benefit,
        is_active
      FROM benefits
      WHERE id = ?`
    )
      .bind(benefitId)
      .first<BenefitRow>()
  ) ?? null;
}

async function getActiveContractForBenefit(env: Env, benefitId: string): Promise<ContractRow | null> {
  return (
    await env.DB.prepare(
      `SELECT
        id,
        benefit_id,
        vendor_name,
        version,
        r2_object_key,
        sha256_hash,
        effective_date,
        expiry_date,
        is_active
      FROM contracts
      WHERE benefit_id = ?
        AND is_active = 1
      ORDER BY effective_date DESC
      LIMIT 1`
    )
      .bind(benefitId)
      .first<ContractRow>()
  ) ?? null;
}

const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    enum EligibilityTrigger {
      LOGIN
      OKR_SYNC
      ATTENDANCE_IMPORT
      MANUAL_OVERRIDE
      RESPONSIBILITY_CHANGE
      HIRE_DATE_CHANGE
      ROLE_CHANGE
    }

    type Employee {
      id: ID!
      email: String!
      name: String!
      nameEng: String
      role: String!
      department: String!
      responsibilityLevel: Int!
      employmentStatus: String!
      hireDate: String!
      okrSubmitted: Boolean!
      lateArrivalCount: Int!
    }

    type Benefit {
      id: ID!
      slug: String!
      name: String!
      category: String!
      subsidyPercent: Int!
      vendorName: String
      requiresContract: Boolean!
      requiresFinanceApproval: Boolean!
      requiresManagerApproval: Boolean!
      isCoreBenefit: Boolean!
      isActive: Boolean!
    }

    type BenefitPortfolioItem {
      employeeId: ID
      status: String
      computedAt: String
      ruleEvaluationJson: String
      overrideBy: String
      overrideReason: String
      overrideExpiresAt: String
      benefit: Benefit!
    }

    type AuditLog {
      id: ID!
      employeeId: ID
      benefitId: ID
      actorId: ID
      actorRole: String!
      action: String!
      entityType: String!
      entityId: String!
      reason: String
      payloadJson: String!
      createdAt: String!
    }

    type Contract {
      id: ID!
      benefitId: ID!
      vendorName: String!
      version: String!
      r2ObjectKey: String!
      sha256Hash: String!
      effectiveDate: String!
      expiryDate: String!
      isActive: Boolean!
    }

    type ContractDownloadPayload {
      url: String!
      expiresAt: String!
      contract: Contract!
    }

    type UploadContractPayload {
      ok: Boolean!
      contract: Contract!
    }

    type BenefitRequest {
      id: ID!
      employeeId: ID!
      benefitId: ID!
      status: String!
      contractVersionAccepted: String
      contractAcceptedAt: String
      reviewedBy: String
      createdAt: String!
      updatedAt: String!
    }

    type NotificationEvent {
      id: ID!
      eventType: String!
      audience: String!
      recipientEmployeeId: ID
      recipientEmail: String
      status: String!
      sourceEntityType: String!
      sourceEntityId: String!
      payloadJson: String!
      dispatchedAt: String
      failedAt: String
      lastError: String
      createdAt: String!
      updatedAt: String!
    }

    type SyncRun {
      id: ID!
      syncType: String!
      source: String!
      status: String!
      recordCount: Int!
      initiatedBy: ID!
      payloadJson: String!
      summaryJson: String
      startedAt: String!
      finishedAt: String
      createdAt: String!
      updatedAt: String!
    }

    type RecomputeEligibilityPayload {
      ok: Boolean!
      employeeId: ID!
      trigger: String!
      benefitCount: Int!
      cacheKeysInvalidated: [String!]!
    }

    type RequestBenefitPayload {
      ok: Boolean!
      request: BenefitRequest!
    }

    type OverrideEligibilityPayload {
      ok: Boolean!
      employeeId: ID!
      benefitId: ID!
      status: String!
      overrideReason: String!
      overrideExpiresAt: String
    }

    type ReviewBenefitRequestPayload {
      ok: Boolean!
      request: BenefitRequest!
    }

    type Query {
      me: Employee
      benefits: [Benefit!]!
      myBenefits: [BenefitPortfolioItem!]!
      myBenefitRequests: [BenefitRequest!]!
      benefitContract(benefitId: ID!): Contract
      contractVersions(benefitId: ID!): [Contract!]!
      contractDownloadUrl(contractId: ID!): ContractDownloadPayload!
      expiringContracts(withinDays: Int = 60): [Contract!]!
      benefitRequests(status: String, onlyFinanceQueue: Boolean = false): [BenefitRequest!]!
      notificationEvents(status: String, audience: String, limit: Int = 50): [NotificationEvent!]!
      syncRuns(syncType: String, limit: Int = 20): [SyncRun!]!
      employee(id: ID!): Employee
      employees: [Employee!]!
      auditLog(employeeId: ID, benefitId: ID, limit: Int = 50): [AuditLog!]!
    }

    type Mutation {
      recomputeEligibility(employeeId: ID!, trigger: EligibilityTrigger!): RecomputeEligibilityPayload!
      requestBenefit(
        benefitId: ID!
        contractId: ID
        acceptContract: Boolean = false
        requesterIp: String
      ): RequestBenefitPayload!
      overrideEligibility(
        employeeId: ID!
        benefitId: ID!
        status: String!
        reason: String!
        expiresAt: String
      ): OverrideEligibilityPayload!
      uploadContractVersion(
        benefitId: ID!
        vendorName: String!
        version: String!
        effectiveDate: String!
        expiryDate: String!
        fileName: String!
        fileBase64: String!
      ): UploadContractPayload!
      reviewBenefitRequest(
        requestId: ID!
        status: String!
        reason: String
      ): ReviewBenefitRequestPayload!
    }
  `,
  resolvers: {
    Query: {
      me: async (_, __, context) => {
        const auth = requireAuth(context);
        const row = await context.env.DB.prepare(
          `SELECT
            id,
            email,
            name,
            name_eng,
            role,
            department,
            responsibility_level,
            employment_status,
            hire_date,
            okr_submitted,
            late_arrival_count
          FROM employees
          WHERE id = ?`
        )
          .bind(auth.userId)
          .first<EmployeeRow>();

        return row ? mapEmployee(row) : null;
      },
      benefits: async (_, __, context) => {
        requireAuth(context);

        const result = await context.env.DB.prepare(
          `SELECT
            id,
            slug,
            name,
            category,
            subsidy_percent,
            vendor_name,
            requires_contract,
            requires_finance_approval,
            requires_manager_approval,
            is_core_benefit,
            is_active
          FROM benefits
          WHERE is_active = 1
          ORDER BY category, name`
        ).all<BenefitRow>();

        return result.results.map(mapBenefit);
      },
      myBenefits: async (_, __, context) => {
        const auth = requireAuth(context);

        const result = await context.env.DB.prepare(
          `SELECT
            be.employee_id,
            be.status,
            be.computed_at,
            be.rule_evaluation_json,
            be.override_by,
            be.override_reason,
            be.override_expires_at,
            b.id,
            b.slug,
            b.name,
            b.category,
            b.subsidy_percent,
            b.vendor_name,
            b.requires_contract,
            b.requires_finance_approval,
            b.requires_manager_approval,
            b.is_core_benefit,
            b.is_active
          FROM benefits b
          LEFT JOIN benefit_eligibility be
            ON be.benefit_id = b.id
           AND be.employee_id = ?
          WHERE b.is_active = 1
          ORDER BY b.category, b.name`
        )
          .bind(auth.userId)
          .all<BenefitPortfolioRow>();

        return result.results.map(mapPortfolioItem);
      },
      myBenefitRequests: async (_, __, context) => {
        const auth = requireAuth(context);

        const result = await context.env.DB.prepare(
          `SELECT
            id,
            employee_id,
            benefit_id,
            status,
            contract_version_accepted,
            contract_accepted_at,
            reviewed_by,
            created_at,
            updated_at
          FROM benefit_requests
          WHERE employee_id = ?
          ORDER BY created_at DESC`
        )
          .bind(auth.userId)
          .all<BenefitRequestRow>();

        return result.results.map(mapBenefitRequest);
      },
      benefitContract: async (_, args: { benefitId: string }, context) => {
        requireAuth(context);
        const contract = await getActiveContractForBenefit(context.env, args.benefitId);
        return contract ? mapContract(contract) : null;
      },
      contractVersions: async (_, args: { benefitId: string }, context) => {
        requireRoles(context, ["hr_admin", "system"]);
        const result = await context.env.DB.prepare(
          `SELECT
            id,
            benefit_id,
            vendor_name,
            version,
            r2_object_key,
            sha256_hash,
            effective_date,
            expiry_date,
            is_active
          FROM contracts
          WHERE benefit_id = ?
          ORDER BY effective_date DESC, created_at DESC`
        )
          .bind(args.benefitId)
          .all<ContractRow>();

        return result.results.map(mapContract);
      },
      contractDownloadUrl: async (_, args: { contractId: string }, context) => {
        const auth = requireAuth(context);
        const contract = await context.env.DB.prepare(
          `SELECT
            id,
            benefit_id,
            vendor_name,
            version,
            r2_object_key,
            sha256_hash,
            effective_date,
            expiry_date,
            is_active
          FROM contracts
          WHERE id = ?`
        )
          .bind(args.contractId)
          .first<ContractRow>();

        if (!contract) {
          throw new Error("Contract not found");
        }

        if (auth.role === "employee") {
          const hasPortfolioAccess = await context.env.DB.prepare(
            `SELECT 1
            FROM benefit_eligibility
            WHERE employee_id = ?
              AND benefit_id = ?
            LIMIT 1`
          )
            .bind(auth.userId, contract.benefit_id)
            .first();

          if (!hasPortfolioAccess) {
            throw new Error("Forbidden");
          }
        }

        const signed = await createSignedContractUrl({
          env: context.env,
          objectKey: contract.r2_object_key
        });

        return {
          url: signed.url,
          expiresAt: signed.expiresAt,
          contract: mapContract(contract)
        };
      },
      expiringContracts: async (_, args: { withinDays?: number }, context) => {
        requireRoles(context, ["hr_admin", "system"]);
        const withinDays = Math.min(Math.max(args.withinDays ?? 60, 1), 365);
        const result = await context.env.DB.prepare(
          `SELECT
            id,
            benefit_id,
            vendor_name,
            version,
            r2_object_key,
            sha256_hash,
            effective_date,
            expiry_date,
            is_active
          FROM contracts
          WHERE is_active = 1
            AND julianday(expiry_date) <= julianday('now', '+' || ? || ' day')
          ORDER BY expiry_date ASC`
        )
          .bind(withinDays)
          .all<ContractRow>();

        return result.results.map(mapContract);
      },
      benefitRequests: async (
        _,
        args: { status?: string; onlyFinanceQueue?: boolean },
        context
      ) => {
        requireRoles(context, ["hr_admin", "finance_manager", "system"]);

        const filters: string[] = [];
        const bindings: unknown[] = [];

        if (args.status) {
          filters.push("br.status = ?");
          bindings.push(args.status.toLowerCase());
        }

        if (args.onlyFinanceQueue) {
          filters.push("b.requires_finance_approval = 1");
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const result = await context.env.DB.prepare(
          `SELECT
            br.id,
            br.employee_id,
            br.benefit_id,
            br.status,
            br.contract_version_accepted,
            br.contract_accepted_at,
            br.reviewed_by,
            br.created_at,
            br.updated_at
          FROM benefit_requests br
          INNER JOIN benefits b
            ON b.id = br.benefit_id
          ${whereClause}
          ORDER BY br.created_at DESC`
        )
          .bind(...bindings)
          .all<BenefitRequestRow>();

        return result.results.map(mapBenefitRequest);
      },
      notificationEvents: async (
        _,
        args: { status?: string; audience?: string; limit?: number },
        context
      ) => {
        requireRoles(context, ["hr_admin", "system"]);

        const filters: string[] = [];
        const bindings: unknown[] = [];

        if (args.status) {
          filters.push("status = ?");
          bindings.push(args.status.toLowerCase());
        }

        if (args.audience) {
          filters.push("audience = ?");
          bindings.push(args.audience);
        }

        const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
        bindings.push(limit);

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const result = await context.env.DB.prepare(
          `SELECT
            id,
            event_type,
            audience,
            recipient_employee_id,
            recipient_email,
            status,
            source_entity_type,
            source_entity_id,
            payload_json,
            dispatched_at,
            failed_at,
            last_error,
            created_at,
            updated_at
          FROM notification_events
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT ?`
        )
          .bind(...bindings)
          .all<NotificationEventGraphRow>();

        return result.results.map(mapNotificationEvent);
      },
      syncRuns: async (_, args: { syncType?: string; limit?: number }, context) => {
        requireRoles(context, ["hr_admin", "system"]);

        const filters: string[] = [];
        const bindings: unknown[] = [];

        if (args.syncType) {
          filters.push("sync_type = ?");
          bindings.push(args.syncType.toLowerCase());
        }

        const limit = Math.min(Math.max(args.limit ?? 20, 1), 100);
        bindings.push(limit);

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const result = await context.env.DB.prepare(
          `SELECT
            id,
            sync_type,
            source,
            status,
            record_count,
            initiated_by,
            payload_json,
            summary_json,
            started_at,
            finished_at,
            created_at,
            updated_at
          FROM sync_runs
          ${whereClause}
          ORDER BY started_at DESC
          LIMIT ?`
        )
          .bind(...bindings)
          .all<SyncRunRow>();

        return result.results.map(mapSyncRun);
      },
      employee: async (_, args: { id: string }, context) => {
        requireRoles(context, ["hr_admin", "system"]);

        const row = await context.env.DB.prepare(
          `SELECT
            id,
            email,
            name,
            name_eng,
            role,
            department,
            responsibility_level,
            employment_status,
            hire_date,
            okr_submitted,
            late_arrival_count
          FROM employees
          WHERE id = ?`
        )
          .bind(args.id)
          .first<EmployeeRow>();

        return row ? mapEmployee(row) : null;
      },
      employees: async (_, __, context) => {
        requireRoles(context, ["hr_admin", "system"]);

        const result = await context.env.DB.prepare(
          `SELECT
            id,
            email,
            name,
            name_eng,
            role,
            department,
            responsibility_level,
            employment_status,
            hire_date,
            okr_submitted,
            late_arrival_count
          FROM employees
          ORDER BY name`
        ).all<EmployeeRow>();

        return result.results.map(mapEmployee);
      },
      auditLog: async (
        _,
        args: { employeeId?: string; benefitId?: string; limit?: number },
        context
      ) => {
        requireRoles(context, ["hr_admin", "system"]);

        const filters: string[] = [];
        const bindings: unknown[] = [];

        if (args.employeeId) {
          filters.push("employee_id = ?");
          bindings.push(args.employeeId);
        }

        if (args.benefitId) {
          filters.push("benefit_id = ?");
          bindings.push(args.benefitId);
        }

        const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
        bindings.push(limit);

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const result = await context.env.DB.prepare(
          `SELECT
            id,
            employee_id,
            benefit_id,
            actor_id,
            actor_role,
            action,
            entity_type,
            entity_id,
            reason,
            payload_json,
            created_at
          FROM audit_logs
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT ?`
        )
          .bind(...bindings)
          .all<AuditLogRow>();

        return result.results.map(mapAuditLog);
      }
    },
    Mutation: {
      recomputeEligibility: async (
        _,
        args: { employeeId: string; trigger: TriggerKey },
        context
      ) => {
        const auth = requireRoles(context, ["hr_admin", "system"]);
        const trigger = triggerMap[args.trigger];

        const result = await recomputeEmployeeEligibility({
          env: context.env,
          employeeId: args.employeeId,
          trigger,
          actorId: auth.userId,
          actorRole: auth.role
        });

        if (!result) {
          throw new Error("Employee not found");
        }

        return {
          ok: true,
          employeeId: args.employeeId,
          trigger,
          benefitCount: result.evaluations.length,
          cacheKeysInvalidated: result.cacheKeysToInvalidate
        };
      },
      requestBenefit: async (
        _,
        args: {
          benefitId: string;
          contractId?: string;
          acceptContract?: boolean;
          requesterIp?: string;
        },
        context
      ) => {
        const auth = requireRoles(context, ["employee", "system"]);
        const benefit = await getBenefitById(context.env, args.benefitId);

        if (!benefit || !benefit.is_active) {
          throw new Error("Benefit not found");
        }

        const recompute = await recomputeEmployeeEligibility({
          env: context.env,
          employeeId: auth.userId,
          trigger: "login",
          actorId: auth.userId,
          actorRole: auth.role
        });

        if (!recompute) {
          throw new Error("Employee not found");
        }

        const eligibility = recompute.evaluations.find(
          (entry: (typeof recompute.evaluations)[number]) => entry.benefitId === args.benefitId
        );

        if (!eligibility || eligibility.status !== "eligible") {
          throw new Error("Benefit is not eligible for request");
        }

        const existingPending = await context.env.DB.prepare(
          `SELECT id
          FROM benefit_requests
          WHERE employee_id = ?
            AND benefit_id = ?
            AND status IN ('pending', 'approved')
          LIMIT 1`
        )
          .bind(auth.userId, args.benefitId)
          .first<{ id: string }>();

        if (existingPending) {
          throw new Error("An active request already exists for this benefit");
        }

        let contract: ContractRow | null = null;
        let acceptedAt: string | null = null;

        if (benefit.requires_contract) {
          contract = await getActiveContractForBenefit(context.env, args.benefitId);

          if (!contract) {
            throw new Error("No active contract found for this benefit");
          }

          if (args.contractId !== contract.id || args.acceptContract !== true) {
            throw new Error("Contract acceptance is required");
          }

          acceptedAt = new Date().toISOString();
        }

        const requestId = crypto.randomUUID();
        const requestStatus = "pending";

        await context.env.DB.prepare(
          `INSERT INTO benefit_requests (
            id,
            employee_id,
            benefit_id,
            status,
            contract_version_accepted,
            contract_accepted_at,
            reviewed_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            requestId,
            auth.userId,
            args.benefitId,
            requestStatus,
            contract?.version ?? null,
            acceptedAt,
            null
          )
          .run();

        if (contract && acceptedAt) {
          await context.env.DB.prepare(
            `INSERT INTO contract_acceptance_logs (
              id,
              employee_id,
              contract_id,
              contract_version,
              contract_hash,
              accepted_at,
              ip_address,
              request_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          )
            .bind(
              crypto.randomUUID(),
              auth.userId,
              contract.id,
              contract.version,
              contract.sha256_hash,
              acceptedAt,
              args.requesterIp ?? "0.0.0.0",
              requestId
            )
            .run();
        }

        await context.env.DB.prepare(
          `INSERT INTO audit_logs (
            id,
            employee_id,
            benefit_id,
            actor_id,
            actor_role,
            action,
            entity_type,
            entity_id,
            reason,
            payload_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            auth.userId,
            args.benefitId,
            auth.userId,
            auth.role,
            "benefit_requested",
            "benefit_request",
            requestId,
            "Employee submitted benefit request",
            JSON.stringify({
              requestId,
              benefitId: args.benefitId,
              requiresContract: Boolean(benefit.requires_contract),
              contractId: contract?.id ?? null
            })
          )
          .run();

        await queueBenefitRequestSubmittedNotifications({
          env: context.env,
          requestId,
          employeeId: auth.userId,
          employeeEmail: auth.email,
          benefit: {
            id: benefit.id,
            slug: benefit.slug,
            name: benefit.name,
            requiresFinanceApproval: Boolean(benefit.requires_finance_approval),
            requiresManagerApproval: Boolean(benefit.requires_manager_approval)
          }
        });

        await context.env.ELIGIBILITY_CACHE.delete(`employee:${auth.userId}:dashboard`);

        const created = await context.env.DB.prepare(
          `SELECT
            id,
            employee_id,
            benefit_id,
            status,
            contract_version_accepted,
            contract_accepted_at,
            reviewed_by,
            created_at,
            updated_at
          FROM benefit_requests
          WHERE id = ?`
        )
          .bind(requestId)
          .first<BenefitRequestRow>();

        if (!created) {
          throw new Error("Failed to create request");
        }

        return {
          ok: true,
          request: mapBenefitRequest(created)
        };
      },
      overrideEligibility: async (
        _,
        args: {
          employeeId: string;
          benefitId: string;
          status: string;
          reason: string;
          expiresAt?: string;
        },
        context
      ) => {
        const auth = requireRoles(context, ["hr_admin", "system"]);

        if (!args.reason.trim()) {
          throw new Error("Override reason is required");
        }

        const normalizedStatus = args.status.toLowerCase();
        const allowedStatuses = new Set(["active", "eligible", "locked", "pending"]);

        if (!allowedStatuses.has(normalizedStatus)) {
          throw new Error("Invalid override status");
        }

        const existing = await context.env.DB.prepare(
          `SELECT rule_evaluation_json
          FROM benefit_eligibility
          WHERE employee_id = ?
            AND benefit_id = ?`
        )
          .bind(args.employeeId, args.benefitId)
          .first<{ rule_evaluation_json: string | null }>();

        const now = new Date().toISOString();

        await context.env.DB.prepare(
          `INSERT INTO benefit_eligibility (
            employee_id,
            benefit_id,
            status,
            rule_evaluation_json,
            computed_at,
            override_by,
            override_reason,
            override_expires_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(employee_id, benefit_id) DO UPDATE SET
            status = excluded.status,
            rule_evaluation_json = excluded.rule_evaluation_json,
            computed_at = excluded.computed_at,
            override_by = excluded.override_by,
            override_reason = excluded.override_reason,
            override_expires_at = excluded.override_expires_at,
            updated_at = CURRENT_TIMESTAMP`
        )
          .bind(
            args.employeeId,
            args.benefitId,
            normalizedStatus,
            existing?.rule_evaluation_json ?? "[]",
            now,
            auth.userId,
            args.reason,
            args.expiresAt ?? null
          )
          .run();

        await context.env.DB.prepare(
          `INSERT INTO audit_logs (
            id,
            employee_id,
            benefit_id,
            actor_id,
            actor_role,
            action,
            entity_type,
            entity_id,
            reason,
            payload_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            args.employeeId,
            args.benefitId,
            auth.userId,
            auth.role,
            "eligibility_overridden",
            "benefit_eligibility",
            `${args.employeeId}:${args.benefitId}`,
            args.reason,
            JSON.stringify({
              employeeId: args.employeeId,
              benefitId: args.benefitId,
              status: normalizedStatus,
              overrideExpiresAt: args.expiresAt ?? null,
              overriddenAt: now
            })
          )
          .run();

        await Promise.all([
          context.env.ELIGIBILITY_CACHE.delete(`employee:${args.employeeId}:benefits`),
          context.env.ELIGIBILITY_CACHE.delete(`employee:${args.employeeId}:eligibility`),
          context.env.ELIGIBILITY_CACHE.delete(`employee:${args.employeeId}:dashboard`)
        ]);

        return {
          ok: true,
          employeeId: args.employeeId,
          benefitId: args.benefitId,
          status: normalizedStatus.toUpperCase(),
          overrideReason: args.reason,
          overrideExpiresAt: args.expiresAt ?? null
        };
      },
      uploadContractVersion: async (
        _,
        args: {
          benefitId: string;
          vendorName: string;
          version: string;
          effectiveDate: string;
          expiryDate: string;
          fileName: string;
          fileBase64: string;
        },
        context
      ) => {
        const auth = requireRoles(context, ["hr_admin", "system"]);
        const benefit = await getBenefitById(context.env, args.benefitId);

        if (!benefit) {
          throw new Error("Benefit not found");
        }

        const fileBytes = decodeBase64Content(args.fileBase64);
        const digestInput = new Uint8Array(fileBytes.byteLength);
        digestInput.set(fileBytes);
        const hashBuffer = await crypto.subtle.digest("SHA-256", digestInput);
        const sha256Hash = toHex(hashBuffer);
        const objectKey = `contracts/${benefit.slug}/${args.version}/${args.fileName}`;
        const contractId = crypto.randomUUID();

        await context.env.CONTRACTS_BUCKET.put(objectKey, fileBytes, {
          httpMetadata: {
            contentType: "application/pdf"
          }
        });

        await context.env.DB.batch([
          context.env.DB.prepare(
            `UPDATE contracts
             SET is_active = 0,
                 updated_at = CURRENT_TIMESTAMP
             WHERE benefit_id = ?`
          ).bind(args.benefitId),
          context.env.DB.prepare(
            `INSERT INTO contracts (
              id,
              benefit_id,
              vendor_name,
              version,
              r2_object_key,
              sha256_hash,
              effective_date,
              expiry_date,
              is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
          ).bind(
            contractId,
            args.benefitId,
            args.vendorName,
            args.version,
            objectKey,
            sha256Hash,
            args.effectiveDate,
            args.expiryDate
          ),
          context.env.DB.prepare(
            `UPDATE benefits
             SET active_contract_id = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`
          ).bind(contractId, args.benefitId),
          context.env.DB.prepare(
            `INSERT INTO audit_logs (
              id,
              employee_id,
              benefit_id,
              actor_id,
              actor_role,
              action,
              entity_type,
              entity_id,
              reason,
              payload_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            crypto.randomUUID(),
            null,
            args.benefitId,
            auth.userId,
            auth.role,
            "contract_uploaded",
            "contract",
            contractId,
            `Uploaded contract version ${args.version}`,
            JSON.stringify({
              benefitId: args.benefitId,
              version: args.version,
              vendorName: args.vendorName,
              objectKey,
              sha256Hash,
              effectiveDate: args.effectiveDate,
              expiryDate: args.expiryDate
            })
          )
        ]);

        await queueNotificationEvent({
          env: context.env,
          eventType: "contract_version_uploaded",
          audience: "system",
          sourceEntityType: "contract",
          sourceEntityId: contractId,
          payload: {
            benefitId: args.benefitId,
            benefitSlug: benefit.slug,
            vendorName: args.vendorName,
            version: args.version,
            effectiveDate: args.effectiveDate,
            expiryDate: args.expiryDate,
            uploadedBy: auth.userId
          }
        });

        const created = await context.env.DB.prepare(
          `SELECT
            id,
            benefit_id,
            vendor_name,
            version,
            r2_object_key,
            sha256_hash,
            effective_date,
            expiry_date,
            is_active
          FROM contracts
          WHERE id = ?`
        )
          .bind(contractId)
          .first<ContractRow>();

        if (!created) {
          throw new Error("Failed to create contract");
        }

        return {
          ok: true,
          contract: mapContract(created)
        };
      },
      reviewBenefitRequest: async (
        _,
        args: { requestId: string; status: ReviewStatus; reason?: string },
        context
      ) => {
        const auth = requireRoles(context, ["hr_admin", "finance_manager", "system"]);
        const normalizedStatus = args.status.toLowerCase();
        const allowed = new Set(["approved", "rejected", "cancelled"]);

        if (!allowed.has(normalizedStatus)) {
          throw new Error("Invalid review status");
        }

        const request = await context.env.DB.prepare(
          `SELECT
            br.id,
            br.employee_id,
            br.benefit_id,
            br.status,
            br.contract_version_accepted,
            br.contract_accepted_at,
            br.reviewed_by,
            br.created_at,
            br.updated_at
          FROM benefit_requests br
          WHERE br.id = ?`
        )
          .bind(args.requestId)
          .first<BenefitRequestRow>();

        if (!request) {
          throw new Error("Benefit request not found");
        }

        const benefit = await getBenefitById(context.env, request.benefit_id);

        if (!benefit) {
          throw new Error("Benefit not found");
        }

        const employee = await context.env.DB.prepare(
          `SELECT email
          FROM employees
          WHERE id = ?`
        )
          .bind(request.employee_id)
          .first<{ email: string }>();

        if (
          benefit.requires_finance_approval &&
          !hasRequiredRole(auth, ["finance_manager", "system"])
        ) {
          throw new Error("Finance approval required");
        }

        await context.env.DB.prepare(
          `UPDATE benefit_requests
          SET status = ?,
              reviewed_by = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
          .bind(normalizedStatus, auth.userId, args.requestId)
          .run();

        await context.env.DB.prepare(
          `INSERT INTO audit_logs (
            id,
            employee_id,
            benefit_id,
            actor_id,
            actor_role,
            action,
            entity_type,
            entity_id,
            reason,
            payload_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            crypto.randomUUID(),
            request.employee_id,
            request.benefit_id,
            auth.userId,
            auth.role,
            "benefit_request_reviewed",
            "benefit_request",
            request.id,
            args.reason ?? null,
            JSON.stringify({
              requestId: request.id,
              previousStatus: request.status,
              nextStatus: normalizedStatus,
              reviewedAt: new Date().toISOString()
            })
          )
          .run();

        await queueBenefitRequestReviewedNotification({
          env: context.env,
          requestId: request.id,
          employeeId: request.employee_id,
          employeeEmail: employee?.email ?? null,
          benefitId: request.benefit_id,
          status: normalizedStatus,
          reason: args.reason ?? null,
          reviewedBy: auth.userId,
          reviewerRole: auth.role
        });

        const updated = await context.env.DB.prepare(
          `SELECT
            id,
            employee_id,
            benefit_id,
            status,
            contract_version_accepted,
            contract_accepted_at,
            reviewed_by,
            created_at,
            updated_at
          FROM benefit_requests
          WHERE id = ?`
        )
          .bind(args.requestId)
          .first<BenefitRequestRow>();

        if (!updated) {
          throw new Error("Failed to update benefit request");
        }

        return {
          ok: true,
          request: mapBenefitRequest(updated)
        };
      }
    }
  }
});

export const yoga = createYoga<{ env: Env }, GraphQLContext>({
  schema,
  graphqlEndpoint: "/graphql",
  landingPage: false,
  context: async (initialContext) => ({
    env: initialContext.env,
    auth: await authenticateRequest(initialContext.request, initialContext.env)
  })
});
