import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboard from './pages/UserDashboard'
import AdminCommandCenter from './pages/AdminCommandCenter'
import EventManagement from './pages/EventManagement'
import SuperAdminPanel from './pages/SuperAdminPanel'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import { isLoggedIn, getTokenPayload } from './api'
import './index.css'

function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}

function ProtectedRoute({ children, adminOnly = false, superAdminOnly = false }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  const payload = getTokenPayload()
  const role = payload?.role

  if (superAdminOnly && role !== 'superadmin')
    return <Navigate to="/dashboard" replace />

  if (adminOnly && role !== 'admin' && role !== 'superadmin')
    return <Navigate to="/dashboard" replace />

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout><UserDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/events" element={
        <ProtectedRoute>
          <DashboardLayout><EventManagement /></DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminCommandCenter />
        </ProtectedRoute>
      } />

      <Route path="/superadmin" element={
        <ProtectedRoute superAdminOnly>
          <DashboardLayout><SuperAdminPanel /></DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
