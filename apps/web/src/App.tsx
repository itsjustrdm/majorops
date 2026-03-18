import { Routes, Route } from 'react-router-dom'
import StatusPage from './pages/StatusPage'
import IncidentPublic from './pages/IncidentPublic'
import IncidentAdmin from './pages/IncidentAdmin'
import NewIncident from './pages/NewIncident'
import Analytics from './pages/Analytics'
import MIMViewTerminal from './pages/MIMViewTerminal'
import MIMViewFocus from './pages/MIMViewFocus'
import Login from './pages/Login'
import Stakeholder from './pages/Stakeholder'
import Executive from './pages/Executive'
import SearchIncidents from './pages/SearchIncidents'
import GlobalCADBar from './components/GlobalCADBar'

export default function App() {
  return (
    <>
      {/* Page content — pb-8 keeps content clear of the fixed CAD bar */}
      <div className="pb-8">
        <Routes>
          <Route path="/" element={<StatusPage />} />
          <Route path="/incidents/:id" element={<IncidentPublic />} />
          <Route path="/stakeholders/:id" element={<Stakeholder />} />
          <Route path="/executives/:id" element={<Executive />} />
          {/* MIM admin views */}
          <Route path="/admin/incidents/:id" element={<IncidentAdmin />} />
          <Route path="/admin/incidents/:id/terminal" element={<MIMViewTerminal />} />
          <Route path="/admin/incidents/:id/focus" element={<MIMViewFocus />} />
          {/* Other routes */}
          <Route path="/search" element={<SearchIncidents />} />
          <Route path="/new" element={<NewIncident />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<StatusPage />} />
        </Routes>
      </div>

      {/* Global CAD bar — always visible, context-aware, press ` to focus */}
      <GlobalCADBar />
    </>
  )
}
