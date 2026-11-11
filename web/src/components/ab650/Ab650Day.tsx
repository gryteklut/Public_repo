import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { findDay } from "@/data/curriculum";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { withBase } from "@/lib/base";

import { ProgressBar } from "./ProgressBar";
import { TagBadge } from "./TagBadge";

/** Day index: prefer jumping straight into the module workspace. */
export default function Ab650Day({ dayId }: { dayId: string }) {
  return (
    <ProgressProvider>
      <DayInner dayId={dayId} />
    </ProgressProvider>
  );
}

function DayInner({ dayId }: { dayId: string }) {
  const day = findDay(dayId);
  const { isModuleComplete, allQuestionsCorrect } = useProgress();

  const primary = day?.modules[0];
  const primaryHref =
    day && primary
      ? withBase(`/AB-650/day/${day.id}/module/${primary.id}/`)
      : withBase("/AB-650/");

  useEffect(() => {
    if (!primary) return;
    // Module view is the preferred workspace — auto-open it.
    window.location.replace(primaryHref);
  }, [primary, primaryHref]);

  if (!day) {
    return (
      <div className="space-y-3">
        <p>Day not found.</p>
        <a className="underline" href={withBase("/AB-650/")}>
          Back to AB-650
        </a>
      </div>
    );
  }

  const completed = day.modules.filter((m) => isModuleComplete(m.id)).length;
  const percent = Math.round((completed / Math.max(day.modules.length, 1)) * 100);

  return (
    <div className="space-y-6">
      <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <a className="hover:text-foreground" href={withBase("/AB-650/")}>
          AB-650 home
        </a>
        <span>/</span>
        <span>Day {day.dayNumber}</span>
      </nav>

      <header className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Day {day.dayNumber}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{day.title}</h1>
        <p className="text-muted-foreground mt-2">{day.focus}</p>
        <ProgressBar
          value={percent}
          label="Day progress"
          detail={`${completed} / ${day.modules.length} modules`}
        />
        <p className="text-muted-foreground mt-4 text-sm">
          Opening the module workspace…
        </p>
      </header>

      <ul className="space-y-3">
        {day.modules.map((module) => {
          const unlocked = allQuestionsCorrect(
            module.id,
            module.questions.map((q) => q.id),
          );
          const done = isModuleComplete(module.id);
          const href = withBase(
            `/AB-650/day/${day.id}/module/${module.id}/`,
          );
          return (
            <li
              key={module.id}
              className="bg-card flex flex-col gap-3 rounded-2xl border p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-semibold">{module.title}</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {module.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">
                  {done
                    ? "Complete"
                    : unlocked
                      ? "Ready to mark done"
                      : "In progress"}
                </span>
                <Button asChild>
                  <a href={href}>Open module</a>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
