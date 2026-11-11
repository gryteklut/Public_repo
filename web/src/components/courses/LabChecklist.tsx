import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  loadCourseProgress,
  saveCourseProgress,
  setLabChecked,
} from "@/lib/courseProgress";

export function LabChecklist({
  code,
  day,
  steps,
}: {
  code: string;
  day: number;
  steps: string[];
}) {
  const [tick, setTick] = useState(0);
  const progress = loadCourseProgress(code);
  const lab = progress.steps[String(day)]?.labChecked ?? {};
  void tick;

  if (!steps.length) {
    return (
      <p className="text-muted-foreground text-sm">No lab steps for this day.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {steps.map((step) => {
        const id = `lab-${day}-${step}`;
        const checked = Boolean(lab[step]);
        return (
          <li key={step}>
            <label
              htmlFor={id}
              className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm"
            >
              <Checkbox
                id={id}
                checked={checked}
                className="mt-0.5"
                onCheckedChange={(v) => {
                  saveCourseProgress(
                    setLabChecked(progress, String(day), step, v === true),
                  );
                  setTick((t) => t + 1);
                }}
              />
              <span
                className={`leading-relaxed ${checked ? "text-muted-foreground line-through" : ""}`}
              >
                {step}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
