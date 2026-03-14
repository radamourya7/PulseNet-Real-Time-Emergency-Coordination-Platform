import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Calendar, LogOut, ShieldCheck, Radio } from 'lucide-react'
import { getTokenPayload, logout } from '../api'

export default function BottomNav() {
    const user = getTokenPayload()
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
    const isSuperAdmin = user?.role === 'superadmin'

    return (
        <nav className="bottom-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
            </NavLink>

            <NavLink to="/events" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Calendar size={20} />
                <span>Events</span>
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <Radio size={20} />
                <span>About</span>
            </NavLink>

            {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <Map size={20} />
                    <span>Command</span>
                </NavLink>
            )}

            {isSuperAdmin && (
                <NavLink to="/superadmin" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <ShieldCheck size={20} />
                    <span>Users</span>
                </NavLink>
            )}

            <button className="bottom-nav-item" onClick={logout}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </nav>
    )
}
