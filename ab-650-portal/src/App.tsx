import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from './hooks/useProgress'
import { Home } from './pages/Home'
import { DayPage } from './pages/DayPage'
import { ModulePage } from './pages/ModulePage'

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <div className="app-shell">
          <div className="topbar">
            <a className="brand" href="#/">
              AB-650 Study Portal
            </a>
            <span className="topbar-note">Learn → check → unlock</span>
          </div>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/day/:dayId" element={<DayPage />} />
              <Route
                path="/day/:dayId/module/:moduleId"
                element={<ModulePage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </ProgressProvider>
  )
}
