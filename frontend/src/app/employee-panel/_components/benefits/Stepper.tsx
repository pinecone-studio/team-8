type Props = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  { id: 1, label: "Confirm Eligibility" },
  { id: 2, label: "Contract Acceptance" },
  { id: 3, label: "Submit Request" },
];

export default function Stepper({ currentStep }: Props) {
  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  done
                    ? "bg-green-600 text-white"
                    : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600",
                ].join(" ")}
              >
                {done ? "✓" : step.id}
              </div>
              <span
                className={`text-sm ${active ? "font-semibold text-gray-900" : "text-gray-600"}`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="h-px w-20 bg-gray-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}
