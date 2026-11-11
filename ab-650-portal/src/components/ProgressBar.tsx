type Props = {
  value: number
  label?: string
  detail?: string
}

export function ProgressBar({ value, label, detail }: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="progress-block" aria-label={label ?? 'Progress'}>
      <div className="progress-meta">
        <span className="progress-label">{label ?? 'Overall progress'}</span>
        <span className="progress-detail">
          {detail ?? `${clamped}%`}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
