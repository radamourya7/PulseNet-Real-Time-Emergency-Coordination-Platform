import { Search, Bell, User, RefreshCw } from 'lucide-react'

export default function Header({ alerts }) {
    const pendingCount = alerts?.filter(a => a.status === 'pending').length || 0

    return (
        <header className="adm-header">
            <div className="adm-search">
                <Search className="adm-search-icon" size={16} />
                <input type="text" placeholder="Search incidents, responders, or logs..." />
            </div>

            <div className="ml-auto flex items-center gap-16">
                <div className="adm-sync-widget">
                    <RefreshCw size={14} className="text-green anim-spin" style={{ animation: 'spin 4s linear infinite' }} />
                    <span>System Live</span>
                    <div className="adm-sync-progress">
                        <div className="adm-sync-bar" style={{ width: '100%' }} />
                    </div>
                </div>

                <button className="adm-bell-btn" style={{ position: 'relative' }}>
                    <Bell size={18} />
                    {pendingCount > 0 && (
                        <div className="adm-notif-dot" style={{ background: 'var(--accent-red)', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {pendingCount}
                        </div>
                    )}
                </button>

                <div className="flex items-center gap-12 ml-8 cursor-pointer">
                    <div className="adm-avatar">AD</div>
                    <div className="hide-mobile">
                        <div className="text-sm font-bold">Admin Console</div>
                        <div className="text-xs text-muted">Ready for Command</div>
                    </div>
                </div>
            </div>
        </header>
    )
}
