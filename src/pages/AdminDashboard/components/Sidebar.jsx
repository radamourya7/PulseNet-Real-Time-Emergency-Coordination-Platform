import { LayoutDashboard, Map, Bell, BarChart2, Radio, FileText, Camera, Navigation, LogOut, Shield } from 'lucide-react'

const MENU_ITEMS = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'broadcasts', label: 'Broadcasts', icon: Radio },
    { id: 'incidents', label: 'Incident Logs', icon: FileText },
    { id: 'evidence', label: 'Media Evidence', icon: Camera },
    { id: 'tracking', label: 'User Tracking', icon: Navigation },
]

export default function Sidebar({ active, setActive }) {
    return (
        <aside className="adm-sidebar">
            <div className="logo" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="logo-icon"><Shield size={16} color="white" /></div>
                <div className="logo-text">PulseNet <span className="text-xs font-normal">Admin</span></div>
            </div>

            <nav className="flex-1 mt-16">
                <div className="nav-label">Main Console</div>
                {MENU_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`adm-nav-item ${active === item.id ? 'active' : ''}`}
                        style={{ width: 'calc(100% - 16px)', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex' }}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="nav-footer">
                <button className="adm-nav-item text-red" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}>
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
