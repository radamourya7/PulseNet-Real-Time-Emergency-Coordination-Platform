import { LayoutDashboard, Map, Bell, BarChart2, Radio, FileText, Camera, Navigation, LogOut, Shield, Zap } from 'lucide-react'

const MENU_ITEMS = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'broadcasts', label: 'Broadcasts', icon: Radio },
    { id: 'incidents', label: 'Incidents', icon: FileText },
    { id: 'evidence', label: 'Evidence', icon: Camera },
    { id: 'tracking', label: 'Live Tracking', icon: Navigation },
]

export default function Sidebar({ active, setActive }) {
    return (
        <aside className="sidebar select-none">
            <div className="logo flex items-center gap-12 p-24 border-b border-border mb-8">
                <div className="logo-icon">
                    <Shield size={18} color="white" />
                </div>
                <div className="flex flex-col">
                    <span className="logo-text">PULSE<span className="text-red">NET</span></span>
                    <span className="logo-sub">ADMIN PANEL</span>
                </div>
            </div>

            <nav className="nav-section px-12 py-16 flex-1 flex flex-col gap-4">
                <div className="nav-label mb-8 px-12 flex items-center justify-between">
                    <span>OPS MODULES</span>
                    <div className="flex gap-4">
                        <div className="w-4 h-4 rounded-full bg-green anim-pulse" />
                    </div>
                </div>

                {MENU_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`nav-item ${active === item.id ? 'active' : ''}`}
                    >
                        <item.icon size={18} />
                        <span className="font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="nav-footer p-12 border-t border-border">
                <button className="nav-item text-red w-full justify-start hover:bg-red-dim" onClick={() => window.location.href = '/login'}>
                    <LogOut size={18} />
                    <span className="font-bold">Logout</span>
                </button>
            </div>
        </aside>
    )
}
