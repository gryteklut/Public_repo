import { Link, useParams } from 'react-router-dom'
import { findDay } from '../data/curriculum'
import { getUdemyGuide } from '../data/udemyMap'
import { TagBadge } from '../components/TagBadge'
import { UdemyWatch } from '../components/UdemyWatch'
import { useProgress } from '../hooks/useProgress'
import { ProgressBar } from '../components/ProgressBar'

export function DayPage() {
  const { dayId } = useParams()
  const day = findDay(dayId ?? '')
  const { isModuleComplete, allQuestionsCorrect } = useProgress()

  if (!day) {
    return (
      <div className="page">
        <p>Day not found.</p>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  const completed = day.modules.filter((m) => isModuleComplete(m.id)).length
  const percent = Math.round((completed / day.modules.length) * 100)
  const primaryUdemy = getUdemyGuide(day.modules[0]?.id ?? '')

  return (
    <div className="page">
      <nav className="crumb">
        <Link to="/">Course home</Link>
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
                  <Link to={`/day/${day.id}/module/${module.id}`}>
                    {module.title}
                  </Link>
                </h2>
                <p className="muted">{module.summary}</p>
                <div className="tag-row">
                  {module.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>
              <div className="module-status">
                <span className={`status-pill ${done ? 'done' : unlocked ? 'ready' : 'todo'}`}>
                  {done ? 'Complete' : unlocked ? 'Ready to mark done' : 'In progress'}
                </span>
                <Link className="btn btn-secondary" to={`/day/${day.id}/module/${module.id}`}>
                  Open module
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
