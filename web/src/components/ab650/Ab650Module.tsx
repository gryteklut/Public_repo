import { useEffect } from 'react'
import { findModule } from '../../data/curriculum'
import { getUdemyGuide } from '../../data/udemyMap'
import { withBase } from '../../lib/base'
import { ProgressProvider, useProgress } from '../../hooks/useProgress'
import { TagBadge } from './TagBadge'
import { UdemyWatch } from './UdemyWatch'
import { Quiz } from './Quiz'

export default function Ab650Module({
  dayId,
  moduleId,
}: {
  dayId: string
  moduleId: string
}) {
  return (
    <ProgressProvider>
      <ModuleInner dayId={dayId} moduleId={moduleId} />
    </ProgressProvider>
  )
}

function ModuleInner({
  dayId,
  moduleId,
}: {
  dayId: string
  moduleId: string
}) {
  const found = findModule(moduleId)
  const { setLastModule } = useProgress()

  useEffect(() => {
    if (moduleId) setLastModule(moduleId)
  }, [moduleId, setLastModule])

  if (!found || found.day.id !== dayId) {
    return (
      <div className="page">
        <p>Module not found.</p>
        <a href={withBase('/AB-650/')}>Back to AB-650</a>
      </div>
    )
  }

  const { day, module } = found
  const udemy = getUdemyGuide(module.id)

  return (
    <div className="page module-page">
      <nav className="crumb">
        <a href={withBase('/AB-650/')}>AB-650 home</a>
        <span>/</span>
        <a href={withBase(`/AB-650/day/${day.id}/`)}>Day {day.dayNumber}</a>
        <span>/</span>
        <span>{module.title}</span>
      </nav>

      <header className="page-header">
        <p className="day-kicker">
          Day {day.dayNumber}
          {day.isPracticeDay ? ' · Practice mode' : ' · Learning mode'}
        </p>
        <h1>{module.title}</h1>
        <p className="lede">{module.summary}</p>
        <div className="tag-row">
          {module.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </header>

      {udemy && <UdemyWatch guide={udemy} />}

      <section className="study-resources">
        <h2>Study resources</h2>
        <ul className="link-list">
          {module.studyLinks.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {module.labSteps && module.labSteps.length > 0 && (
          <>
            <h3>Optional E5 lab</h3>
            <ol className="lab-list">
              {module.labSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </>
        )}
        {module.outOfScopeNote && (
          <p className="out-of-scope">
            <strong>Out of scope note:</strong> {module.outOfScopeNote}
          </p>
        )}
      </section>

      <Quiz day={day} module={module} />
    </div>
  )
}
