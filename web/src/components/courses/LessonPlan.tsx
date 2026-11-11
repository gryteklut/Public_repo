import { BookOpen, ExternalLink, GraduationCap } from "lucide-react";

type Resource = { label: string; url: string; kind?: string };

export function LessonPlan({
  focus,
  videoLabels,
  resources,
}: {
  focus: string;
  videoLabels: string[];
  resources: Resource[];
}) {
  const learn = resources.filter((r) => r.kind !== "skillsup");
  const skills = resources.filter((r) => r.kind === "skillsup");

  return (
    <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
      <div className="course-card p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lesson plan</h2>
          <GraduationCap className="text-muted-foreground size-4" />
        </div>
        <ol className="relative space-y-5 border-l pl-4">
          <li className="relative">
            <span className="bg-foreground absolute top-1 -left-[21px] size-2.5 rounded-full" />
            <p className="text-sm font-semibold">Day focus</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {focus}
            </p>
          </li>
          {videoLabels.length > 0 && (
            <li className="relative">
              <span className="bg-muted-foreground/40 absolute top-1 -left-[21px] size-2.5 rounded-full" />
              <p className="text-sm font-semibold">Udemy companion</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {videoLabels.slice(0, 2).join(" · ")}
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
              {learn.map((link) => (
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
          {skills.length > 0 && (
            <li className="relative">
              <span className="course-pill absolute top-1 -left-[21px] size-2.5 rounded-full" />
              <p className="mb-2 text-sm font-semibold">SkillsUp</p>
              <ul className="space-y-2">
                {skills.map((link) => (
                  <li key={`${link.label}-${link.url}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:bg-muted flex items-start justify-between gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
                    >
                      <span>{link.label}</span>
                      <span className="course-pill shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                        Open
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ol>
      </div>
    </aside>
  );
}
