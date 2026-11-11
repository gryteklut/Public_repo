/**
 * Prominent Microsoft Learn training block for a day.
 * Always lists course/path/module links first so they are hard to miss.
 */
export type TrainingLink = {
  label: string;
  url: string;
  kind?: string;
};

export function MicrosoftTraining({
  links,
}: {
  links: TrainingLink[];
}) {
  const courses = links.filter((l) => l.kind === "course");
  const docs = links.filter((l) => l.kind !== "course" && l.kind !== "skillsup");

  if (courses.length === 0 && docs.length === 0) return null;

  return (
    <section className="course-card border-[color:var(--course-highlight)] p-5 shadow-xs md:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Microsoft Learn</h2>
      {courses.length > 0 && (
        <ul className="mt-4 space-y-2">
          {courses.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-muted flex items-start justify-between gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-colors"
              >
                <span className="min-w-0 leading-relaxed">{link.label}</span>
                <span className="course-pill shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                  Open
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {docs.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Docs & references</h3>
          <ul className="mt-2 space-y-1.5">
            {docs.map((link) => (
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
        </div>
      )}
    </section>
  );
}
