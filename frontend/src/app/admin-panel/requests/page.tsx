"use client";

import { useState } from "react";
import Header from "@/app/_features/Header";
import AppSidebar from "@/app/_components/AppSidebar";
import {
  usePendingBenefitRequestsQuery,
  useGetBenefitRequestQuery,
  useApproveBenefitRequestMutation,
  useDeclineBenefitRequestMutation,
} from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

function formatBenefitId(id: string) {
  return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type RequestDetailExpandProps = {
  requestId: string;
  isExpanded: boolean;
  onToggle: () => void;
};

function RequestDetailExpand({
  requestId,
  isExpanded,
  onToggle,
}: RequestDetailExpandProps) {
  const { data } = useGetBenefitRequestQuery({
    variables: { id: requestId },
    skip: !isExpanded,
  });
  const req = data?.getBenefitRequest;

  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        View full detail
      </button>
      {isExpanded && req && (
        <div className="space-y-2 bg-gray-50/50 px-4 py-3 text-sm">
          <p>
            <span className="font-medium text-gray-600">Employee:</span>{" "}
            {req.employee?.name ?? req.employeeId}{" "}
            {req.employee?.email && `(${req.employee.email})`}
          </p>
          <p>
            <span className="font-medium text-gray-600">Benefit:</span>{" "}
            {req.benefit?.name ?? formatBenefitId(req.benefitId)}{" "}
            {req.benefit?.duration && `· ${req.benefit.duration}`}
          </p>
          {req.requestedAmount != null && (
            <p>
              <span className="font-medium text-gray-600">Amount:</span>{" "}
              {req.requestedAmount.toLocaleString()} MNT
            </p>
          )}
          {req.contractAcceptedAt && (
            <p>
              <span className="font-medium text-gray-600">
                Contract accepted:
              </span>{" "}
              {new Date(req.contractAcceptedAt).toLocaleString()}
            </p>
          )}
          {req.viewContractUrl && (
            <a
              href={req.viewContractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 underline"
            >
              <ExternalLink className="h-4 w-4" /> Open contract
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  const [reviewedBy, setReviewedBy] = useState("hr-admin@company.mn");
  const [declineReason, setDeclineReason] = useState("");
  const [declineModal, setDeclineModal] = useState<{
    requestId: string;
  } | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null,
  );

  const { data: requestsData, refetch } = usePendingBenefitRequestsQuery();
  const [approveRequest] = useApproveBenefitRequestMutation({
    onCompleted: () => refetch(),
    onError: (err) => alert(err.message),
  });
  const [declineRequest] = useDeclineBenefitRequestMutation({
    onCompleted: () => {
      setDeclineModal(null);
      setDeclineReason("");
      refetch();
    },
    onError: (err) => alert(err.message),
  });

  const requests = requestsData?.pendingBenefitRequests ?? [];

  const getEmployeeName = (req: {
    employeeId: string;
    employee?: { name: string } | null;
  }) => req.employee?.name ?? req.employeeId;

  const getBenefitName = (req: {
    benefitId: string;
    benefit?: { name: string } | null;
  }) => req.benefit?.name ?? formatBenefitId(req.benefitId);

  return (
    <div className="flex min-h-screen bg-[#f8f8f9]">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Request Review
          </h1>
          <p className="mt-2 text-gray-500">
            Review and approve or decline pending benefit requests.
          </p>
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reviewing as
            </label>
            <input
              type="text"
              value={reviewedBy}
              onChange={(e) => setReviewedBy(e.target.value)}
              placeholder="hr-admin@company.mn"
              className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
          </div>

          <div className="mt-8">
            {requests.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">No pending requests.</p>
                <p className="mt-2 text-sm text-gray-400">
                  Employees can submit requests from the My Benefits page.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {requests.map((req) => (
                  <li
                    key={req.id}
                    className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getEmployeeName(req)} → {getBenefitName(req)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Requested {new Date(req.createdAt).toLocaleString()}
                          {req.requestedAmount != null && (
                            <span className="ml-2">
                              Amount: {req.requestedAmount.toLocaleString()} MNT
                            </span>
                          )}
                          {req.benefit?.duration && (
                            <span className="ml-2">
                              · {req.benefit.duration}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            approveRequest({
                              variables: { requestId: req.id, reviewedBy },
                            })
                          }
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeclineModal({ requestId: req.id })}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                    <RequestDetailExpand
                      requestId={req.id}
                      isExpanded={expandedRequestId === req.id}
                      onToggle={() =>
                        setExpandedRequestId(
                          expandedRequestId === req.id ? null : req.id,
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Decline request
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Provide a reason for declining (optional but recommended for
              audit).
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for decline..."
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              rows={3}
            />
            <div className="mt-4 flex gap-2">
              <Button
                variant="destructive"
                onClick={() =>
                  declineRequest({
                    variables: {
                      requestId: declineModal.requestId,
                      reviewedBy,
                      reason: declineReason || undefined,
                    },
                  })
                }
              >
                Confirm Decline
              </Button>
              <Button variant="outline" onClick={() => setDeclineModal(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
