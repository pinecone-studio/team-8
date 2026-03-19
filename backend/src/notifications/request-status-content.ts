function formatCurrencyMnt(value: number): string {
  return `${value.toLocaleString("en-US")}₮`;
}

type EmployeeRequestStatusContentInput = {
  status: string;
  benefitName: string;
  benefitId: string;
  declineReason?: string | null;
  requestedAmount?: number | null;
  repaymentMonths?: number | null;
  financeProposedAmount?: number | null;
  financeProposedRepaymentMonths?: number | null;
  financeProposalNote?: string | null;
};

type EmployeeRequestStatusContent = {
  title: string;
  body: string;
  linkPath: string;
};

export function getEmployeeRequestStatusContent(
  input: EmployeeRequestStatusContentInput,
): EmployeeRequestStatusContent | null {
  const {
    status,
    benefitName,
    benefitId,
    declineReason,
    requestedAmount,
    repaymentMonths,
    financeProposedAmount,
    financeProposedRepaymentMonths,
    financeProposalNote,
  } = input;

  const financeRequestSummary =
    requestedAmount && repaymentMonths
      ? ` Requested amount: ${formatCurrencyMnt(requestedAmount)} over ${repaymentMonths} month${repaymentMonths === 1 ? "" : "s"}.`
      : "";

  switch (status) {
    case "awaiting_contract_acceptance":
      return {
        title: `Contract ready: ${benefitName}`,
        body: `${benefitName} needs your contract review before HR can continue processing it.`,
        linkPath: `/employee-panel/benefits/${benefitId}/request`,
      };
    case "awaiting_hr_review":
      return {
        title: `Submitted: ${benefitName}`,
        body: `Your request for ${benefitName} has been submitted and is now waiting for HR review.${financeRequestSummary}`,
        linkPath: "/employee-panel/requests",
      };
    case "awaiting_finance_review":
      return {
        title: `Finance review: ${benefitName}`,
        body: `Your request for ${benefitName} is now waiting for Finance review.${financeRequestSummary}`,
        linkPath: "/employee-panel/requests",
      };
    case "hr_approved":
      return {
        title: `HR approved: ${benefitName}`,
        body: `HR approved your ${benefitName} request. Finance review is the next step.`,
        linkPath: "/employee-panel/requests",
      };
    case "finance_approved":
      return {
        title: `Finance approved: ${benefitName}`,
        body: `Finance approved your ${benefitName} request. HR will complete the final internal review next.`,
        linkPath: "/employee-panel/requests",
      };
    case "awaiting_employee_decision": {
      const offerBits: string[] = [];
      if (financeProposedAmount) {
        offerBits.push(formatCurrencyMnt(financeProposedAmount));
      }
      if (financeProposedRepaymentMonths) {
        offerBits.push(`${financeProposedRepaymentMonths} month${financeProposedRepaymentMonths === 1 ? "" : "s"}`);
      }
      const offerSummary =
        offerBits.length > 0 ? ` Review Finance's offer for ${offerBits.join(" over ")}.` : "";
      const noteSummary = financeProposalNote?.trim()
        ? ` Finance note: ${financeProposalNote.trim()}`
        : "";
      return {
        title: `Finance offer ready: ${benefitName}`,
        body: `${benefitName} has a Finance offer ready for your decision.${offerSummary}${noteSummary}`,
        linkPath: "/employee-panel/requests",
      };
    }
    case "awaiting_employee_signed_contract":
      return {
        title: `Upload signed contract: ${benefitName}`,
        body: `You accepted the offer for ${benefitName}. Upload your signed contract to continue.`,
        linkPath: "/employee-panel/requests",
      };
    case "awaiting_final_finance_approval":
      return {
        title: `Final finance review: ${benefitName}`,
        body: `Finance received your signed contract for ${benefitName} and is completing the final review.`,
        linkPath: "/employee-panel/requests",
      };
    case "awaiting_payment":
      return {
        title: `Payment required: ${benefitName}`,
        body: `${benefitName} is approved pending your payment. Complete the remaining employee payment to activate it.`,
        linkPath: "/employee-panel/requests",
      };
    case "awaiting_payment_review":
      return {
        title: `Payment under review: ${benefitName}`,
        body: `Your payment for ${benefitName} was submitted successfully and is now waiting for HR verification.`,
        linkPath: "/employee-panel/requests",
      };
    case "approved":
      return {
        title: `Approved: ${benefitName}`,
        body: `Your request for ${benefitName} is fully approved and the benefit is now active.`,
        linkPath: "/employee-panel/mybenefits",
      };
    case "rejected":
      return {
        title: `Declined: ${benefitName}`,
        body: declineReason?.trim()
          ? `Your request for ${benefitName} was declined. Reason: ${declineReason.trim()}`
          : `Your request for ${benefitName} was declined.`,
        linkPath: "/employee-panel/requests",
      };
    case "cancelled":
      return {
        title: `Cancelled: ${benefitName}`,
        body: `Your request for ${benefitName} has been cancelled.`,
        linkPath: "/employee-panel/requests",
      };
    default:
      return null;
  }
}
