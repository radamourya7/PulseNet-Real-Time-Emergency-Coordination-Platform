import { NavLink } from 'react-router-dom'
import { Radio, LayoutDashboard, Map, Calendar, Settings, LogOut, Shield } from 'lucide-react'
import { getTokenPayload, logout } from '../api'

export default function Sidebar() {
    const user = getTokenPayload()
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'

    const roleBadge = user?.role === 'superadmin' ? 'SUPER' : user?.role === 'admin' ? 'ADMIN' : 'USER'
    const badgeClass = user?.role === 'superadmin' ? 'badge-amber' : user?.role === 'admin' ? 'badge-blue' : 'badge-green'

    // Admin-only nav item — only rendered for admin/superadmin
    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ...(isAdmin ? [{ to: '/admin', icon: Map, label: 'Command Center' }] : []),
        ...(isAdmin ? [{ to: '/admin-dashboard', icon: Shield, label: 'Admin Dashboard' }] : []),
        { to: '/events', icon: Calendar, label: 'Events' },
        { to: '/about', icon: Radio, label: 'About PulseNet' },
    ]

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="logo">
                <div className="logo-icon"><Radio size={16} color="white" /></div>
                <div>
                    <div className="logo-text">PulseNet</div>
                    <div className="logo-sub">Emergency OS</div>
                </div>
            </div>

            {/* Live Status Bar */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', background: 'var(--accent-red-dim)' }}>
                <div className="flex items-center gap-8">
                    <div className="status-dot live" />
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-red)', fontWeight: 700 }}>LIVE MONITORING ACTIVE</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="nav-section">
                <div className="nav-label">Navigation</div>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Icon size={16} />
                        {label}
                    </NavLink>
                ))}

                <div className="nav-label" style={{ marginTop: 16 }}>System</div>
                <NavLink to="/" className="nav-item">
                    <Settings size={16} />
                    Settings
                </NavLink>
            </nav>

            {/* User Footer — real user from token */}
            <div className="nav-footer">
                <div className="flex items-center gap-8 mb-12">
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    }}>{initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'User'}
                        </div>
                        <span className={`badge ${badgeClass}`} style={{ padding: '1px 6px', fontSize: '0.6rem' }}>
                            <Shield size={9} /> {roleBadge}
                        </span>
                    </div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={logout}>
                    <LogOut size={14} /> Sign Out
                </button>
            </div>
        </aside>
    )
}
