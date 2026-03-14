import { Server, Activity, Users, Zap } from 'lucide-react'

export default function SystemStatusWidget({ alerts, connectedUsers = 0, socketStatus = 'Disconnected' }) {
    const activeAlerts = alerts?.filter(a => a.status !== 'resolved').length || 0
    const isOnline = socketStatus === 'Connected'

    const metrics = [
        {
            label: 'Server Status',
            value: isOnline ? 'Online' : 'Offline',
            icon: Server,
            status: isOnline ? 'success' : 'critical',
            details: 'Primary Cluster (AP-South)'
        },
        {
            label: 'Active Alerts',
            value: activeAlerts,
            icon: Activity,
            status: activeAlerts > 5 ? 'critical' : activeAlerts > 0 ? 'warning' : 'success',
            details: 'Requires Attention'
        },
        {
            label: 'Connected Users',
            value: connectedUsers,
            icon: Users,
            status: 'info',
            details: 'Active Sessions'
        },
        {
            label: 'WebSocket',
            value: socketStatus,
            icon: Zap,
            status: isOnline ? 'success' : 'critical',
            details: 'Real-time Sync'
        }
    ]

    return (
        <div className="system-status-container">
            <div className="section-title">System Health & Live Monitoring</div>
            <div className="status-grid">
                {metrics.map((m, i) => (
                    <div key={i} className="status-card-compact anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="status-card-header">
                            <m.icon size={16} className={`status-icon-${m.status}`} />
                            <span className="status-label">{m.label}</span>
                            <div className={`status-indicator indicator-${m.status}`} />
                        </div>
                        <div className="status-card-body">
                            <div className="status-value">{m.value}</div>
                            <div className="status-details">{m.details}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
