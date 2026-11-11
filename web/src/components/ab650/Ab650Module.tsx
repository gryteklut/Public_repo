import { useEffect } from "react";

import { findModule } from "@/data/curriculum";
import { getUdemyGuide } from "@/data/udemyMap";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { withBase } from "@/lib/base";

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
  const { setLastModule } = useProgress();

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

  return (
    <div className="space-y-8">
      <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <a className="hover:text-foreground" href={withBase("/AB-650/")}>
          AB-650 home
        </a>
        <span>/</span>
        <a
          className="hover:text-foreground"
          href={withBase(`/AB-650/day/${day.id}/`)}
        >
          Day {day.dayNumber}
        </a>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </nav>

      <header className="bg-card rounded-2xl border p-6 shadow-xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Day {day.dayNumber}
          {day.isPracticeDay ? " · Practice mode" : " · Learning mode"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {module.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">{module.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {module.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </header>

      {udemy && <UdemyWatch guide={udemy} />}

      <section className="bg-card rounded-2xl border p-6 shadow-xs">
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

      <Quiz day={day} module={module} />
    </div>
  );
}
