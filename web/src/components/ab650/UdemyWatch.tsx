import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  UDEMY_COURSE_TITLE,
  UDEMY_COURSE_URL,
  type UdemyPriority,
  type UdemyWatchGuide,
} from "@/data/udemyMap";
import { useProgress } from "@/hooks/useProgress";

const PRIORITY_LABEL: Record<UdemyPriority, string> = {
  watch: "Watch",
  skim: "Skim",
  skip: "Skip",
};

type Props = {
  moduleId: string;
  guide: UdemyWatchGuide;
};

export function UdemyWatch({ moduleId, guide }: Props) {
  const { isLectureWatched, setWatched } = useProgress();

  const watchSections = guide.sections.filter((s) => s.priority === "watch");
  const otherSections = guide.sections.filter((s) => s.priority !== "watch");

  const allWatchLectures = watchSections.flatMap((s) => s.lectures ?? []);
  const watchedCount = allWatchLectures.filter((l) =>
    isLectureWatched(moduleId, l),
  ).length;

  return (
    <section className="bg-card rounded-2xl border p-5 shadow-xs md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Day steps · Udemy
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Watch checklist
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{UDEMY_COURSE_TITLE}</p>
          {allWatchLectures.length > 0 && (
            <p className="text-muted-foreground mt-2 text-xs">
              {watchedCount} / {allWatchLectures.length} watched
            </p>
          )}
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

      <div className="mt-5 space-y-5">
        {watchSections.map((section) => (
          <div
            key={`watch-${section.section}`}
            className="rounded-2xl border p-4"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="bg-[#d8f56a] text-foreground rounded-full px-2.5 py-1 text-xs font-semibold">
                {PRIORITY_LABEL[section.priority]}
              </span>
              <strong className="text-sm">{section.section}</strong>
            </div>
            {section.note && (
              <p className="text-muted-foreground mb-3 text-sm">{section.note}</p>
            )}
            {(section.lectures?.length ?? 0) > 0 ? (
              <ul className="space-y-2">
                {section.lectures!.map((lecture) => {
                  const id = `watch-${moduleId}-${lecture}`;
                  const checked = isLectureWatched(moduleId, lecture);
                  return (
                    <li key={lecture}>
                      <label
                        htmlFor={id}
                        className={`hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                          checked ? "border-foreground/25 bg-muted/30" : ""
                        }`}
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          className="mt-0.5"
                          onCheckedChange={(value) =>
                            setWatched(moduleId, lecture, value === true)
                          }
                        />
                        <span className="min-w-0 flex-1 leading-relaxed">
                          <span className="text-muted-foreground mr-2 text-xs font-semibold tracking-wide uppercase">
                            Watch
                          </span>
                          <Label
                            htmlFor={id}
                            className={`cursor-pointer font-normal ${checked ? "text-muted-foreground line-through" : ""}`}
                          >
                            {lecture}
                          </Label>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <label className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm">
                <Checkbox
                  checked={isLectureWatched(moduleId, section.section)}
                  className="mt-0.5"
                  onCheckedChange={(value) =>
                    setWatched(moduleId, section.section, value === true)
                  }
                />
                <span>
                  <span className="text-muted-foreground mr-2 text-xs font-semibold tracking-wide uppercase">
                    Watch
                  </span>
                  {section.section}
                </span>
              </label>
            )}
          </div>
        ))}

        {otherSections.length > 0 && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Skim / skip
            </p>
            {otherSections.map((section) => (
              <div
                key={`${section.priority}-${section.section}`}
                className="text-muted-foreground rounded-xl border border-dashed p-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border px-2 py-0.5 text-xs font-medium">
                    {PRIORITY_LABEL[section.priority]}
                  </span>
                  <strong className="text-foreground text-sm">
                    {section.section}
                  </strong>
                </div>
                {section.note && <p className="mt-1 text-xs">{section.note}</p>}
                {section.lectures && section.lectures.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {section.lectures.map((lecture) => {
                      const id = `watch-${moduleId}-${lecture}`;
                      const checked = isLectureWatched(moduleId, lecture);
                      return (
                        <li key={lecture}>
                          <label
                            htmlFor={id}
                            className="hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5"
                          >
                            <Checkbox
                              id={id}
                              checked={checked}
                              className="mt-0.5"
                              onCheckedChange={(value) =>
                                setWatched(moduleId, lecture, value === true)
                              }
                            />
                            <span className="leading-relaxed">
                              <span className="mr-2 text-xs font-semibold tracking-wide uppercase">
                                Watch
                              </span>
                              {lecture}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
