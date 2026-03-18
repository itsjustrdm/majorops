import { Routes, Route } from 'react-router-dom'
import StatusPage from './pages/StatusPage'
import IncidentPublic from './pages/IncidentPublic'
import IncidentAdmin from './pages/IncidentAdmin'
import NewIncident from './pages/NewIncident'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Stakeholder from './pages/Stakeholder'
import Executive from './pages/Executive'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StatusPage />} />
      <Route path="/incidents/:id" element={<IncidentPublic />} />
      <Route path="/stakeholders/:id" element={<Stakeholder />} />
      <Route path="/executives/:id" element={<Executive />} />
      <Route path="/admin/incidents/:id" element={<IncidentAdmin />} />
      <Route path="/new" element={<NewIncident />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<StatusPage />} />
    </Routes>
  )
}
