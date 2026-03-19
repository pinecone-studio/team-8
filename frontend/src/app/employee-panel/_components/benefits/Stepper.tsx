type Props = {
  currentStep: 1 | 2 | 3;
  /** When false, only 2 steps are shown: Contract Review → Submit Request (Upload Contract skipped) */
  requiresContract?: boolean;
/** Finance (down payment): request → review offer → upload signed contract */
  variant?: "default" | "finance";
};

const contractSteps = [
  { id: 1, label: "Contract Review" },
  { id: 2, label: "Upload Contract" },
  { id: 3, label: "Submit Request" },
  { id: 4, label: "Payment" },
  { id: 5, label: "Submit Payment" },
];

const financeSteps = [
  { id: 1, label: "Loan request" },
  { id: 2, label: "Review offer" },
  { id: 3, label: "Upload signed contract" },
];

export default function Stepper({
  currentStep,
  requiresContract = true,
  variant = "default",
}: Props) {
  const steps: { id: number; label: string; displayNum: number }[] =
    variant === "finance"
      ? financeSteps.map((s, i) => ({ ...s, displayNum: i + 1 }))
      : requiresContract === false
        ? [
            { id: 1, label: "Contract Review", displayNum: 1 },
            { id: 3, label: "Submit Request", displayNum: 2 },
          ]
        : contractSteps.map((s, i) => ({ ...s, displayNum: i + 1 }));

  return (
    <div className="w-full pb-0.5">
      <div className="flex w-full items-start px-0 py-0.5">
        {steps.map((step, index) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <div key={step.id} className="relative min-w-0 flex-1 px-0">
              {index < steps.length - 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute left-[calc(50%+0.8rem)] right-[-50%] top-[0.7rem] border-t-2 border-slate-300 sm:left-[calc(50%+0.9rem)] sm:top-[0.8rem]"
                  />
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute left-[calc(50%+0.8rem)] right-[-50%] top-[0.7rem] border-t-2 transition-colors duration-300 sm:left-[calc(50%+0.9rem)] sm:top-[0.8rem]",
                      done ? "border-emerald-400" : "border-slate-300/90",
                    ].join(" ")}
                  />
                </>
              )}

              <div className="relative z-10 flex flex-col items-center">
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-semibold transition-all duration-300 sm:h-7 sm:w-7 sm:text-xs",
                    done
                      ? "border-emerald-300 bg-emerald-100 text-emerald-600"
                      : active
                        ? "border-amber-400 bg-amber-50 text-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.14)]"
                        : "border-slate-200 bg-white text-slate-300",
                  ].join(" ")}
                >
                  {done ? "✓" : step.displayNum}
                </span>

                <p
                  className={[
                    "mt-1 max-w-full px-0.5 text-center text-[9px] font-semibold leading-3 transition-colors sm:text-[10px] sm:leading-3.5",
                    done
                      ? "text-emerald-600"
                      : active
                        ? "text-amber-500"
                        : "text-slate-300",
                  ].join(" ")}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
