import { useState, useEffect, useRef } from 'react'
import { apiFetch, getTokenPayload, logout, SOCKET_URL } from '../api'
import {
    MapPin, Clock, AlertTriangle, CheckCircle, HelpCircle,
    Activity, Bell, Navigation, Battery, Signal
} from 'lucide-react'
import { io } from 'socket.io-client'

const statusOptions = [
    { id: 'safe', icon: CheckCircle, label: 'Safe', desc: 'All clear, no assistance needed', color: 'var(--accent-green)', activeClass: 'active-safe' },
    { id: 'help', icon: HelpCircle, label: 'Need Help', desc: 'Assistance requested, non-critical', color: 'var(--accent-amber)', activeClass: 'active-help' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency', desc: 'Immediate response required', color: 'var(--accent-red)', activeClass: 'active-emergency' },
]

function Topbar({ user, gpsActive }) {
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?'
    return (
        <div className="topbar">
            <div>
                <div className="font-semibold" style={{ fontSize: '0.95rem' }}>My Dashboard</div>
                <div className="text-xs text-secondary topbar-gps-label">
                    {gpsActive ? '🟢 GPS Active' : '⚫ GPS Off'}
                </div>
            </div>
            <div className="flex items-center gap-16 ml-auto">
                <div className="flex items-center gap-8 hide-mobile">
                    <Battery size={14} color="var(--accent-green)" />
                    <Signal size={14} color="var(--accent-green)" />
                    <div className="status-dot live" />
                    <span className="text-xs" style={{ color: gpsActive ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {gpsActive ? 'GPS Active' : 'GPS Off'}
                    </span>
                </div>
                <button className="btn btn-ghost btn-sm"><Bell size={14} /></button>
                <button onClick={logout} title="Logout" style={{ background: 'none', cursor: 'pointer' }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700
                    }}>{initials}</div>
                </button>
            </div>
        </div>
    )
}

export default function UserDashboard() {
    const [activeStatus, setActiveStatus] = useState('safe')
    const [locationSharing, setLocationSharing] = useState(false)
    const [panicActive, setPanicActive] = useState(false)
    const [coords, setCoords] = useState(null)
    const [myAlerts, setMyAlerts] = useState([])
    const [activeAlertCount, setActiveAlertCount] = useState(0)
    const socketRef = useRef(null)
    const user = getTokenPayload()

    useEffect(() => {
        if (!navigator.geolocation) return
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy })
                setLocationSharing(true)
            },
            () => setLocationSharing(false),
            { enableHighAccuracy: true }
        )
        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })
        socketRef.current.on('new-alert', () => setActiveAlertCount(c => c + 1))
        socketRef.current.on('alert-updated', (a) => {
            if (a.status === 'resolved') setActiveAlertCount(c => Math.max(0, c - 1))
        })
        return () => socketRef.current?.disconnect()
    }, [])

    const handlePanic = async () => {
        setPanicActive(true)
        setActiveStatus('emergency')
        const lat = coords?.lat ?? 28.6139
        const lng = coords?.lng ?? 77.2090
        try {
            const alert = await apiFetch('/api/alerts', { method: 'POST', body: { lat, lng, type: 'panic' } })
            setMyAlerts(prev => [alert, ...prev])
        } catch { /* silently fail */ }
        setTimeout(() => setPanicActive(false), 3000)
    }

    function timeAgo(dateStr) {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins} min ago`
        return `${Math.floor(mins / 60)} hr ago`
    }

    return (
        <>
            <Topbar user={user} gpsActive={locationSharing} />
            <div className="content-area">
                <div className="dashboard-grid">

                    {/* ── Col 1: Status + Location ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <div className="section-title">My Status</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {statusOptions.map(({ id, icon: Icon, label, desc, color, activeClass }) => (
                                    <div key={id}
                                        className={`status-card ${activeStatus === id ? activeClass : ''} anim-fade-up`}
                                        style={{ flexDirection: 'row', textAlign: 'left', gap: 14, padding: '14px 18px', cursor: 'pointer' }}
                                        onClick={() => setActiveStatus(id)}>
                                        <div className="status-icon" style={{ width: 40, height: 40, flexShrink: 0, background: activeStatus === id ? color + '22' : 'var(--bg-secondary)' }}>
                                            <Icon size={18} color={activeStatus === id ? color : 'var(--text-muted)'} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-base" style={{ color: activeStatus === id ? color : 'var(--text-primary)' }}>{label}</div>
                                            <div className="text-xs text-muted">{desc}</div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', opacity: activeStatus === id ? 1 : 0 }}>
                                            <div className="status-dot" style={{ background: color, boxShadow: `0 0 0 2px ${color}33` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="card">
                            <div className="flex items-center gap-12 mb-16">
                                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: locationSharing ? 'var(--accent-blue-dim)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Navigation size={16} color={locationSharing ? 'var(--accent-blue)' : 'var(--text-muted)'} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Location Sharing</div>
                                    <div className="text-xs text-muted">{locationSharing ? 'Broadcasting live' : 'Waiting for GPS...'}</div>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <div onClick={() => setLocationSharing(s => !s)} style={{
                                        width: 42, height: 22, borderRadius: 11, cursor: 'pointer',
                                        background: locationSharing ? 'var(--accent-blue)' : 'var(--border)',
                                        position: 'relative', transition: 'all 0.3s ease',
                                    }}>
                                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, transition: 'all 0.3s ease', left: locationSharing ? 23 : 3 }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                                {coords
                                    ? <>📍 {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E<br />
                                        <span style={{ marginLeft: 16 }}>Accuracy: ±{Math.round(coords.acc)}m</span></>
                                    : '📍 Acquiring GPS signal...'}
                            </div>
                        </div>
                    </div>

                    {/* ── Col 2: Panic Button ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <div className="card" style={{ width: '100%' }}>
                            <div className="section-title" style={{ textAlign: 'center' }}>Emergency Action</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '10px 0' }}>
                                <button
                                    className="panic-btn"
                                    onClick={handlePanic}
                                    style={panicActive ? { transform: 'scale(0.97)', boxShadow: '0 0 0 20px rgba(239,68,68,0.18), 0 0 80px rgba(239,68,68,0.6)' } : {}}
                                >
                                    <AlertTriangle size={36} />
                                    <span>SOS</span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>PANIC BUTTON</span>
                                </button>
                                <div className="text-xs text-muted" style={{ textAlign: 'center', maxWidth: 140 }}>
                                    {panicActive
                                        ? <span style={{ color: 'var(--accent-red)' }}>🔴 Alert sent! Help is on the way...</span>
                                        : 'Tap to send an emergency alert to admin'}
                                </div>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                            {[
                                { label: 'My Status', value: activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1), icon: Activity, color: activeStatus === 'safe' ? 'var(--accent-green)' : activeStatus === 'emergency' ? 'var(--accent-red)' : 'var(--accent-amber)' },
                                { label: 'Alerts Sent', value: myAlerts.length, icon: Bell, color: 'var(--accent-red)' },
                                { label: 'GPS', value: locationSharing ? 'Live' : 'Off', icon: MapPin, color: locationSharing ? 'var(--accent-blue)' : 'var(--text-muted)' },
                                { label: 'Active Alerts', value: activeAlertCount, icon: AlertTriangle, color: 'var(--accent-amber)' },
                            ].map(({ label, value, icon: Icon, color }) => (
                                <div key={label} className="card card-sm" style={{ textAlign: 'center' }}>
                                    <Icon size={16} color={color} style={{ margin: '0 auto 6px' }} />
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
                                    <div className="text-xs text-muted">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Col 3: Alert History ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="card" style={{ flex: 1 }}>
                            <div className="flex items-center gap-8 mb-16">
                                <div className="section-title" style={{ marginBottom: 0 }}>My Alert History</div>
                            </div>
                            {myAlerts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <CheckCircle size={20} style={{ margin: '0 auto 8px', display: 'block' }} color="var(--accent-green)" />
                                    No alerts sent yet
                                </div>
                            ) : myAlerts.map((alert, i) => (
                                <div key={alert._id || i} className="timeline-item">
                                    <div className="timeline-dot" style={{ background: 'var(--accent-red-dim)' }}>
                                        <AlertTriangle size={13} color="var(--accent-red)" />
                                    </div>
                                    <div style={{ paddingTop: 4 }}>
                                        <div className="text-sm font-medium capitalize">{alert.type} alert sent</div>
                                        <div className="text-xs text-muted flex items-center gap-4" style={{ marginTop: 2 }}>
                                            <Clock size={10} /> {timeAgo(alert.createdAt)}
                                        </div>
                                        <div className={`badge ${alert.status === 'resolved' ? 'badge-green' : 'badge-red'}`} style={{ marginTop: 4, fontSize: '0.6rem' }}>
                                            {alert.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
