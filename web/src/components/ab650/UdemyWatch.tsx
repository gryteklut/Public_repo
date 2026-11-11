import {
  UDEMY_COURSE_TITLE,
  UDEMY_COURSE_URL,
  type UdemyPriority,
  type UdemyWatchGuide,
} from '../../data/udemyMap'

const PRIORITY_LABEL: Record<UdemyPriority, string> = {
  watch: 'Watch',
  skim: 'Skim',
  skip: 'Skip',
}

type Props = {
  guide: UdemyWatchGuide
  compact?: boolean
}

export function UdemyWatch({ guide, compact = false }: Props) {
  return (
    <section className={`udemy-watch ${compact ? 'compact' : ''}`}>
      <div className="udemy-watch-head">
        <div>
          <p className="day-kicker">Udemy companion</p>
          <h2>{compact ? 'Watch today' : 'What to watch on Udemy'}</h2>
          <p className="muted udemy-course-name">{UDEMY_COURSE_TITLE}</p>
        </div>
        <a
          className="btn btn-secondary"
          href={UDEMY_COURSE_URL}
          target="_blank"
          rel="noreferrer"
        >
          Open course player
        </a>
      </div>

      {guide.tip && <p className="udemy-tip">{guide.tip}</p>}

      <ul className="udemy-section-list">
        {guide.sections.map((section) => (
          <li
            key={`${section.priority}-${section.section}`}
            className={`udemy-section priority-${section.priority}`}
          >
            <div className="udemy-section-top">
              <span className={`priority-pill ${section.priority}`}>
                {PRIORITY_LABEL[section.priority]}
              </span>
              <strong className="udemy-section-name">{section.section}</strong>
            </div>
            {section.note && <p className="udemy-note">{section.note}</p>}
            {!compact && section.lectures && section.lectures.length > 0 && (
              <details className="udemy-lectures">
                <summary>
                  Highlighted lectures ({section.lectures.length})
                </summary>
                <ol>
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
  )
}
