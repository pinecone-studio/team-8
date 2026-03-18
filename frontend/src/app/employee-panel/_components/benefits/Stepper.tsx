type Props = {
  currentStep: 1 | 2 | 3;
  /** When false, only 2 steps are shown: Contract Review → Submit Request (Upload Contract skipped) */
  requiresContract?: boolean;
};

const allSteps = [
  { id: 1, label: "Contract Review" },
  { id: 2, label: "Upload Contract" },
  { id: 3, label: "Submit Request" },
];

export default function Stepper({ currentStep, requiresContract = true }: Props) {
  const steps: { id: number; label: string; displayNum: number }[] =
    requiresContract === false
      ? [
          { id: 1, label: "Contract Review", displayNum: 1 },
          { id: 3, label: "Submit Request", displayNum: 2 },
        ]
      : allSteps.map((s, i) => ({ ...s, displayNum: i + 1 }));

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <span
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  done
                    ? "bg-green-500/90 text-white"
                    : active
                      ? "bg-blue-500 text-white font-medium"
                      : "bg-gray-200 text-gray-400",
                ].join(" ")}
              >
                {done ? "✓" : step.displayNum}
              </span>
              <span
                className={`text-xs ${active ? "font-medium text-gray-900" : "text-gray-500"}`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="mx-1.5 text-gray-300" aria-hidden="true">·</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
