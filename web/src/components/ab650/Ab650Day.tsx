import { findDay } from '../../data/curriculum'
import { getUdemyGuide } from '../../data/udemyMap'
import { withBase } from '../../lib/base'
import { ProgressProvider, useProgress } from '../../hooks/useProgress'
import { ProgressBar } from './ProgressBar'
import { TagBadge } from './TagBadge'
import { UdemyWatch } from './UdemyWatch'

export default function Ab650Day({ dayId }: { dayId: string }) {
  return (
    <ProgressProvider>
      <DayInner dayId={dayId} />
    </ProgressProvider>
  )
}

function DayInner({ dayId }: { dayId: string }) {
  const day = findDay(dayId)
  const { isModuleComplete, allQuestionsCorrect } = useProgress()

  if (!day) {
    return (
      <div className="page">
        <p>Day not found.</p>
        <a href={withBase('/AB-650/')}>Back to AB-650</a>
      </div>
    )
  }

  const completed = day.modules.filter((m) => isModuleComplete(m.id)).length
  const percent = Math.round((completed / day.modules.length) * 100)
  const primaryUdemy = getUdemyGuide(day.modules[0]?.id ?? '')

  return (
    <div className="page">
      <nav className="crumb">
        <a href={withBase('/AB-650/')}>AB-650 home</a>
        <span>/</span>
        <span>Day {day.dayNumber}</span>
      </nav>

      <header className="page-header">
        <p className="day-kicker">
          Day {day.dayNumber}
          {day.isPracticeDay ? ' · Quiz-first practice' : ' · Learn then check'}
        </p>
        <h1>{day.title}</h1>
        <p className="lede">{day.focus}</p>
        <ProgressBar
          value={percent}
          label="Day progress"
          detail={`${completed} / ${day.modules.length} modules`}
        />
      </header>

      {primaryUdemy && <UdemyWatch guide={primaryUdemy} compact />}

      <ul className="module-detail-list">
        {day.modules.map((module) => {
          const unlocked = allQuestionsCorrect(
            module.id,
            module.questions.map((q) => q.id),
          )
          const done = isModuleComplete(module.id)
          return (
            <li key={module.id} className="module-row">
              <div>
                <h2>
                  <a
                    href={withBase(
                      `/AB-650/day/${day.id}/module/${module.id}/`,
                    )}
                  >
                    {module.title}
                  </a>
                </h2>
                <p className="muted">{module.summary}</p>
                <div className="tag-row">
                  {module.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>
              <div className="module-status">
                <span
                  className={`status-pill ${done ? 'done' : unlocked ? 'ready' : 'todo'}`}
                >
                  {done
                    ? 'Complete'
                    : unlocked
                      ? 'Ready to mark done'
                      : 'In progress'}
                </span>
                <a
                  className="btn btn-secondary"
                  href={withBase(
                    `/AB-650/day/${day.id}/module/${module.id}/`,
                  )}
                >
                  Open module
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
