import { BookOpen, ExternalLink, GraduationCap, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { findDay } from "@/data/curriculum";
import { getSkillsUpLinks } from "@/data/skillsUpMap";
import { getUdemyGuide } from "@/data/udemyMap";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { withBase } from "@/lib/base";

import { ProgressBar } from "./ProgressBar";
import { Quiz } from "./Quiz";
import { TagBadge } from "./TagBadge";

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

  // One module per day in the current curriculum — quiz lives on the day page.
  const module = day.modules[0];
  const completed = day.modules.filter((m) => isModuleComplete(m.id)).length;
  const percent = Math.round((completed / Math.max(day.modules.length, 1)) * 100);
  const unlocked = module
    ? allQuestionsCorrect(
        module.id,
        module.questions.map((q) => q.id),
      )
    : false;
  const done = module ? isModuleComplete(module.id) : false;
  const udemy = module ? getUdemyGuide(module.id) : undefined;
  const skillsUp = module ? getSkillsUpLinks(module.id) : [];

  return (
    <div className="space-y-6">
      <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <a className="hover:text-foreground" href={withBase("/AB-650/")}>
          AB-650 home
        </a>
        <span>/</span>
        <span>Day {day.dayNumber}</span>
      </nav>

      <header className="bg-card rounded-2xl border p-5 shadow-xs md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Day {day.dayNumber}
              {day.isPracticeDay ? " · Quiz-first practice" : " · Learn then check"}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {day.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl text-sm md:text-base">
              {day.focus}
            </p>
          </div>
          <span className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
            ~{day.estimatedMinutes} min
          </span>
        </div>
        {module && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{module.title}</span>
            {module.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            <span className="bg-muted ml-auto rounded-full px-2.5 py-1 text-xs font-medium">
              {done ? "Complete" : unlocked ? "Ready to mark done" : "In progress"}
            </span>
          </div>
        )}
        <ProgressBar
          value={percent}
          label="Day progress"
          detail={`${completed} / ${day.modules.length} modules`}
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main: quiz box straight away */}
        <section className="bg-card min-w-0 overflow-hidden rounded-3xl border shadow-xs">
          <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-5">
            <span className="bg-[#d8f56a] text-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold">
              <ListChecks className="size-4" />
              Quiz
            </span>
            {module && (
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <a
                  href={withBase(
                    `/AB-650/day/${day.id}/module/${module.id}/`,
                  )}
                >
                  Full module view
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-4 p-4 md:p-6">
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Instruction
              </h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {day.isPracticeDay
                  ? "Retrieval practice day. Answer from memory first; open study notes only if you miss, then retrieve again until correct."
                  : `Successive relearning for “${module?.title ?? day.title}”: try each question cold, study only misses, re-check to criterion. Sidebar has Microsoft Learn + SkillsUp.`}
              </p>
            </div>

            {module ? (
              <Quiz day={day} module={module} compact method="retrieval-first" />
            ) : (
              <p className="text-muted-foreground text-sm">No module for this day.</p>
            )}
          </div>
        </section>

        {/* Sidebar: lesson plan / resources */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-card rounded-3xl border p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lesson plan</h2>
              <GraduationCap className="text-muted-foreground size-4" />
            </div>

            <ol className="relative space-y-5 border-l pl-4">
              <li className="relative">
                <span className="bg-foreground absolute top-1 -left-[21px] size-2.5 rounded-full" />
                <p className="text-sm font-semibold">Today’s focus</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {day.focus}
                </p>
              </li>

              {udemy && (
                <li className="relative">
                  <span className="bg-muted-foreground/40 absolute top-1 -left-[21px] size-2.5 rounded-full" />
                  <p className="text-sm font-semibold">Udemy companion</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {udemy.sections
                      .filter((s) => s.priority === "watch")
                      .slice(0, 2)
                      .map((s) => s.section)
                      .join(" · ") || "See watch map in full module view"}
                  </p>
                  {udemy.tip && (
                    <p className="text-muted-foreground mt-1 text-xs italic">
                      {udemy.tip}
                    </p>
                  )}
                </li>
              )}

              <li className="relative">
                <span className="bg-muted-foreground/40 absolute top-1 -left-[21px] size-2.5 rounded-full" />
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                  <BookOpen className="size-3.5" />
                  Microsoft Learn
                </p>
                <ul className="space-y-2">
                  {(module?.studyLinks ?? []).map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-muted/60 hover:bg-muted flex items-start justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="mt-0.5 size-3 shrink-0 opacity-60" />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="relative">
                <span className="bg-[#d8f56a] absolute top-1 -left-[21px] size-2.5 rounded-full" />
                <p className="mb-2 text-sm font-semibold">SkillsUp</p>
                <ul className="space-y-2">
                  {skillsUp.map((link) => (
                    <li key={`${link.label}-${link.url}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:bg-muted flex items-start justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
                      >
                        <span>{link.label}</span>
                        <span className="bg-[#d8f56a] text-foreground shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                          Open
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ol>
          </div>

          {module && (
            <div className="bg-card rounded-3xl border p-5 shadow-xs">
              <p className="text-sm font-semibold">Need study panels & labs?</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Full module view keeps Udemy map, lab steps, and study resources
                in one place. Quiz answers sync either way.
              </p>
              <Button className="mt-3 w-full" variant="outline" asChild>
                <a
                  href={withBase(
                    `/AB-650/day/${day.id}/module/${module.id}/`,
                  )}
                >
                  Open full module
                </a>
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
