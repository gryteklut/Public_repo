import { useRef } from 'react'
import { curriculum, getAllModules, TAG_LABELS } from '../../data/curriculum'
import type { ContentTag } from '../../types'
import { withBase } from '../../lib/base'
import { ProgressProvider, useProgress } from '../../hooks/useProgress'
import { ProgressBar } from './ProgressBar'
import { TagBadge } from './TagBadge'

export default function Ab650Home() {
  return (
    <ProgressProvider>
      <HomeInner />
    </ProgressProvider>
  )
}

function HomeInner() {
  const {
    progress,
    completedCount,
    totalCount,
    percentComplete,
    isModuleComplete,
    updateTagFilter,
    downloadBackup,
    uploadBackup,
  } = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const filter = progress.tagFilter ?? 'all'

  const resume = progress.lastModuleId
    ? getAllModules().find((x) => x.module.id === progress.lastModuleId)
    : getAllModules().find((x) => !isModuleComplete(x.module.id))

  const days = curriculum.map((day) => {
    const modules = day.modules.filter(
      (m) => filter === 'all' || m.tags.includes(filter),
    )
    return { day, modules }
  })

  return (
    <div className="page home">
      <header className="hero-panel">
        <p className="eyebrow">Exam AB-650</p>
        <h1>Administering Microsoft 365 and AI Services</h1>
        <p className="lede">
          Ten focused workdays. Each module highlights which Udemy section to
          watch, then expandable study text before control questions. Unlock
          completion when every answer is correct. Day 10 is quiz-first
          practice.
        </p>
        <ProgressBar
          value={percentComplete}
          label="Course progress"
          detail={`${completedCount} / ${totalCount} modules · ${percentComplete}%`}
        />
        <div className="hero-actions">
          {resume && (
            <a
              className="btn btn-primary"
              href={withBase(
                `/AB-650/day/${resume.day.id}/module/${resume.module.id}/`,
              )}
            >
              Continue: {resume.module.title}
            </a>
          )}
          <button type="button" className="btn btn-secondary" onClick={downloadBackup}>
            Export progress
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fileRef.current?.click()}
          >
            Import progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadBackup(file)
              e.target.value = ''
            }}
          />
        </div>
      </header>

      <section className="filter-bar">
        <span className="filter-label">Filter by tag</span>
        <div className="filter-chips">
          <FilterChip
            active={filter === 'all'}
            onClick={() => updateTagFilter('all')}
            label="All"
          />
          {(Object.keys(TAG_LABELS) as ContentTag[]).map((tag) => (
            <FilterChip
              key={tag}
              active={filter === tag}
              onClick={() => updateTagFilter(tag)}
              label={TAG_LABELS[tag]}
            />
          ))}
        </div>
      </section>

      <section className="day-grid">
        {days.map(({ day, modules }) => {
          if (modules.length === 0) return null
          const done = modules.every((m) => isModuleComplete(m.id))
          return (
            <article key={day.id} className={`day-card ${done ? 'done' : ''}`}>
              <div className="day-card-top">
                <div>
                  <p className="day-kicker">
                    Day {day.dayNumber}
                    {day.isPracticeDay ? ' · Practice' : ''}
                  </p>
                  <h2>
                    <a href={withBase(`/AB-650/day/${day.id}/`)}>{day.title}</a>
                  </h2>
                </div>
                <span className="time-pill">~{day.estimatedMinutes} min</span>
              </div>
              <p className="muted">{day.focus}</p>
              <ul className="module-mini-list">
                {modules.map((module) => (
                  <li key={module.id}>
                    <a
                      href={withBase(
                        `/AB-650/day/${day.id}/module/${module.id}/`,
                      )}
                    >
                      <span
                        className="check-dot"
                        data-done={isModuleComplete(module.id)}
                      >
                        {isModuleComplete(module.id) ? '✓' : ''}
                      </span>
                      <span className="module-mini-title">{module.title}</span>
                    </a>
                    <div className="tag-row">
                      {module.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </section>

      <aside className="scope-note">
        <h3>Out of scope vs classic MS-102</h3>
        <p>
          Do not prioritize hybrid Entra Connect sync troubleshooting or broad
          Defender XDR admin across Endpoint / Identity / Cloud Apps. AB-650
          keeps cloud identity, Defender for Office 365, Purview requirements,
          and a large AI services domain.
        </p>
      </aside>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`chip ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
