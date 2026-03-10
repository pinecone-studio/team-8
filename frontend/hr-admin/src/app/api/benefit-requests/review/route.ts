import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "auth";
import { workerGraphQL } from "lib/worker-graphql";

interface ReviewBenefitRequestResponse {
  reviewBenefitRequest: {
    ok: boolean;
    request: {
      id: string;
      status: string;
      reviewedBy: string | null;
      updatedAt: string;
    };
  };
}

const reviewBenefitRequestMutation = `
  mutation ReviewBenefitRequest($requestId: ID!, $status: String!, $reason: String) {
    reviewBenefitRequest(requestId: $requestId, status: $status, reason: $reason) {
      ok
      request {
        id
        status
        reviewedBy
        updatedAt
      }
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
        requestId?: string;
        status?: string;
        reason?: string;
      }
    | null;

  if (!body?.requestId || !body.status) {
    return NextResponse.json(
      { ok: false, message: "requestId and status are required." },
      { status: 400 }
    );
  }

  try {
    const data = await workerGraphQL<ReviewBenefitRequestResponse>({
      query: reviewBenefitRequestMutation,
      workerToken: session.workerToken,
      variables: {
        requestId: body.requestId,
        status: body.status,
        reason: body.reason?.trim() || null
      }
    });

    return NextResponse.json({
      ok: true,
      request: data.reviewBenefitRequest.request
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Request review failed."
      },
      { status: 400 }
    );
  }
}
