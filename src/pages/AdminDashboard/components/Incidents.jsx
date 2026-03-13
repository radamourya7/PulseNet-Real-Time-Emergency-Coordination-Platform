import { Clock, User, CheckCircle, MapPin, AlertCircle, Image as ImageIcon, ExternalLink } from 'lucide-react'

export default function Incidents({ alerts, loading, onUpdateStatus }) {
    if (loading) return <div className="text-center p-40 text-muted italic">Polling active incidents...</div>
    if (alerts.length === 0) return (
        <div className="card text-center p-40">
            <CheckCircle size={40} className="text-green mx-auto mb-16" />
            <div className="font-bold text-lg">Clean Slate</div>
            <p className="text-muted">No active or reported incidents found.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-16">
            {alerts.map(a => (
                <div key={a._id} className="card">
                    <div className="flex items-center gap-16">
                        <div className={`status-dot ${a.status === 'resolved' ? 'live' : 'crit'}`} />
                        <div className="flex-1">
                            <div className="flex items-center gap-8">
                                <span className="font-bold text-base">{a.user?.name || 'Unknown User'}</span>
                                <span className={`adm-badge ${a.type === 'panic' ? 'badge-red' : 'badge-amber'}`}>{a.type}</span>
                                <span className="text-xs text-muted ml-auto">
                                    {new Date(a.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-muted mt-4">
                                <MapPin size={12} />
                                {a.location?.lat.toFixed(4)}°N, {a.location?.lng.toFixed(4)}°E · Sector Auto
                            </div>
                        </div>
                    </div>

                    {/* Media Gallery Preview */}
                    {a.evidence && a.evidence.length > 0 && (
                        <div className="mt-16 flex flex-wrap gap-8">
                            {a.evidence.map((ev, idx) => (
                                <div key={idx} className="relative group" style={{ width: 80, height: 60, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                    {ev.type === 'image' || ev.url?.startsWith('data:image') ? (
                                        <img src={ev.url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full"><ImageIcon size={20} className="text-muted" /></div>
                                    )}
                                    <a
                                        href={ev.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="divider" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-12">
                            <div className="adm-timeline-content" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                                Current Status: <span className="font-bold underline capitalize">{a.status}</span>
                            </div>
                            {a.assignedAdmin && (
                                <span className="text-xs text-blue font-medium">Assigned to: {a.assignedAdmin.name || 'Admin'}</span>
                            )}
                        </div>

                        <div className="flex gap-8">
                            {a.status !== 'resolved' && (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => onUpdateStatus(a._id, 'resolved')}
                                >
                                    <CheckCircle size={14} /> Resolve Case
                                </button>
                            )}
                            <button className="btn btn-ghost btn-sm">Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
