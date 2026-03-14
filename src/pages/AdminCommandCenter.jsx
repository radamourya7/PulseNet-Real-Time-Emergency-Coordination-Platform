import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Radio, Bell, Filter, Search, Shield,
    CheckCircle, MapPin, Clock, User, ChevronRight,
    Layers, Navigation, X, RefreshCw, Activity, LogOut, AlertTriangle, Send,
    Image as ImageIcon, ExternalLink
} from 'lucide-react'
import { io } from 'socket.io-client'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { apiFetch, getTokenPayload, logout, SOCKET_URL } from '../api'

// Fix Leaflet default icon path issue with Vite bundler
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ÔöÇÔöÇ Helpers ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hr ago`
    return `${Math.floor(hrs / 24)} day ago`
}

function alertToSeverity(alert) {
    if (alert.status === 'resolved') return 'safe'
    if (alert.type === 'panic') return 'crit'
    return 'warn'
}

function makePinIcon(sev) {
    const color = sev === 'crit' ? '#ef4444' : sev === 'warn' ? '#f59e0b' : '#22c55e'
    const ping = sev === 'crit'
        ? `<div style="position:absolute;inset:-4px;border-radius:50%;background:${color};opacity:.3;animation:ping 1.5s infinite;"></div>` : ''
    return L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};box-shadow:0 0 0 5px ${color}33;position:relative;">${ping}</div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    })
}

// ÔöÇÔöÇ SeverityBadge ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function SeverityBadge({ sev }) {
    const cls = { crit: 'badge-red', warn: 'badge-amber', safe: 'badge-green' }
    const lbl = { crit: 'CRITICAL', warn: 'WARNING', safe: 'RESOLVED' }
    return <span className={`badge ${cls[sev] || 'badge-blue'}`}>{lbl[sev] || sev?.toUpperCase()}</span>
}

// ÔöÇÔöÇ LeafletMap ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function LeafletMap({ alerts, selectedId, onSelectAlert }) {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef({})

    // Initialise map once
    useEffect(() => {
        if (mapRef.current || !containerRef.current) return
        mapRef.current = L.map(containerRef.current, { center: [16.49212, 80.49681], zoom: 13, zoomControl: false })
        L.control.zoom({ position: 'topright' }).addTo(mapRef.current)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '┬® OpenStreetMap ┬® CARTO', maxZoom: 19,
        }).addTo(mapRef.current)
        return () => { mapRef.current?.remove(); mapRef.current = null }
    }, [])

    // Sync markers whenever alerts change
    useEffect(() => {
        const map = mapRef.current
        if (!map) return
        const seen = new Set(Object.keys(markersRef.current))
        alerts.forEach(alert => {
            const lat = alert.location?.lat, lng = alert.location?.lng
            if (!lat || !lng) return
            const sev = alertToSeverity(alert)
            if (markersRef.current[alert._id]) {
                markersRef.current[alert._id].setIcon(makePinIcon(sev))
            } else {
                const m = L.marker([lat, lng], { icon: makePinIcon(sev) })
                    .addTo(map)
                    .bindPopup(`<b>${alert.user?.name || 'User'}</b><br/>${alert.type} - ${alert.status}<br/>${lat.toFixed(4)}N, ${lng.toFixed(4)}E`)
                m.on('click', () => onSelectAlert(alert))
                markersRef.current[alert._id] = m
            }
            seen.delete(alert._id)
        })
        seen.forEach(id => { map.removeLayer(markersRef.current[id]); delete markersRef.current[id] })
    }, [alerts, onSelectAlert])

    // Pan to selected alert
    useEffect(() => {
        const map = mapRef.current
        if (!map || !selectedId) return
        const a = alerts.find(x => x._id === selectedId)
        if (a?.location?.lat) {
            map.flyTo([a.location.lat, a.location.lng], 15, { duration: 1 })
            markersRef.current[selectedId]?.openPopup()
        }
    }, [selectedId, alerts])

    return <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#0a0c0f' }} />
}

// ÔöÇÔöÇ DetailPanel ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function DetailPanel({ alert, onClose, onResolve }) {
    if (!alert) return null
    const sev = alertToSeverity(alert)
    return (
        <div className="detail-panel anim-slide-right">
            <div className="flex items-center gap-8">
                <div className="font-semibold">Alert Detail</div>
                <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                    <X size={16} />
                </button>
            </div>
            <hr className="divider" />
            <SeverityBadge sev={sev} />
            <div>
                <div className="text-xs text-muted mb-4">Alert Type</div>
                <div className="font-semibold capitalize">{alert.type}</div>
            </div>
            <div>
                <div className="text-xs text-muted mb-4">User</div>
                <div className="flex items-center gap-8">
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={13} color="var(--accent-blue)" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">{alert.user?.name || 'Unknown'}</div>
                        {alert.user?.email && <div className="text-xs text-muted">{alert.user.email}</div>}
                    </div>
                </div>
            </div>
            <div>
                <div className="text-xs text-muted mb-4">GPS Location</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    {alert.location?.lat?.toFixed(5) ?? '--'}N, {alert.location?.lng?.toFixed(5) ?? '--'}E
                </div>
            </div>
            <div>
                <div className="text-xs text-muted mb-4">Status</div>
                <div className={`badge ${alert.status === 'resolved' ? 'badge-green' : 'badge-red'}`}>{alert.status}</div>
            </div>
            <div>
                <div className="text-xs text-muted mb-4">Time Reported</div>
                <div className="flex items-center gap-8 text-sm">
                    <Clock size={12} color="var(--text-muted)" />
                    {timeAgo(alert.createdAt)}
                </div>
            </div>
            {alert.evidence && alert.evidence.length > 0 && (
                <div style={{ marginTop: 12 }}>
                    <div className="text-xs text-muted mb-8 text-secondary font-semibold uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>Visual Evidence Source</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                        {alert.evidence.map((ev, i) => (
                            <div key={i} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                                {ev.type === 'image' || ev.url?.startsWith('data:image') ? (
                                    <img src={ev.url} alt="Evidence" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                ) : (
                                    <div style={{ padding: 20, textAlign: 'center', background: 'var(--secondary)' }}>
                                        <ImageIcon size={24} color="var(--text-muted)" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                    <a href={ev.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost" style={{ fontSize: '0.65rem' }}>
                                        <ExternalLink size={10} /> Scan Original
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <hr className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alert.status !== 'resolved' && (
                    <button className="btn btn-success" style={{ justifyContent: 'center' }} onClick={() => onResolve(alert._id)}>
                        <CheckCircle size={14} /> Mark Resolved
                    </button>
                )}
                <button className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

// ÔöÇÔöÇ AdminCommandCenter (main) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

export default function AdminCommandCenter() {
    const [alerts, setAlerts] = useState([])
    const [selectedAlert, setSelectedAlert] = useState(null)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const socketRef = useRef(null)
    const user = getTokenPayload()
    const isSuperAdmin = user?.role === 'superadmin'

    // Fetch all alerts on mount
    useEffect(() => {
        apiFetch('/api/alerts')
            .then(setAlerts)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // Socket.IO real-time updates ÔÇö join personal admin room first
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })

        // Join admin-specific room so we only receive scoped alerts
        const token = localStorage.getItem('token')
        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-admin-room', token)
        })

        socketRef.current.on('new-alert', alert => setAlerts(prev => [alert, ...prev]))
        socketRef.current.on('alert-updated', updated => setAlerts(prev => prev.map(a => a._id === updated._id ? updated : a)))
        socketRef.current.on('alert-deleted', ({ id }) => setAlerts(prev => prev.filter(a => a._id !== id)))
        return () => socketRef.current?.disconnect()
    }, [])

    const handleResolve = async (id) => {
        try {
            await apiFetch(`/api/alerts/${id}`, { method: 'PATCH', body: { status: 'resolved' } })
        } catch (err) { console.error(err) }
    }

    const handleSelectAlert = useCallback(a => setSelectedAlert(a), [])

    // Filter + search
    const filtered = alerts.filter(a => {
        const sev = alertToSeverity(a)
        const matchFilter = filter === 'all' || sev === filter
        const matchSearch = !search || a.user?.name?.toLowerCase().includes(search.toLowerCase()) || a.type?.toLowerCase().includes(search.toLowerCase())
        return matchFilter && matchSearch
    })

    const counts = {
        all: alerts.length,
        crit: alerts.filter(a => alertToSeverity(a) === 'crit').length,
        warn: alerts.filter(a => alertToSeverity(a) === 'warn').length,
        safe: alerts.filter(a => alertToSeverity(a) === 'safe').length,
    }
    const pendingCount = alerts.filter(a => a.status === 'pending').length

    return (
        <div className="command-layout">

            {/* Alert Sidebar */}
            <div className="command-sidebar">
                {/* TOP AUTH AREA */}
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'between', flexShrink: 0, background: 'var(--secondary)' }}>
                    <div className="flex items-center gap-8">
                        <div className="status-dot live" />
                        <span className="text-[10px] font-bold text-green uppercase tracking-wider">Secure Uplink</span>
                    </div>
                    <button onClick={logout} className="flex items-center gap-4 text-red hover:text-red-bright transition-colors ml-auto" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
                        <LogOut size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
                    </button>
                </div>

                {/* Header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                    <div className="flex items-center gap-10 mb-12">
                        <Radio size={16} color="var(--accent-red)" />
                        <div className="font-bold" style={{ fontSize: '0.9rem' }}>PulseNet Admin</div>
                        {isSuperAdmin && <span className="badge badge-amber" style={{ fontSize: '0.55rem' }}>SUPER ADMIN</span>}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="form-input" placeholder="Search signals..."
                            style={{ paddingLeft: 30, padding: '7px 10px 7px 30px', fontSize: '0.8rem' }}
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                {/* Severity Filters */}
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexShrink: 0 }}>
                    {[{ k: 'all', label: 'All' }, { k: 'crit', label: 'Critical' }, { k: 'warn', label: 'Warning' }, { k: 'safe', label: 'Resolved' }].map(({ k, label }) => (
                        <button key={k} onClick={() => setFilter(k)} style={{
                            flex: 1, padding: '4px 0', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', fontWeight: 600,
                            background: filter === k ? 'var(--accent-blue-dim)' : 'transparent',
                            border: `1px solid ${filter === k ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                            color: filter === k ? 'var(--accent-blue)' : 'var(--text-muted)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                        }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{counts[k] ?? 0}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Signal Meta */}
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexShrink: 0, alignItems: 'center' }}>
                    <div className="flex items-center gap-6">
                        <Bell size={12} color="var(--accent-red)" />
                        <span className="text-xs" style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{pendingCount} signals pending</span>
                    </div>
                </div>

                {/* Alert List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                    {loading && (
                        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <RefreshCw size={16} style={{ margin: '0 auto 8px', display: 'block' }} />Loading alerts...
                        </div>
                    )}
                    {!loading && filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <CheckCircle size={20} style={{ margin: '0 auto 8px', display: 'block' }} color="var(--accent-green)" />
                            No alerts found
                        </div>
                    )}
                    {filtered.map(alert => (
                        <div key={alert._id}
                            className={`alert-item ${alertToSeverity(alert)} ${selectedAlert?._id === alert._id ? 'selected' : ''}`}
                            onClick={() => setSelectedAlert(alert)}>
                            <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
                                <div className="flex items-center gap-8 mb-4">
                                    <SeverityBadge sev={alertToSeverity(alert)} />
                                    <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{timeAgo(alert.createdAt)}</span>
                                </div>
                                <div className="font-semibold text-sm">{alert.user?.name || 'Unknown'}</div>
                                <div className="flex items-center gap-4 text-xs text-muted" style={{ marginTop: 2 }}>
                                    <MapPin size={10} />
                                    <span>{alert.location?.lat?.toFixed(3) ?? '?'}N - <span className="capitalize">{alert.type}</span></span>
                                    {alert.evidence && alert.evidence.length > 0 && (
                                        <ImageIcon size={10} className="text-blue" style={{ marginLeft: 4 }} title="Has Media Evidence" />
                                    )}
                                </div>
                            </div>
                            <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ÔöÇÔöÇ Main Map ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
            <div className="command-main">
                <div className="command-topbar">
                    <Filter size={14} color="var(--text-muted)" />
                    <div className="flex items-center gap-8" style={{ marginLeft: 'auto' }}>
                        <div className="status-dot live" />
                        <span className="text-xs" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>LIVE ┬À {alerts.length} alerts</span>
                    </div>
                    {isSuperAdmin && (
                        <div className="flex items-center gap-6">
                            <Shield size={13} color="var(--accent-amber)" />
                            <span className="text-xs" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>Super Admin</span>
                        </div>
                    )}
                    <button className="btn btn-danger btn-sm"><Bell size={13} /> Broadcast</button>
                    <button className="btn btn-ghost btn-sm"><Layers size={13} /></button>
                    <button className="btn btn-ghost btn-sm"><Navigation size={13} /></button>
                </div>
                <div className="command-map">
                    <LeafletMap alerts={alerts} selectedId={selectedAlert?._id} onSelectAlert={handleSelectAlert} />
                </div>
            </div>

            {/* ÔöÇÔöÇ Detail Panel ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
            <DetailPanel alert={selectedAlert} onClose={() => setSelectedAlert(null)} onResolve={handleResolve} />
        </div>
    )
}
