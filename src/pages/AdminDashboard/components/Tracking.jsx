import { MapPin, Activity, Clock } from 'lucide-react'

export default function Tracking({ alerts }) {
    // Get unique users from recent alerts
    const responders = alerts?.reduce((acc, a) => {
        if (!acc.find(r => r._id === a.user?._id)) {
            acc.push({
                _id: a.user?._id,
                name: a.user?.name || 'Unknown',
                lat: a.location?.lat,
                lng: a.location?.lng,
                status: a.status === 'resolved' ? 'Idle' : 'Active',
                time: a.updatedAt || a.createdAt
            })
        }
        return acc
    }, []) || []

    return (
        <div className="adm-grid-2">
            <div className="card">
                <div className="section-title flex items-center gap-8"><Activity size={14} /> Live Incident Tracking</div>
                <div className="mt-16 overflow-x-auto">
                    <table className="tracking-table">
                        <thead>
                            <tr>
                                <th>Target / User</th>
                                <th>Status</th>
                                <th>Last Pos</th>
                                <th>Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-24 text-muted">No active tracking sessions</td>
                                </tr>
                            )}
                            {responders.map((r, i) => (
                                <tr key={r._id || i}>
                                    <td className="font-bold">{r.name}</td>
                                    <td>
                                        <span className={`track-status-dot ${r.status === 'Active' ? 'live' : 'off'}`} />
                                        {r.status}
                                    </td>
                                    <td className="text-xs font-mono">{r.lat?.toFixed(3)}, {r.lng?.toFixed(3)}</td>
                                    <td className="text-muted text-xs">
                                        {new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: '300px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                    <MapPin size={32} className="text-blue" />
                    <span className="text-sm font-medium">Tracking Map Slice</span>
                    <p className="text-xs text-muted max-w-200 text-center px-24">Select a user from the table to focus the live tracking perimeter.</p>
                </div>
            </div>
        </div>
    )
}
