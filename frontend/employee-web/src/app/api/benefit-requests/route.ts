import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "auth";
import { workerGraphQL } from "lib/worker-graphql";

interface RequestBenefitResponse {
  requestBenefit: {
    ok: boolean;
    request: {
      id: string;
      benefitId: string;
      status: string;
      contractVersionAccepted: string | null;
      createdAt: string;
    };
  };
}

const requestBenefitMutation = `
  mutation RequestBenefit(
    $benefitId: ID!
    $contractId: ID
    $acceptContract: Boolean!
    $requesterIp: String
  ) {
    requestBenefit(
      benefitId: $benefitId
      contractId: $contractId
      acceptContract: $acceptContract
      requesterIp: $requesterIp
    ) {
      ok
      request {
        id
        benefitId
        status
        contractVersionAccepted
        createdAt
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
        benefitId?: string;
        contractId?: string | null;
        acceptContract?: boolean;
      }
    | null;

  if (!body?.benefitId || typeof body.acceptContract !== "boolean") {
    return NextResponse.json(
      { ok: false, message: "benefitId and acceptContract are required." },
      { status: 400 }
    );
  }

  const requesterIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "127.0.0.1";

  try {
    const data = await workerGraphQL<RequestBenefitResponse>({
      query: requestBenefitMutation,
      workerToken: session.workerToken,
      variables: {
        benefitId: body.benefitId,
        contractId: body.contractId ?? null,
        acceptContract: body.acceptContract,
        requesterIp
      }
    });

    return NextResponse.json({
      ok: true,
      request: data.requestBenefit.request
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Request submission failed."
      },
      { status: 400 }
    );
  }
}
