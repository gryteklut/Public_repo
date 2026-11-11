import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UDEMY_COURSE_TITLE,
  UDEMY_COURSE_URL,
  type UdemyPriority,
  type UdemyWatchGuide,
} from "@/data/udemyMap";

const PRIORITY_LABEL: Record<UdemyPriority, string> = {
  watch: "Watch",
  skim: "Skim",
  skip: "Skip",
};

type Props = {
  guide: UdemyWatchGuide;
  compact?: boolean;
};

export function UdemyWatch({ guide, compact = false }: Props) {
  return (
    <section className="bg-card mt-8 rounded-2xl border p-5 shadow-xs md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Udemy companion
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {compact ? "Watch today" : "What to watch on Udemy"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{UDEMY_COURSE_TITLE}</p>
        </div>
        <Button variant="outline" asChild>
          <a href={UDEMY_COURSE_URL} target="_blank" rel="noreferrer">
            Open course player
          </a>
        </Button>
      </div>

      {guide.tip && (
        <p className="bg-muted text-muted-foreground mt-4 rounded-xl p-3 text-sm">
          {guide.tip}
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {guide.sections.map((section) => (
          <li
            key={`${section.priority}-${section.section}`}
            className="rounded-xl border p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  section.priority === "watch"
                    ? "default"
                    : section.priority === "skim"
                      ? "secondary"
                      : "outline"
                }
              >
                {PRIORITY_LABEL[section.priority]}
              </Badge>
              <strong className="text-sm">{section.section}</strong>
            </div>
            {section.note && (
              <p className="text-muted-foreground mt-2 text-sm">{section.note}</p>
            )}
            {!compact && section.lectures && section.lectures.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">
                  Highlighted lectures ({section.lectures.length})
                </summary>
                <ol className="text-muted-foreground mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {section.lectures.map((lecture) => (
                    <li key={lecture}>{lecture}</li>
                  ))}
                </ol>
              </details>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
