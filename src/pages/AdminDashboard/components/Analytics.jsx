import { Activity, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Analytics({ alerts, loading }) {
    if (loading) return <div className="text-center p-40 text-muted">Calculating real-time analytics...</div>

    const critCount = alerts.filter(a => a.type === 'panic' && a.status !== 'resolved').length
    const pendingCount = alerts.filter(a => a.status === 'pending').length
    const resolvedCount = alerts.filter(a => a.status === 'resolved').length
    const resolveRate = alerts.length ? Math.round((resolvedCount / alerts.length) * 100) : 0

    const stats = [
        { label: 'Total Incidents', value: alerts.length, icon: Activity, trend: '+', color: 'var(--accent-blue)' },
        { label: 'Critical Alerts', value: critCount, icon: AlertTriangle, trend: 'LIVE', color: 'var(--accent-red)' },
        { label: 'Resolved Cases', value: resolvedCount, icon: CheckCircle, trend: `${resolveRate}%`, color: 'var(--accent-green)' },
        { label: 'Active Pending', value: pendingCount, icon: Shield, trend: '!', color: 'var(--accent-purple)' },
    ]

    // Mock daily breakdown based on real count
    const chartData = [20, 35, 25, 45, alerts.length, 30, 40]
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Today', 'Sat', 'Sun']

    return (
        <div className="analytics-section">
            <div className="adm-stat-grid">
                {stats.map((s, i) => (
                    <div key={i} className="adm-stat-card">
                        <div className="flex items-center justify-between mb-8">
                            <s.icon size={20} style={{ color: s.color }} />
                            <div className="adm-stat-trend" style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                                {s.trend}
                            </div>
                        </div>
                        <div className="adm-stat-value">{s.value}</div>
                        <div className="adm-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="adm-grid-2">
                <div className="adm-chart-card">
                    <div className="section-title">Incident Volume (Weekly)</div>
                    <div className="adm-chart-container mt-24">
                        {chartData.map((h, i) => (
                            <div key={i} className="adm-chart-bar" style={{ height: `${Math.min(h, 100)}%` }} data-label={labels[i]} />
                        ))}
                    </div>
                </div>
                <div className="adm-chart-card">
                    <div className="section-title">System Efficiency</div>
                    <div className="flex flex-col gap-12 mt-16">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span>Resolution Rate</span>
                            <span className="text-green">{resolveRate}%</span>
                        </div>
                        <div className="adm-sync-progress" style={{ width: '100%', height: '10px' }}>
                            <div className="adm-sync-bar" style={{ width: `${resolveRate}%` }} />
                        </div>
                        <p className="text-xs text-muted mt-8">Based on total processed alerts since system launch.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
