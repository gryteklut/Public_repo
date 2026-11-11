import { Button } from "@/components/ui/button";
import { findDay } from "@/data/curriculum";
import { getUdemyGuide } from "@/data/udemyMap";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { withBase } from "@/lib/base";

import { ProgressBar } from "./ProgressBar";
import { TagBadge } from "./TagBadge";
import { UdemyWatch } from "./UdemyWatch";

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
  const percent = Math.round((completed / day.modules.length) * 100);
  const primaryUdemy = getUdemyGuide(day.modules[0]?.id ?? "");

  return (
    <div className="space-y-8">
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
          {day.isPracticeDay ? " · Quiz-first practice" : " · Learn then check"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{day.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">{day.focus}</p>
        <ProgressBar
          value={percent}
          label="Day progress"
          detail={`${completed} / ${day.modules.length} modules`}
        />
      </header>

      {primaryUdemy && <UdemyWatch guide={primaryUdemy} compact />}

      <ul className="space-y-4">
        {day.modules.map((module) => {
          const unlocked = allQuestionsCorrect(
            module.id,
            module.questions.map((q) => q.id),
          );
          const done = isModuleComplete(module.id);
          return (
            <li
              key={module.id}
              className="bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-xs md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  <a
                    className="hover:underline"
                    href={withBase(
                      `/AB-650/day/${day.id}/module/${module.id}/`,
                    )}
                  >
                    {module.title}
                  </a>
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {module.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {module.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">
                  {done
                    ? "Complete"
                    : unlocked
                      ? "Ready to mark done"
                      : "In progress"}
                </span>
                <Button variant="outline" asChild>
                  <a
                    href={withBase(
                      `/AB-650/day/${day.id}/module/${module.id}/`,
                    )}
                  >
                    Open module
                  </a>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
