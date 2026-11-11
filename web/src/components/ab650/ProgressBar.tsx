import { Progress } from "@/components/ui/progress";

type Props = {
  value: number;
  label?: string;
  detail?: string;
};

export function ProgressBar({ value, label, detail }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-6 space-y-2" aria-label={label ?? "Progress"}>
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{label ?? "Overall progress"}</span>
        <span>{detail ?? `${clamped}%`}</span>
      </div>
      <Progress value={clamped} className="h-2" />
    </div>
  );
}
