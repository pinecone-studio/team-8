import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, isAdminRole } from "auth";
import { RequestBenefitCard } from "components/request-benefit-card";
import { SignOutButton } from "components/sign-out-button";
import { workerGraphQL } from "lib/worker-graphql";

interface DashboardData {
  me: {
    id: string;
    email: string;
    role: string;
    department: string;
    responsibilityLevel: number;
    okrSubmitted: boolean;
    lateArrivalCount: number;
  };
  myBenefits: Array<{
    status: string | null;
    ruleEvaluationJson: string | null;
    benefit: {
      id: string;
      slug: string;
      name: string;
      category: string;
      requiresContract: boolean;
      requiresFinanceApproval: boolean;
    };
  }>;
  myBenefitRequests: Array<{
    id: string;
    benefitId: string;
    status: string;
    createdAt: string;
  }>;
}

interface RuleEvaluation {
  ruleId: string;
  ruleType: string;
  passed: boolean;
  expected: boolean | number | string | string[];
  actual: boolean | number | string | string[];
  errorMessage: string | null;
}

interface BenefitContractData {
  benefitContract: {
    id: string;
    version: string;
    vendorName: string;
    effectiveDate: string;
    expiryDate: string;
  } | null;
}

interface ContractDownloadData {
  contractDownloadUrl: {
    url: string;
  };
}

interface RequestPanelItem {
  benefit: {
    id: string;
    name: string;
    slug: string;
    category: string;
    status: string;
    requiresContract: boolean;
    requiresFinanceApproval: boolean;
    blockingReason: string | null;
    activeRequestStatus: string | null;
  };
  contract:
    | {
        id: string;
        version: string;
        vendorName: string;
        effectiveDate: string;
        expiryDate: string;
        downloadUrl: string | null;
      }
    | undefined;
}

interface EnrichedBenefitItem {
  benefit: RequestPanelItem["benefit"];
  contract: RequestPanelItem["contract"];
  portfolioStatus: string;
  requestCreatedAt: string | null;
}

const dashboardQuery = `
  query EmployeeDashboard {
    me {
      id
      email
      role
      department
      responsibilityLevel
      okrSubmitted
      lateArrivalCount
    }
    myBenefits {
      status
      ruleEvaluationJson
      benefit {
        id
        slug
        name
        category
        requiresContract
        requiresFinanceApproval
      }
    }
    myBenefitRequests {
      id
      benefitId
      status
      createdAt
    }
  }
`;

const benefitContractQuery = `
  query BenefitContract($benefitId: ID!) {
    benefitContract(benefitId: $benefitId) {
      id
      version
      vendorName
      effectiveDate
      expiryDate
    }
  }
`;

const contractDownloadUrlQuery = `
  query ContractDownloadUrl($contractId: ID!) {
    contractDownloadUrl(contractId: $contractId) {
      url
    }
  }
`;

function summarizeBenefits(items: DashboardData["myBenefits"]) {
  return items.reduce(
    (summary, item) => {
      const key = (item.status ?? "UNKNOWN").toUpperCase();
      summary[key] = (summary[key] ?? 0) + 1;
      return summary;
    },
    {} as Record<string, number>
  );
}

function parseRuleEvaluations(ruleEvaluationJson: string | null): RuleEvaluation[] {
  if (!ruleEvaluationJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(ruleEvaluationJson) as unknown;
    return Array.isArray(parsed) ? (parsed as RuleEvaluation[]) : [];
  } catch {
    return [];
  }
}

function getBlockingReason(ruleEvaluationJson: string | null): string | null {
  const failedRule = parseRuleEvaluations(ruleEvaluationJson).find((entry) => entry.passed === false);
  return failedRule?.errorMessage ?? null;
}

function compareRequestPriority(left: EnrichedBenefitItem, right: EnrichedBenefitItem) {
  const score = (item: EnrichedBenefitItem) => {
    if (item.benefit.activeRequestStatus === "PENDING") {
      return 0;
    }

    if (item.benefit.status === "ELIGIBLE" && !item.benefit.activeRequestStatus) {
      return 1;
    }

    if (item.benefit.activeRequestStatus === "APPROVED") {
      return 2;
    }

    return 3;
  };

  const leftScore = score(left);
  const rightScore = score(right);

  if (leftScore !== rightScore) {
    return leftScore - rightScore;
  }

  if (left.requestCreatedAt && right.requestCreatedAt) {
    return right.requestCreatedAt.localeCompare(left.requestCreatedAt);
  }

  return left.benefit.name.localeCompare(right.benefit.name);
}

async function loadContractData(benefitId: string, workerToken: string) {
  const contractData = await workerGraphQL<BenefitContractData>({
    query: benefitContractQuery,
    workerToken,
    variables: {
      benefitId
    }
  });

  const contract = contractData.benefitContract;

  if (!contract) {
    return undefined;
  }

  let downloadUrl: string | null = null;

  try {
    const downloadData = await workerGraphQL<ContractDownloadData>({
      query: contractDownloadUrlQuery,
      workerToken,
      variables: {
        contractId: contract.id
      }
    });

    downloadUrl = downloadData.contractDownloadUrl.url;
  } catch {
    downloadUrl = null;
  }

  return {
    ...contract,
    downloadUrl
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const adminAppUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL?.trim() || "http://localhost:3001";

  if (!session?.workerToken) {
    redirect("/");
  }

  if (isAdminRole(session.user?.role)) {
    redirect(`${adminAppUrl}/dashboard`);
  }

  let data: DashboardData;

  try {
    data = await workerGraphQL<DashboardData>({
      query: dashboardQuery,
      workerToken: session.workerToken
    });
  } catch (error) {
    return (
      <main className="dashboard-shell">
        <section className="dashboard-header panel">
          <div>
            <div className="eyebrow">Employee Benefits Portal</div>
            <h1>Portal is waiting for the EBMS API worker.</h1>
            <p className="panel-copy">
              The frontend is running, but it cannot reach
              {" "}
              <strong>{process.env.WORKER_GRAPHQL_URL?.trim() || "http://localhost:8787/graphql"}</strong>.
            </p>
          </div>
          <SignOutButton />
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Backend Required</div>
              <h2>Start the Worker API</h2>
            </div>
          </div>
          <p className="panel-copy">
            Run `npm run dev --workspace @ebms/api-worker` or start everything together with root
            `npm run dev`.
          </p>
          <p className="error-text">
            {error instanceof Error ? error.message : "Unknown worker connection error."}
          </p>
        </section>
      </main>
    );
  }

  const summary = summarizeBenefits(data.myBenefits);
  const benefitNameById = new Map(data.myBenefits.map((item) => [item.benefit.id, item.benefit.name]));
  const latestRequestsByBenefitId = new Map<string, DashboardData["myBenefitRequests"][number]>();

  for (const request of data.myBenefitRequests) {
    if (!latestRequestsByBenefitId.has(request.benefitId)) {
      latestRequestsByBenefitId.set(request.benefitId, request);
    }
  }

  const contractBenefits = data.myBenefits.filter((item) => item.benefit.requiresContract);
  const contractEntries = await Promise.all(
    contractBenefits.map(async (item) => [
      item.benefit.id,
      await loadContractData(item.benefit.id, session.workerToken)
    ] as const)
  );
  const contractsByBenefitId = new Map(contractEntries);

  const enrichedBenefits: EnrichedBenefitItem[] = data.myBenefits.map((item) => {
    const latestRequest = latestRequestsByBenefitId.get(item.benefit.id);
    const blockingReason = getBlockingReason(item.ruleEvaluationJson);

    return {
      benefit: {
        id: item.benefit.id,
        name: item.benefit.name,
        slug: item.benefit.slug,
        category: item.benefit.category,
        status: (item.status ?? "UNKNOWN").toUpperCase(),
        requiresContract: item.benefit.requiresContract,
        requiresFinanceApproval: item.benefit.requiresFinanceApproval,
        blockingReason,
        activeRequestStatus: latestRequest?.status ?? null
      },
      contract: contractsByBenefitId.get(item.benefit.id),
      portfolioStatus: (item.status ?? "UNKNOWN").toUpperCase(),
      requestCreatedAt: latestRequest?.createdAt ?? null
    };
  });

  const requestPanelItems = [...enrichedBenefits].sort(compareRequestPriority);
  const actionableBenefits = requestPanelItems.filter(
    (item) => item.benefit.status === "ELIGIBLE" || item.benefit.activeRequestStatus
  );
  const portfolioItems = [...enrichedBenefits].sort((left, right) =>
    left.benefit.name.localeCompare(right.benefit.name)
  );
  const readyToRequestCount = requestPanelItems.filter(
    (item) => item.benefit.status === "ELIGIBLE" && !item.benefit.activeRequestStatus
  ).length;
  const pendingRequestCount = requestPanelItems.filter(
    (item) => item.benefit.activeRequestStatus === "PENDING"
  ).length;
  const lockedBenefitCount = requestPanelItems.filter((item) => item.benefit.status === "LOCKED").length;

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header panel">
        <div>
          <div className="eyebrow">Worker Connected</div>
          <h1>{data.me.email}</h1>
          <p className="panel-copy">
            {data.me.department} · role {data.me.role} · responsibility level{" "}
            {data.me.responsibilityLevel}
          </p>
        </div>

        <div className="header-actions">
          <div className="status-chip">
            OKR {data.me.okrSubmitted ? "submitted" : "missing"} / late arrivals{" "}
            {data.me.lateArrivalCount}
          </div>
          <SignOutButton />
        </div>
      </section>

      <section className="summary-grid">
        {Object.entries(summary).map(([label, value]) => (
          <article className="panel summary-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
        <article className="panel summary-card">
          <span>Ready To Request</span>
          <strong>{readyToRequestCount}</strong>
        </article>
        <article className="panel summary-card">
          <span>Pending Requests</span>
          <strong>{pendingRequestCount}</strong>
        </article>
        <article className="panel summary-card">
          <span>Blocked Benefits</span>
          <strong>{lockedBenefitCount}</strong>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel request-actions-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Portfolio</div>
              <h2>My benefits</h2>
              <p className="panel-copy">
                Eligibility engine-ээс гарсан одоогийн төлөв. Locked benefit бүр rule failure reason-оо
                харуулна.
              </p>
            </div>
          </div>

          <div className="benefit-list">
            {portfolioItems.map((item) => (
              <div className="benefit-row" key={item.benefit.id}>
                <div>
                  <strong>{item.benefit.name}</strong>
                  <p>
                    {item.benefit.category} · {item.benefit.slug}
                  </p>
                  {item.benefit.activeRequestStatus ? (
                    <p className="subtle-text">Current request: {item.benefit.activeRequestStatus}</p>
                  ) : null}
                  {item.benefit.blockingReason ? (
                    <p className="subtle-text">{item.benefit.blockingReason}</p>
                  ) : null}
                </div>
                <div className="benefit-meta">
                  <span className={`pill status-${item.portfolioStatus.toLowerCase()}`}>
                    {item.portfolioStatus}
                  </span>
                  {item.benefit.requiresContract ? <span className="pill">contract</span> : null}
                  {item.benefit.requiresFinanceApproval ? (
                    <span className="pill">finance review</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Actions</div>
              <h2>Request a benefit</h2>
              <p className="panel-copy">
                Actionable benefit-үүдийг эхэнд нь гаргасан. Pending эсвэл approved request байвал card
                дээр нь төлөв нь харагдана.
              </p>
            </div>
          </div>

          <div className="request-card-list">
            {(actionableBenefits.length > 0 ? actionableBenefits : requestPanelItems).map((item) => (
              <RequestBenefitCard benefit={item.benefit} contract={item.contract} key={item.benefit.id} />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Requests</div>
              <h2>My request history</h2>
            </div>
          </div>

          <div className="request-list">
            {data.myBenefitRequests.length === 0 ? (
              <p className="empty-state">No requests yet.</p>
            ) : (
              data.myBenefitRequests.map((request) => (
                <div className="request-row" key={request.id}>
                  <div>
                    <strong>{benefitNameById.get(request.benefitId) ?? request.benefitId}</strong>
                    <p>{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`pill status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
