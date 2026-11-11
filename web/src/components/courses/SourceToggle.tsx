import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  SOURCES_EVENT,
  applySourceVisibility,
  getDaySources,
  loadCourseProgress,
  saveCourseProgress,
  setDaySources,
  type DaySources,
} from "@/lib/courseProgress";

export function SourceToggle({ code, day }: { code: string; day: number }) {
  const dayKey = String(day);
  const [sources, setSources] = useState<DaySources>(() =>
    getDaySources(loadCourseProgress(code), dayKey),
  );

  useEffect(() => {
    applySourceVisibility(sources);
    window.dispatchEvent(
      new CustomEvent(SOURCES_EVENT, { detail: { day, sources } }),
    );
  }, [sources, day]);

  const update = (patch: Partial<DaySources>) => {
    const progress = loadCourseProgress(code);
    const current = getDaySources(progress, dayKey);
    const next = { ...current, ...patch };
    if (!next.microsoft && !next.udemy) return; // keep at least one
    saveCourseProgress(setDaySources(progress, dayKey, next));
    setSources(next);
  };

  return (
    <div className="course-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold">Sources</p>
      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            id={`src-ms-${day}`}
            checked={sources.microsoft}
            onCheckedChange={(v) => update({ microsoft: v === true })}
          />
          <Label htmlFor={`src-ms-${day}`} className="cursor-pointer">
            Microsoft Learn
          </Label>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            id={`src-udemy-${day}`}
            checked={sources.udemy}
            onCheckedChange={(v) => update({ udemy: v === true })}
          />
          <Label htmlFor={`src-udemy-${day}`} className="cursor-pointer">
            Udemy
          </Label>
        </label>
      </div>
    </div>
  );
}
