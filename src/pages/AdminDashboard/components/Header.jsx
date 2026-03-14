import { Search, Bell, User, RefreshCw, Shield, Terminal } from 'lucide-react'

export default function Header({ alerts = [] }) {
    const pendingCount = alerts?.filter(a => a.status === 'pending').length || 0

    return (
        <header className="adm-header bg-card border-b border-border px-24 h-64 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-16">
                <div className="adm-search-container flex items-center bg-secondary border border-border rounded-md px-12 py-6 min-w-[320px]">
                    <Search className="text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search alerts, users..."
                        className="bg-transparent border-none outline-none text-sm ml-8 text-primary w-full placeholder:text-muted"
                    />
                </div>
            </div>

            <div className="flex items-center gap-20">
                <div className="system-ping flex items-center gap-8">
                    <div className="status-dot live" />
                    <span className="text-xs text-secondary">System Online</span>
                </div>

                <div className="h-24 w-1 bg-border" />

                <div className="flex items-center gap-16">
                    <button className="relative p-8 text-secondary hover:text-primary transition-colors">
                        <Bell size={18} />
                        {pendingCount > 0 && (
                            <span className="absolute top-2 right-2 w-8 h-8 bg-red rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                                {pendingCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-12 pl-8 border-l border-border">
                        <div className="flex flex-col items-end hide-mobile">
                            <span className="text-xs font-bold leading-tight">Admin User</span>
                        </div>
                        <div className="w-32 h-32 rounded-lg bg-blue flex items-center justify-center font-bold text-xs text-white">
                            AD
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
