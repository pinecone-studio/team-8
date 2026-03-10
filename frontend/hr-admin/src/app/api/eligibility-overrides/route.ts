import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "auth";
import { workerGraphQL } from "lib/worker-graphql";

interface OverrideEligibilityResponse {
  overrideEligibility: {
    ok: boolean;
    employeeId: string;
    benefitId: string;
    status: string;
    overrideReason: string;
    overrideExpiresAt: string | null;
  };
}

const overrideEligibilityMutation = `
  mutation OverrideEligibility(
    $employeeId: ID!
    $benefitId: ID!
    $status: String!
    $reason: String!
    $expiresAt: String
  ) {
    overrideEligibility(
      employeeId: $employeeId
      benefitId: $benefitId
      status: $status
      reason: $reason
      expiresAt: $expiresAt
    ) {
      ok
      employeeId
      benefitId
      status
      overrideReason
      overrideExpiresAt
    }
  }
`;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.workerToken) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        employeeId?: string;
        benefitId?: string;
        status?: string;
        reason?: string;
        expiresAt?: string | null;
      }
    | null;

  if (!body?.employeeId || !body.benefitId || !body.status || !body.reason?.trim()) {
    return NextResponse.json(
      { ok: false, message: "employeeId, benefitId, status, and reason are required." },
      { status: 400 }
    );
  }

  try {
    const data = await workerGraphQL<OverrideEligibilityResponse>({
      query: overrideEligibilityMutation,
      workerToken: session.workerToken,
      variables: {
        employeeId: body.employeeId,
        benefitId: body.benefitId,
        status: body.status,
        reason: body.reason.trim(),
        expiresAt: body.expiresAt?.trim() || null
      }
    });

    return NextResponse.json({
      ok: true,
      override: data.overrideEligibility
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Eligibility override failed."
      },
      { status: 400 }
    );
  }
}
