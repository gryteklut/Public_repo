import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { curriculum, getAllModules, TAG_LABELS } from "@/data/curriculum";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { withBase } from "@/lib/base";
import type { ContentTag } from "@/types";

import { ProgressBar } from "./ProgressBar";
import { TagBadge } from "./TagBadge";

export default function Ab650Home() {
  return (
    <ProgressProvider>
      <HomeInner />
    </ProgressProvider>
  );
}

function HomeInner() {
  const {
    progress,
    completedCount,
    totalCount,
    percentComplete,
    isModuleComplete,
    isModuleReviewDue,
    getModuleProgress,
    updateTagFilter,
    downloadBackup,
    uploadBackup,
  } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const filter = progress.tagFilter ?? "all";

  const resume = progress.lastModuleId
    ? getAllModules().find((x) => x.module.id === progress.lastModuleId)
    : getAllModules().find((x) => !isModuleComplete(x.module.id));

  const dueReviews = getAllModules().filter(({ module }) =>
    isModuleReviewDue(module.id),
  );

  const days = curriculum.map((day) => {
    const modules = day.modules.filter(
      (m) => filter === "all" || m.tags.includes(filter),
    );
    return { day, modules };
  });

  return (
    <div className="space-y-10">
      <header className="bg-card rounded-2xl border p-6 shadow-xs md:p-8">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Exam AB-650
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Administering Microsoft 365 and AI Services
        </h1>
        <p className="text-muted-foreground mt-3 max-w-3xl text-base md:text-lg">
          Ten workdays in the module workspace: Udemy map, study resources,
          Learn/SkillsUp sidebar, and quizzes with successive relearning.
          Unlock completion when every answer is correct.
        </p>
        <ProgressBar
          value={percentComplete}
          label="Course progress"
          detail={`${completedCount} / ${totalCount} modules · ${percentComplete}%`}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {resume && (
            <Button asChild>
              <a
                href={withBase(
                  `/AB-650/day/${resume.day.id}/module/${resume.module.id}/`,
                )}
              >
                Continue: {resume.module.title}
              </a>
            </Button>
          )}
          <Button variant="outline" type="button" onClick={downloadBackup}>
            Export progress
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            Import progress
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadBackup(file);
              e.target.value = "";
            }}
          />
        </div>
      </header>

      {dueReviews.length > 0 && (
        <section className="bg-[#d8f56a]/30 rounded-2xl border border-[#d8f56a] p-5">
          <h2 className="text-lg font-semibold">Spaced relearning due</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pull these modules back to criterion — spaced retrieval beats
            one-time completion for exam retention.
          </p>
          <ul className="mt-4 space-y-2">
            {dueReviews.map(({ day, module }) => (
              <li
                key={module.id}
                className="bg-background/80 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2"
              >
                <span className="text-sm font-medium">
                  Day {day.dayNumber}: {module.title}
                  <span className="text-muted-foreground ml-2 text-xs">
                    session #{(getModuleProgress(module.id)?.relearnCount ?? 0) + 1}
                  </span>
                </span>
                <Button size="sm" asChild>
                  <a
                    href={withBase(
                      `/AB-650/day/${day.id}/module/${module.id}/`,
                    )}
                  >
                    Relearn
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <span className="text-sm font-medium">Filter by tag</span>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filter === "all"}
            onClick={() => updateTagFilter("all")}
            label="All"
          />
          {(Object.keys(TAG_LABELS) as ContentTag[]).map((tag) => (
            <FilterChip
              key={tag}
              active={filter === tag}
              onClick={() => updateTagFilter(tag)}
              label={TAG_LABELS[tag]}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {days.map(({ day, modules }) => {
          if (modules.length === 0) return null;
          const done = modules.every((m) => isModuleComplete(m.id));
          return (
            <article
              key={day.id}
              className={`bg-card rounded-2xl border p-5 shadow-xs ${done ? "border-foreground/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Day {day.dayNumber}
                    {day.isPracticeDay ? " · Practice" : ""}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    <a
                      className="hover:underline"
                      href={withBase(
                        `/AB-650/day/${day.id}/module/${modules[0].id}/`,
                      )}
                    >
                      {day.title}
                    </a>
                  </h2>
                </div>
                <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">
                  ~{day.estimatedMinutes} min
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{day.focus}</p>
              <ul className="mt-4 space-y-3">
                {modules.map((module) => (
                  <li key={module.id}>
                    <a
                      className="hover:bg-muted/60 flex items-start gap-2 rounded-lg p-1.5 transition-colors"
                      href={withBase(
                        `/AB-650/day/${day.id}/module/${module.id}/`,
                      )}
                    >
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                          isModuleComplete(module.id)
                            ? "bg-foreground text-background"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isModuleComplete(module.id) ? "✓" : ""}
                      </span>
                      <span className="text-sm font-medium">{module.title}</span>
                    </a>
                    <div className="mt-1 ml-8 flex flex-wrap gap-1.5">
                      {module.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <aside className="bg-muted/50 rounded-2xl border p-5">
        <h3 className="font-semibold">Out of scope vs classic MS-102</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Do not prioritize hybrid Entra Connect sync troubleshooting or broad
          Defender XDR admin across Endpoint / Identity / Cloud Apps. AB-650
          keeps cloud identity, Defender for Office 365, Purview requirements,
          and a large AI services domain.
        </p>
      </aside>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
