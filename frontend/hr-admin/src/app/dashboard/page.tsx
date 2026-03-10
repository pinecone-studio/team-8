import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, isAllowedAdminRole } from "auth";
import { EligibilityOverrideForm } from "components/eligibility-override-form";
import { ReviewRequestCard } from "components/review-request-card";
import { SignOutButton } from "components/sign-out-button";
import { workerGraphQL } from "lib/worker-graphql";

interface AdminDashboardData {
  employees: Array<{
    id: string;
    email: string;
    department: string;
    role: string;
    responsibilityLevel: number;
  }>;
  benefits: Array<{
    id: string;
    name: string;
    slug: string;
    requiresFinanceApproval: boolean;
  }>;
  benefitRequests: Array<{
    id: string;
    employeeId: string;
    benefitId: string;
    status: string;
    createdAt: string;
  }>;
  notificationEvents: Array<{
    id: string;
    eventType: string;
    audience: string;
    status: string;
    sourceEntityId: string;
  }>;
  syncRuns: Array<{
    id: string;
    syncType: string;
    source: string;
    status: string;
    recordCount: number;
    startedAt: string;
  }>;
}

const adminDashboardQuery = `
  query AdminDashboard {
    employees {
      id
      email
      department
      role
      responsibilityLevel
    }
    benefits {
      id
      name
      slug
      requiresFinanceApproval
    }
    benefitRequests {
      id
      employeeId
      benefitId
      status
      createdAt
    }
    notificationEvents(limit: 8) {
      id
      eventType
      audience
      status
      sourceEntityId
    }
    syncRuns(limit: 8) {
      id
      syncType
      source
      status
      recordCount
      startedAt
    }
  }
`;

function formatRoleLabel(role: string) {
  return role.replace(/_/g, " ");
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const employeeAppUrl =
    process.env.NEXT_PUBLIC_EMPLOYEE_APP_URL?.trim() || "http://localhost:3000";

  if (!session?.workerToken) {
    redirect("/");
  }

  if (!isAllowedAdminRole(session.user?.role)) {
    redirect(`${employeeAppUrl}/dashboard`);
  }

  let data: AdminDashboardData;

  try {
    data = await workerGraphQL<AdminDashboardData>({
      query: adminDashboardQuery,
      workerToken: session.workerToken
    });
  } catch (error) {
    return (
      <main className="dashboard-shell">
        <section className="panel admin-hero">
          <div className="hero-copy">
            <div className="eyebrow">People Operations Console</div>
            <h1>HR console is waiting for the EBMS API worker.</h1>
            <p className="panel-copy">
              The frontend is running, but it cannot reach the GraphQL worker at
              {" "}
              <strong>{process.env.WORKER_GRAPHQL_URL?.trim() || "http://localhost:8787/graphql"}</strong>.
            </p>
            <div className="hero-tags">
              <span className="pill status-failed">API offline</span>
              <span className="pill">{formatRoleLabel(session.user.role)}</span>
            </div>
          </div>

          <div className="hero-actions">
            <div className="hero-stat-card">
              <span>What to start</span>
              <strong>api-worker</strong>
              <p>Run `npm run dev --workspace @ebms/api-worker` or use root `npm run dev`.</p>
            </div>
            <div className="hero-stat-card">
              <span>Last error</span>
              <strong>Worker unreachable</strong>
              <p>{error instanceof Error ? error.message : "Unknown worker connection error."}</p>
            </div>
            <SignOutButton />
          </div>
        </section>
      </main>
    );
  }

  const employeeById = new Map(data.employees.map((employee) => [employee.id, employee]));
  const benefitById = new Map(data.benefits.map((benefit) => [benefit.id, benefit]));
  const statusRank: Record<string, number> = {
    pending: 0,
    approved: 1,
    rejected: 2,
    cancelled: 3
  };

  const sortedRequests = [...data.benefitRequests].sort((left, right) => {
    const leftRank = statusRank[left.status.toLowerCase()] ?? 9;
    const rightRank = statusRank[right.status.toLowerCase()] ?? 9;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return right.createdAt.localeCompare(left.createdAt);
  });

  const pendingRequests = sortedRequests.filter((request) => request.status.toLowerCase() === "pending");
  const processedRequests = sortedRequests.filter(
    (request) => request.status.toLowerCase() !== "pending"
  );
  const financeLaneRequests = pendingRequests.filter((request) =>
    Boolean(benefitById.get(request.benefitId)?.requiresFinanceApproval)
  );
  const managerLaneRequests = pendingRequests.filter(
    (request) =>
      !benefitById.get(request.benefitId)?.requiresFinanceApproval &&
      benefitById.get(request.benefitId)?.slug === "travel"
  );
  const generalLaneRequests = pendingRequests.filter(
    (request) =>
      !benefitById.get(request.benefitId)?.requiresFinanceApproval &&
      benefitById.get(request.benefitId)?.slug !== "travel"
  );
  const departmentCoverage = Object.entries(
    data.employees.reduce(
      (summary, employee) => {
        summary[employee.department] = (summary[employee.department] ?? 0) + 1;
        return summary;
      },
      {} as Record<string, number>
    )
  ).sort((left, right) => right[1] - left[1]);
  const notificationHealth = data.notificationEvents.reduce(
    (summary, event) => {
      const key = event.status.toLowerCase();
      summary[key] = (summary[key] ?? 0) + 1;
      return summary;
    },
    {} as Record<string, number>
  );
  const syncHealth = data.syncRuns.reduce(
    (summary, run) => {
      const key = run.status.toLowerCase();
      summary[key] = (summary[key] ?? 0) + 1;
      return summary;
    },
    {} as Record<string, number>
  );
  const canOverrideEligibility = session.user.role === "hr_admin";

  return (
    <main className="dashboard-shell">
      <section className="panel admin-hero">
        <div className="hero-copy">
          <div className="eyebrow">People Operations Console</div>
          <h1>Run reviews, escalations, and manual interventions from one board.</h1>
          <p className="panel-copy">
            Signed in as {session.user.email}. This console is optimized for queue triage,
            eligibility exceptions, and audit-safe operations.
          </p>
          <div className="hero-tags">
            <span className="pill">{formatRoleLabel(session.user.role)}</span>
            <span className="pill">Pending {pendingRequests.length}</span>
            <span className="pill">Finance lane {financeLaneRequests.length}</span>
            <span className="pill">Departments {departmentCoverage.length}</span>
          </div>
        </div>

        <div className="hero-actions">
          <div className="hero-stat-card">
            <span>Review load</span>
            <strong>{pendingRequests.length}</strong>
            <p>Requests still waiting for a human decision.</p>
          </div>
          <div className="hero-stat-card">
            <span>Resolved</span>
            <strong>{processedRequests.length}</strong>
            <p>Requests already approved, rejected, or cancelled.</p>
          </div>
          <SignOutButton />
        </div>
      </section>

      <section className="metrics-grid">
        <article className="panel metric-card">
          <span>Employees</span>
          <strong>{data.employees.length}</strong>
        </article>
        <article className="panel metric-card">
          <span>Benefits</span>
          <strong>{data.benefits.length}</strong>
        </article>
        <article className="panel metric-card">
          <span>Pending</span>
          <strong>{pendingRequests.length}</strong>
        </article>
        <article className="panel metric-card">
          <span>Finance Lane</span>
          <strong>{financeLaneRequests.length}</strong>
        </article>
        <article className="panel metric-card">
          <span>Manager Lane</span>
          <strong>{managerLaneRequests.length}</strong>
        </article>
        <article className="panel metric-card">
          <span>Sync Runs</span>
          <strong>{data.syncRuns.length}</strong>
        </article>
      </section>

      <section className="ops-grid">
        <article className="panel action-panel queue-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Priority Board</div>
              <h2>Approval lanes</h2>
              <p className="panel-copy">
                Separate standard HR work from finance escalations and manager-sensitive requests.
              </p>
            </div>
          </div>

          <div className="lane-grid">
            {[
              {
                key: "general",
                title: "HR review",
                description: "Standard employee requests without financial escalation.",
                requests: generalLaneRequests
              },
              {
                key: "finance",
                title: "Finance queue",
                description: "Budget-sensitive requests that require finance approval.",
                requests: financeLaneRequests
              },
              {
                key: "manager",
                title: "Manager lane",
                description: "Requests that need an additional managerial checkpoint.",
                requests: managerLaneRequests
              }
            ].map((lane) => (
              <section className="lane-column" key={lane.key}>
                <div className="lane-head">
                  <div>
                    <strong>{lane.title}</strong>
                    <p>{lane.description}</p>
                  </div>
                  <span className="pill">{lane.requests.length}</span>
                </div>

                <div className="action-card-list">
                  {lane.requests.length === 0 ? (
                    <p className="panel-copy compact-copy">No active items in this lane.</p>
                  ) : (
                    lane.requests.map((request) => {
                      const employee = employeeById.get(request.employeeId);
                      const benefit = benefitById.get(request.benefitId);

                      return (
                        <ReviewRequestCard
                          key={request.id}
                          request={{
                            id: request.id,
                            employeeEmail: employee?.email ?? request.employeeId,
                            employeeId: request.employeeId,
                            benefitName: benefit?.name ?? request.benefitId,
                            benefitSlug: benefit?.slug ?? request.benefitId,
                            status: request.status.toUpperCase(),
                            createdAt: request.createdAt,
                            requiresFinanceApproval: Boolean(benefit?.requiresFinanceApproval)
                          }}
                          reviewerRole={session.user.role}
                        />
                      );
                    })
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>

        <article className="panel action-panel console-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Control Desk</div>
              <h2>Manual action area</h2>
              <p className="panel-copy">
                Override stays deliberately separate from the review queue to reduce accidental use.
              </p>
            </div>
          </div>

          {canOverrideEligibility ? (
            <EligibilityOverrideForm
              benefits={data.benefits.map((benefit) => ({
                id: benefit.id,
                name: benefit.name,
                slug: benefit.slug
              }))}
              employees={data.employees.map((employee) => ({
                id: employee.id,
                email: employee.email
              }))}
            />
          ) : (
            <article className="admin-action-card">
              <div className="admin-action-head">
                <div>
                  <strong>Eligibility override disabled</strong>
                  <p>
                    Finance reviewers can process finance-gated approvals, but HR keeps override
                    authority.
                  </p>
                </div>
                <span className="pill">Read only</span>
              </div>
            </article>
          )}
        </article>
      </section>

      <section className="dashboard-grid admin-dashboard-grid">
        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Ops Summary</div>
              <h2>Queue health</h2>
            </div>
          </div>

          <div className="insight-list">
            <div className="insight-row">
              <strong>General HR lane</strong>
              <span>{generalLaneRequests.length} active items</span>
            </div>
            <div className="insight-row">
              <strong>Finance escalations</strong>
              <span>{financeLaneRequests.length} items need budget review</span>
            </div>
            <div className="insight-row">
              <strong>Manager lane</strong>
              <span>{managerLaneRequests.length} items need extra sign-off</span>
            </div>
            <div className="insight-row">
              <strong>Closed decisions</strong>
              <span>{processedRequests.length} requests have been processed</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Coverage</div>
              <h2>Department footprint</h2>
            </div>
          </div>

          <div className="table-list">
            {departmentCoverage.map(([department, count]) => (
              <div className="table-row" key={department}>
                <div>
                  <strong>{department}</strong>
                  <p>{count} people represented in the current employee set</p>
                </div>
                <span className="pill">{Math.round((count / data.employees.length) * 100)}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">People</div>
              <h2>Key employee list</h2>
            </div>
          </div>

          <div className="table-list">
            {data.employees.slice(0, 8).map((employee) => (
              <div className="table-row" key={employee.id}>
                <div>
                  <strong>{employee.email}</strong>
                  <p>
                    {employee.department} · {employee.role}
                  </p>
                </div>
                <span className="pill">L{employee.responsibilityLevel}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Outbox</div>
              <h2>Notification health</h2>
            </div>
          </div>

          <div className="mini-metrics">
            <span className="pill status-sent">Sent {notificationHealth.sent ?? 0}</span>
            <span className="pill status-pending">Pending {notificationHealth.pending ?? 0}</span>
            <span className="pill status-failed">Failed {notificationHealth.failed ?? 0}</span>
          </div>

          <div className="table-list">
            {data.notificationEvents.map((event) => (
              <div className="table-row" key={event.id}>
                <div>
                  <strong>{event.eventType}</strong>
                  <p>
                    {event.audience} · {event.sourceEntityId}
                  </p>
                </div>
                <span className={`pill status-${event.status.toLowerCase()}`}>{event.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Sync</div>
              <h2>Import health</h2>
            </div>
          </div>

          <div className="mini-metrics">
            <span className="pill status-completed">Completed {syncHealth.completed ?? 0}</span>
            <span className="pill status-partial">Partial {syncHealth.partial ?? 0}</span>
          </div>

          <div className="table-list">
            {data.syncRuns.map((run) => (
              <div className="table-row" key={run.id}>
                <div>
                  <strong>{run.syncType}</strong>
                  <p>
                    {run.source} · {new Date(run.startedAt).toLocaleString()}
                  </p>
                </div>
                <span className={`pill status-${run.status.toLowerCase()}`}>
                  {run.status} · {run.recordCount}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Request Log</div>
              <h2>Latest decisions</h2>
            </div>
          </div>

          <div className="table-list">
            {sortedRequests.slice(0, 8).map((request) => (
              <div className="table-row" key={request.id}>
                <div>
                  <strong>{benefitById.get(request.benefitId)?.name ?? request.benefitId}</strong>
                  <p>{employeeById.get(request.employeeId)?.email ?? request.employeeId}</p>
                </div>
                <span className={`pill status-${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
