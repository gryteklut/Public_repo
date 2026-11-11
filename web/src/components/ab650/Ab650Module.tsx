import { useEffect } from "react";
import { BookOpen, ExternalLink, GraduationCap } from "lucide-react";

import { findModule } from "@/data/curriculum";
import { getSkillsUpLinks } from "@/data/skillsUpMap";
import { getUdemyGuide } from "@/data/udemyMap";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { withBase } from "@/lib/base";

import { ProgressBar } from "./ProgressBar";
import { Quiz } from "./Quiz";
import { TagBadge } from "./TagBadge";
import { UdemyWatch } from "./UdemyWatch";

export default function Ab650Module({
  dayId,
  moduleId,
}: {
  dayId: string;
  moduleId: string;
}) {
  return (
    <ProgressProvider>
      <ModuleInner dayId={dayId} moduleId={moduleId} />
    </ProgressProvider>
  );
}

function ModuleInner({
  dayId,
  moduleId,
}: {
  dayId: string;
  moduleId: string;
}) {
  const found = findModule(moduleId);
  const { setLastModule, isModuleComplete, allQuestionsCorrect } =
    useProgress();

  useEffect(() => {
    if (moduleId) setLastModule(moduleId);
  }, [moduleId, setLastModule]);

  if (!found || found.day.id !== dayId) {
    return (
      <div className="space-y-3">
        <p>Module not found.</p>
        <a className="underline" href={withBase("/AB-650/")}>
          Back to AB-650
        </a>
      </div>
    );
  }

  const { day, module } = found;
  const udemy = getUdemyGuide(module.id);
  const skillsUp = getSkillsUpLinks(module.id);
  const done = isModuleComplete(module.id);
  const unlocked = allQuestionsCorrect(
    module.id,
    module.questions.map((q) => q.id),
  );

  const dayModulesDone = day.modules.filter((m) =>
    isModuleComplete(m.id),
  ).length;
  const dayPercent = Math.round(
    (dayModulesDone / Math.max(day.modules.length, 1)) * 100,
  );

  return (
    <div className="space-y-6">
      <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <a className="hover:text-foreground" href={withBase("/AB-650/")}>
          AB-650 home
        </a>
        <span>/</span>
        <span>Day {day.dayNumber}</span>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </nav>

      <header className="bg-card rounded-2xl border p-5 shadow-xs md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Day {day.dayNumber}
              {day.isPracticeDay ? " · Practice mode" : " · Learning mode"}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {module.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl text-sm md:text-base">
              {module.summary}
            </p>
          </div>
          <span className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
            {done ? "Complete" : unlocked ? "Ready to mark done" : "In progress"}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {module.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <ProgressBar
          value={dayPercent}
          label="Day progress"
          detail={`${dayModulesDone} / ${day.modules.length} modules`}
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {udemy && <UdemyWatch moduleId={module.id} guide={udemy} />}

          <section className="bg-card rounded-2xl border p-5 shadow-xs md:p-6">
            <h2 className="text-xl font-semibold">Study resources</h2>
            <ul className="mt-3 space-y-2">
              {module.studyLinks.map((link) => (
                <li key={link.url}>
                  <a
                    className="text-sm font-medium underline-offset-4 hover:underline"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {module.labSteps && module.labSteps.length > 0 && (
              <>
                <h3 className="mt-6 font-semibold">Optional E5 lab</h3>
                <ol className="text-muted-foreground mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {module.labSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </>
            )}
            {module.outOfScopeNote && (
              <p className="bg-muted text-muted-foreground mt-4 rounded-xl p-3 text-sm">
                <strong className="text-foreground">Out of scope note:</strong>{" "}
                {module.outOfScopeNote}
              </p>
            )}
          </section>

          <section className="bg-card overflow-hidden rounded-3xl border shadow-xs">
            <div className="border-b px-4 py-3 md:px-5">
              <span className="bg-[#d8f56a] text-foreground inline-flex rounded-full px-3 py-1.5 text-sm font-semibold">
                Quiz
              </span>
            </div>
            <div className="p-4 md:p-6">
              <Quiz
                day={day}
                module={module}
                method={day.isPracticeDay ? "retrieval-first" : "learn-first"}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-card rounded-3xl border p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lesson plan</h2>
              <GraduationCap className="text-muted-foreground size-4" />
            </div>

            <ol className="relative space-y-5 border-l pl-4">
              <li className="relative">
                <span className="bg-foreground absolute top-1 -left-[21px] size-2.5 rounded-full" />
                <p className="text-sm font-semibold">Day focus</p>
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
                      .join(" · ") || "See watch map above"}
                  </p>
                </li>
              )}

              <li className="relative">
                <span className="bg-muted-foreground/40 absolute top-1 -left-[21px] size-2.5 rounded-full" />
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                  <BookOpen className="size-3.5" />
                  Microsoft Learn
                </p>
                <ul className="space-y-2">
                  {module.studyLinks.map((link) => (
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
        </aside>
      </div>
    </div>
  );
}
