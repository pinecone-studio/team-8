import { Hono } from "hono";

import { loadAccessPreview, loginWithCredentials } from "./access-auth";
import { authenticateRequest, hasRequiredRole } from "./auth";
import { yoga } from "./graphql";
import { deliverPendingNotificationEvents } from "./notifications";
import { isEligibilityTrigger, recomputeEmployeeEligibility } from "./recompute";
import { ingestAttendanceSync, ingestOkrSync } from "./sync";
import type { Env } from "./types";

const routes = ["/health", "/graphql", "/auth/login", "/auth/preview"];

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "ebms-api",
    runtime: "cloudflare-worker",
    hasBindings: {
      db: Boolean(c.env.DB),
      eligibilityCache: Boolean(c.env.ELIGIBILITY_CACHE),
      contractsBucket: Boolean(c.env.CONTRACTS_BUCKET)
    }
  })
);

app.post("/auth/login", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const result = await loginWithCredentials(c.env, {
    email: body.email ?? "",
    password: body.password ?? ""
  });

  if (!result) {
    return c.json(
      {
        ok: false,
        message: "Invalid credentials."
      },
      401
    );
  }

  return c.json({
    ok: true,
    user: result
  });
});

app.get("/auth/preview", async (c) => {
  const preview = await loadAccessPreview(c.env);

  return c.json({
    ok: true,
    ...preview
  });
});

app.on(["GET", "POST"], "/graphql", (c) => yoga.fetch(c.req.raw, { env: c.env }));

app.post("/internal/recompute", async (c) => {
  const auth = await authenticateRequest(c.req.raw, c.env);

  if (!auth) {
    return c.json(
      {
        ok: false,
        message: "Unauthorized."
      },
      401
    );
  }

  if (!hasRequiredRole(auth, ["hr_admin", "system"])) {
    return c.json(
      {
        ok: false,
        message: "Forbidden."
      },
      403
    );
  }

  const body = (await c.req.json()) as {
    employeeId?: string;
    trigger?: string;
  };

  if (!body.employeeId || !body.trigger || !isEligibilityTrigger(body.trigger)) {
    return c.json(
      {
        ok: false,
        message: "employeeId and a valid trigger are required."
      },
      400
    );
  }

  const result = await recomputeEmployeeEligibility({
    env: c.env,
    employeeId: body.employeeId,
    trigger: body.trigger,
    actorId: auth.userId,
    actorRole: auth.role
  });

  if (!result) {
    return c.json(
      {
        ok: false,
        message: "Employee not found."
      },
      404
    );
  }

  return c.json({
    ok: true,
    employeeId: body.employeeId,
    trigger: body.trigger,
    benefitCount: result.evaluations.length,
    cacheKeysInvalidated: result.cacheKeysToInvalidate
  });
});

app.post("/internal/notifications/dispatch", async (c) => {
  const auth = await authenticateRequest(c.req.raw, c.env);

  if (!auth) {
    return c.json(
      {
        ok: false,
        message: "Unauthorized."
      },
      401
    );
  }

  if (!hasRequiredRole(auth, ["hr_admin", "system"])) {
    return c.json(
      {
        ok: false,
        message: "Forbidden."
      },
      403
    );
  }

  const body = (await c.req.json().catch(() => ({}))) as {
    limit?: number;
  };

  const summary = await deliverPendingNotificationEvents({
    env: c.env,
    limit: body.limit
  });

  return c.json({
    ok: true,
    ...summary
  });
});

app.post("/internal/sync/okr", async (c) => {
  const auth = await authenticateRequest(c.req.raw, c.env);

  if (!auth) {
    return c.json({ ok: false, message: "Unauthorized." }, 401);
  }

  if (!hasRequiredRole(auth, ["hr_admin", "system"])) {
    return c.json({ ok: false, message: "Forbidden." }, 403);
  }

  const body = (await c.req.json()) as {
    source?: string;
    records?: Array<{
      employeeId?: string;
      okrSubmitted?: boolean;
    }>;
  };

  const records = (body.records ?? []).filter(
    (record): record is { employeeId: string; okrSubmitted: boolean } =>
      typeof record.employeeId === "string" && typeof record.okrSubmitted === "boolean"
  );

  if (records.length === 0) {
    return c.json({ ok: false, message: "At least one valid OKR sync record is required." }, 400);
  }

  const result = await ingestOkrSync({
    env: c.env,
    source: body.source,
    records,
    actorId: auth.userId,
    actorRole: auth.role
  });

  return c.json({
    ok: true,
    ...result
  });
});

app.post("/internal/sync/attendance", async (c) => {
  const auth = await authenticateRequest(c.req.raw, c.env);

  if (!auth) {
    return c.json({ ok: false, message: "Unauthorized." }, 401);
  }

  if (!hasRequiredRole(auth, ["hr_admin", "system"])) {
    return c.json({ ok: false, message: "Forbidden." }, 403);
  }

  const body = (await c.req.json()) as {
    source?: string;
    records?: Array<{
      employeeId?: string;
      lateArrivalCount?: number;
      lateArrivalUpdatedAt?: string;
    }>;
  };

  const records = (body.records ?? []).filter(
    (
      record
    ): record is { employeeId: string; lateArrivalCount: number; lateArrivalUpdatedAt?: string } =>
      typeof record.employeeId === "string" && typeof record.lateArrivalCount === "number"
  );

  if (records.length === 0) {
    return c.json(
      { ok: false, message: "At least one valid attendance sync record is required." },
      400
    );
  }

  const result = await ingestAttendanceSync({
    env: c.env,
    source: body.source,
    records,
    actorId: auth.userId,
    actorRole: auth.role
  });

  return c.json({
    ok: true,
    ...result
  });
});

app.get("/", (c) =>
  c.json({
    service: "ebms-api",
    message: "Backend foundation is in place.",
    routes: [
      ...routes,
      "/internal/recompute",
      "/internal/notifications/dispatch",
      "/internal/sync/okr",
      "/internal/sync/attendance"
    ]
  })
);

export default app;
