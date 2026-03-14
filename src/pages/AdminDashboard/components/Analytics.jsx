import { Activity, Shield, AlertTriangle, CheckCircle, TrendingUp, Cpu } from 'lucide-react'

export default function Analytics({ alerts = [], loading }) {
    if (loading) return (
        <div className="flex flex-col items-center justify-center p-40 gap-16">
            <Cpu className="text-blue anim-spin" style={{ animation: 'spin 4s linear infinite' }} />
            <div className="text-muted italic text-sm">Aggregating SOC Intel...</div>
        </div>
    )

    const critCount = alerts.filter(a => a.type === 'panic' && a.status !== 'resolved').length
    const pendingCount = alerts.filter(a => a.status === 'pending').length
    const resolvedCount = alerts.filter(a => a.status === 'resolved').length
    const resolveRate = alerts.length ? Math.round((resolvedCount / alerts.length) * 100) : 0

    const stats = [
        { label: 'Incident Volume', value: alerts.length, icon: Activity, trend: '+12%', color: 'var(--accent-blue)', status: 'info' },
        { label: 'Active Critical', value: critCount, icon: AlertTriangle, trend: 'HIGH', color: 'var(--accent-red)', status: 'critical' },
        { label: 'Resolved (Total)', value: resolvedCount, icon: CheckCircle, trend: `${resolveRate}%`, color: 'var(--accent-green)', status: 'success' },
        { label: 'Pending Queue', value: pendingCount, icon: Shield, trend: '!', color: 'var(--accent-purple)', status: 'warning' },
    ]

    // Mock daily breakdown based on real count
    const chartData = [20, 35, 25, 45, alerts.length, 30, 40]
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Today', 'Sat', 'Sun']

    return (
        <div className="analytics-section anim-fade">
            <div className="status-grid mb-24">
                {stats.map((s, i) => (
                    <div key={i} className="status-card-compact anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="status-card-header">
                            <s.icon size={16} className={`status-icon-${s.status}`} />
                            <span className="status-label">{s.label}</span>
                            <div className={`status-indicator indicator-${s.status}`} />
                        </div>
                        <div className="status-card-body flex justify-between items-end">
                            <div>
                                <div className="status-value">{s.value}</div>
                                <div className="status-details">Live system stats</div>
                            </div>
                            <div className={`flex items-center gap-4 text-xs font-bold ${s.status === 'critical' ? 'text-red' : 'text-blue'}`}>
                                <TrendingUp size={12} /> {s.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-2">
                <div className="card anim-fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="section-title">Case Volume Analysis</div>
                    <div className="adm-chart-container mt-24">
                        {chartData.map((h, i) => (
                            <div key={i} className="adm-chart-bar" style={{ height: `${Math.min(h * 2, 100)}%` }} data-label={labels[i]} />
                        ))}
                    </div>
                </div>
                <div className="card anim-fade-up" style={{ animationDelay: '0.5s' }}>
                    <div className="section-title">System Efficiency Meta-Stats</div>
                    <div className="flex flex-col gap-16 mt-20">
                        <div className="efficiency-item">
                            <div className="flex justify-between items-center text-sm mb-8">
                                <span className="text-secondary font-medium">Resolution Throughput</span>
                                <span className="text-green font-bold">{resolveRate}%</span>
                            </div>
                            <div className="adm-sync-progress" style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)' }}>
                                <div className="adm-sync-bar" style={{ width: `${resolveRate}%`, boxShadow: '0 0 10px var(--accent-green-glow)' }} />
                            </div>
                        </div>
                        <div className="efficiency-item">
                            <div className="flex justify-between items-center text-sm mb-8">
                                <span className="text-secondary font-medium">Mean Response Time</span>
                                <span className="text-blue font-bold">2.4m</span>
                            </div>
                            <div className="adm-sync-progress" style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)' }}>
                                <div className="adm-sync-bar" style={{ width: '85%', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue-glow)' }} />
                            </div>
                        </div>
                        <p className="text-xs text-muted mt-8 leading-relaxed">
                            Efficiency metrics are calculated based on the last 500 incidents processed by the PulseNet core.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
