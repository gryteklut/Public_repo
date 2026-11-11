import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { findModule } from '../data/curriculum'
import { getUdemyGuide } from '../data/udemyMap'
import { TagBadge } from '../components/TagBadge'
import { Quiz } from '../components/Quiz'
import { UdemyWatch } from '../components/UdemyWatch'
import { useProgress } from '../hooks/useProgress'

export function ModulePage() {
  const { dayId, moduleId } = useParams()
  const found = findModule(moduleId ?? '')
  const { setLastModule } = useProgress()

  useEffect(() => {
    if (moduleId) setLastModule(moduleId)
  }, [moduleId, setLastModule])

  if (!found || found.day.id !== dayId) {
    return (
      <div className="page">
        <p>Module not found.</p>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  const { day, module } = found
  const udemy = getUdemyGuide(module.id)

  return (
    <div className="page module-page">
      <nav className="crumb">
        <Link to="/">Course home</Link>
        <span>/</span>
        <Link to={`/day/${day.id}`}>Day {day.dayNumber}</Link>
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
