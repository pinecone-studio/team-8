import type { Env } from "./types";

export interface NotificationEventRow {
  id: string;
  event_type: string;
  audience: string;
  recipient_employee_id: string | null;
  recipient_email: string | null;
  status: string;
  source_entity_type: string;
  source_entity_id: string;
  payload_json: string;
  dispatched_at: string | null;
  failed_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

interface QueueNotificationInput {
  env: Env;
  eventType: string;
  audience: string;
  sourceEntityType: string;
  sourceEntityId: string;
  payload: Record<string, unknown>;
  recipientEmployeeId?: string | null;
  recipientEmail?: string | null;
}

export interface NotificationDispatchResult {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
}

export async function queueNotificationEvent(input: QueueNotificationInput): Promise<string> {
  const id = crypto.randomUUID();

  await input.env.DB.prepare(
    `INSERT INTO notification_events (
      id,
      event_type,
      audience,
      recipient_employee_id,
      recipient_email,
      status,
      source_entity_type,
      source_entity_id,
      payload_json
    ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`
  )
    .bind(
      id,
      input.eventType,
      input.audience,
      input.recipientEmployeeId ?? null,
      input.recipientEmail ?? null,
      input.sourceEntityType,
      input.sourceEntityId,
      JSON.stringify(input.payload)
    )
    .run();

  return id;
}

export async function queueBenefitRequestSubmittedNotifications(input: {
  env: Env;
  requestId: string;
  employeeId: string;
  employeeEmail?: string | null;
  benefit: {
    id: string;
    slug: string;
    name: string;
    requiresFinanceApproval: boolean;
    requiresManagerApproval: boolean;
  };
}): Promise<void> {
  const notifications: Promise<string>[] = [
    queueNotificationEvent({
      env: input.env,
      eventType: "benefit_request_submitted",
      audience: "hr_admins",
      sourceEntityType: "benefit_request",
      sourceEntityId: input.requestId,
      payload: {
        requestId: input.requestId,
        employeeId: input.employeeId,
        employeeEmail: input.employeeEmail ?? null,
        benefitId: input.benefit.id,
        benefitSlug: input.benefit.slug,
        benefitName: input.benefit.name
      }
    })
  ];

  if (input.benefit.requiresFinanceApproval) {
    notifications.push(
      queueNotificationEvent({
        env: input.env,
        eventType: "benefit_request_finance_review_required",
        audience: "finance_managers",
        sourceEntityType: "benefit_request",
        sourceEntityId: input.requestId,
        payload: {
          requestId: input.requestId,
          employeeId: input.employeeId,
          employeeEmail: input.employeeEmail ?? null,
          benefitId: input.benefit.id,
          benefitSlug: input.benefit.slug,
          benefitName: input.benefit.name
        }
      })
    );
  }

  if (input.benefit.requiresManagerApproval) {
    notifications.push(
      queueNotificationEvent({
        env: input.env,
        eventType: "benefit_request_manager_review_required",
        audience: "managers",
        sourceEntityType: "benefit_request",
        sourceEntityId: input.requestId,
        payload: {
          requestId: input.requestId,
          employeeId: input.employeeId,
          employeeEmail: input.employeeEmail ?? null,
          benefitId: input.benefit.id,
          benefitSlug: input.benefit.slug,
          benefitName: input.benefit.name
        }
      })
    );
  }

  await Promise.all(notifications);
}

export async function queueBenefitRequestReviewedNotification(input: {
  env: Env;
  requestId: string;
  employeeId: string;
  employeeEmail?: string | null;
  benefitId: string;
  status: string;
  reason?: string | null;
  reviewedBy: string;
  reviewerRole: string;
}): Promise<void> {
  await queueNotificationEvent({
    env: input.env,
    eventType: "benefit_request_reviewed",
    audience: "employee",
    recipientEmployeeId: input.employeeId,
    recipientEmail: input.employeeEmail ?? null,
    sourceEntityType: "benefit_request",
    sourceEntityId: input.requestId,
    payload: {
      requestId: input.requestId,
      employeeId: input.employeeId,
      benefitId: input.benefitId,
      status: input.status,
      reason: input.reason ?? null,
      reviewedBy: input.reviewedBy,
      reviewerRole: input.reviewerRole
    }
  });
}

export async function deliverPendingNotificationEvents(input: {
  env: Env;
  limit?: number;
}): Promise<NotificationDispatchResult> {
  const limit = Math.min(Math.max(input.limit ?? 25, 1), 100);
  const result = await input.env.DB.prepare(
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
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT ?`
  )
    .bind(limit)
    .all<NotificationEventRow>();

  const webhookUrl = input.env.NOTIFICATION_WEBHOOK_URL?.trim();
  const webhookSecret = input.env.NOTIFICATION_WEBHOOK_SECRET?.trim();
  const summary: NotificationDispatchResult = {
    processed: result.results.length,
    sent: 0,
    failed: 0,
    skipped: 0
  };

  if (!webhookUrl) {
    summary.skipped = result.results.length;
    return summary;
  }

  for (const event of result.results) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(webhookSecret ? { "x-ebms-notification-secret": webhookSecret } : {})
        },
        body: JSON.stringify({
          id: event.id,
          eventType: event.event_type,
          audience: event.audience,
          recipientEmployeeId: event.recipient_employee_id,
          recipientEmail: event.recipient_email,
          sourceEntityType: event.source_entity_type,
          sourceEntityId: event.source_entity_id,
          payload: JSON.parse(event.payload_json),
          createdAt: event.created_at
        })
      });

      if (!response.ok) {
        throw new Error(`Notification webhook returned ${response.status}`);
      }

      await input.env.DB.prepare(
        `UPDATE notification_events
         SET status = 'sent',
             dispatched_at = ?,
             failed_at = NULL,
             last_error = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(new Date().toISOString(), event.id)
        .run();

      summary.sent += 1;
    } catch (error) {
      await input.env.DB.prepare(
        `UPDATE notification_events
         SET status = 'failed',
             failed_at = ?,
             last_error = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(
          new Date().toISOString(),
          error instanceof Error ? error.message : "Unknown notification dispatch error",
          event.id
        )
        .run();

      summary.failed += 1;
    }
  }

  return summary;
}
