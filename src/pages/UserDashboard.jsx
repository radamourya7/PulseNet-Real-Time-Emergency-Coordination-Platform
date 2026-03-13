import { useState, useEffect, useRef } from 'react'
import { apiFetch, getTokenPayload, logout, SOCKET_URL } from '../api'
import {
    MapPin, Clock, AlertTriangle, CheckCircle, HelpCircle,
    Activity, Bell, Navigation, Battery, Signal, X, Camera, Image as ImageIcon
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
    const [resolvedToast, setResolvedToast] = useState(null) // { alertId, message }
    const [activeBroadcast, setActiveBroadcast] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [sosType, setSosType] = useState('medical')
    const [customNote, setCustomNote] = useState('')
    const fileInputRef = useRef(null)
    const socketRef = useRef(null)
    const user = getTokenPayload()

    // ── GPS watch ──────────────────────────────────────────────────────────────
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

    // ── Load own alert history on mount ────────────────────────────────────────
    useEffect(() => {
        apiFetch('/api/alerts/mine')
            .then(setMyAlerts)
            .catch(console.error)
    }, [])

    // ── Socket.IO — join user room + listeners ───────────
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })

        const token = localStorage.getItem('token')
        socketRef.current.on('connect', () => {
            // Join personal user room to receive targeted events
            socketRef.current.emit('join-user-room', token)
        })

        // Admin resolved our alert
        socketRef.current.on('alert-resolved', (resolved) => {
            setMyAlerts(prev =>
                prev.map(a => a._id === resolved._id ? { ...a, status: 'resolved' } : a)
            )
            setResolvedToast({ alertId: resolved._id, message: '✅ Your alert has been resolved by admin' })
            setTimeout(() => setResolvedToast(null), 5000)
        })

        // Global system broadcast
        socketRef.current.on('system-broadcast', (data) => {
            setActiveBroadcast(data)
            // Play a sound or vibrate if possible
            if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200])
        })

        return () => socketRef.current?.disconnect()
    }, [])

    const compressImage = (base64Str) => {
        return new Promise((resolve) => {
            const img = new Image()
            img.src = base64Str
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const MAX_WIDTH = 1024
                const MAX_HEIGHT = 1024
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', 0.7)) // 70% quality
            }
        })
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 20 * 1024 * 1024) {
            window.alert('File too large. Please select an image under 20MB.')
            return
        }

        const reader = new FileReader()
        reader.onloadend = async () => {
            const compressed = await compressImage(reader.result)
            setSelectedImage(compressed)
            console.log('🖼️ Image compressed from', reader.result.length, 'to', compressed.length)
        }
        reader.readAsDataURL(file)
    }

    const checkConnection = async () => {
        try {
            const data = await apiFetch('/api/ping')
            window.alert(`📡 Connection OK: ${data.message} (Port: ${data.port})`)
        } catch (err) {
            window.alert(`❌ Connection Failed: ${err.message}`)
        }
    }

    // ── Panic SOS ──────────────────────────────────────────────────────────────
    const handlePanic = async () => {
        setPanicActive(true)
        setActiveStatus('emergency')
        const lat = coords?.lat ?? 28.6139
        const lng = coords?.lng ?? 77.2090

        const evidence = selectedImage ? [{
            url: selectedImage,
            type: 'image',
            createdAt: new Date().toISOString()
        }] : []

        const alertType = sosType === 'other' ? (customNote.trim() || 'other') : sosType

        try {
            console.log('Sending SOS:', alertType, '| evidence:', evidence.length)
            const alert = await apiFetch('/api/alerts', {
                method: 'POST',
                body: { lat, lng, type: alertType, evidence }
            })
            setMyAlerts(prev => [alert, ...prev])
            setSelectedImage(null)
            setCustomNote('')
            console.log('SOS sent successfully')
        } catch (err) {
            console.error('Failed to send SOS:', err)
            window.alert('Failed to send SOS: ' + err.message + '. Try reducing image size or check connection.')
        }
        setTimeout(() => setPanicActive(false), 3000)
    }

    function timeAgo(dateStr) {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'just now'
        if (mins < 60) return `${mins} min ago`
        return `${Math.floor(mins / 60)} hr ago`
    }

    const pendingCount = myAlerts.filter(a => a.status !== 'resolved').length

    return (
        <>
            <Topbar user={user} gpsActive={locationSharing} />

            {/* ── Broadcast Banner ─────────────────────────────────────────── */}
            {activeBroadcast && (
                <div className="broadcast-banner">
                    <div style={{ background: 'rgba(255,255,255,0.2)', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bell size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9, letterSpacing: 1 }}>
                            {activeBroadcast.type || 'System Alert'}
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: 2 }}>
                            {activeBroadcast.message}
                        </div>
                    </div>
                    <button onClick={() => setActiveBroadcast(null)} style={{ background: 'rgba(0,0,0,0.1)', color: '#fff', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* ── Resolve Toast ─────────────────────────────────────────── */}
            {resolvedToast && !activeBroadcast && (
                <div style={{
                    position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 9999, background: 'var(--accent-green)', color: '#fff',
                    padding: '12px 24px', borderRadius: 'var(--radius-md)',
                    fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 8px 32px rgba(34,197,94,0.4)', animation: 'anim-fade-up 0.3s ease',
                }}>
                    <CheckCircle size={16} />
                    {resolvedToast.message}
                    <button onClick={() => setResolvedToast(null)} style={{ background: 'none', color: '#fff', marginLeft: 8, display: 'flex' }}>
                        <X size={14} />
                    </button>
                </div>
            )}

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
                                    ? <>{`📍 ${coords.lat.toFixed(5)}° N, ${coords.lng.toFixed(5)}° E`}<br />
                                        <span style={{ marginLeft: 16 }}>Accuracy: ±{Math.round(coords.acc)}m</span></>
                                    : '📍 Acquiring GPS signal...'}
                            </div>
                        </div>
                    </div>

                    {/* ── Col 2: Panic Button + Live Stats ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <div className="card" style={{ width: '100%' }}>
                            <div className="section-title" style={{ textAlign: 'center' }}>Emergency Action</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '10px 0' }}>

                                {/* SOS Type Selector */}
                                <div style={{ width: '100%' }}>
                                    <div className="text-xs text-muted" style={{ marginBottom: 6, textAlign: 'center' }}>Type of Emergency</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, width: '100%' }}>
                                        {[
                                            { id: 'medical', label: '🏥 Medical', color: 'var(--accent-blue)' },
                                            { id: 'fire', label: '🔥 Fire', color: 'var(--accent-amber)' },
                                            { id: 'security', label: '🚨 Security', color: 'var(--accent-red)' },
                                            { id: 'other', label: '✏️ Other', color: 'var(--text-secondary)' },
                                        ].map(({ id, label, color }) => (
                                            <button
                                                key={id}
                                                onClick={() => setSosType(id)}
                                                style={{
                                                    padding: '6px 10px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    border: `1px solid ${sosType === id ? color : 'var(--border)'}`,
                                                    background: sosType === id ? color + '22' : 'var(--bg-secondary)',
                                                    color: sosType === id ? color : 'var(--text-muted)',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >{label}</button>
                                        ))}
                                    </div>
                                    {sosType === 'other' && (
                                        <textarea
                                            placeholder="Describe your emergency..."
                                            value={customNote}
                                            onChange={e => setCustomNote(e.target.value)}
                                            rows={2}
                                            style={{
                                                width: '100%', marginTop: 8, resize: 'none',
                                                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                                fontSize: '0.78rem', padding: '8px 10px', outline: 'none',
                                            }}
                                        />
                                    )}
                                </div>

                                <button
                                    className="panic-btn"
                                    onClick={handlePanic}
                                    style={panicActive ? { transform: 'scale(0.97)', boxShadow: '0 0 0 20px rgba(239,68,68,0.18), 0 0 80px rgba(239,68,68,0.6)' } : {}}
                                >
                                    <AlertTriangle size={36} />
                                    <span>SOS</span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>PANIC BUTTON</span>
                                </button>

                                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                                    <button
                                        className="btn btn-ghost flex-1"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ borderStyle: 'dashed' }}
                                    >
                                        <Camera size={16} /> Photos
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={checkConnection}
                                        title="Check Signal"
                                    >
                                        <Signal size={16} />
                                    </button>
                                </div>

                                {/* Evidence Capture */}
                                <div style={{ width: '100%' }}>
                                    {!selectedImage ? (
                                        null
                                    ) : (
                                        <div className="img-preview-box">
                                            <img src={selectedImage} alt="Evidence" />
                                            <div className="img-remove-btn" onClick={() => setSelectedImage(null)}>
                                                <X size={14} />
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="text-xs text-muted" style={{ textAlign: 'center', maxWidth: 180 }}>
                                    {panicActive
                                        ? <span style={{ color: 'var(--accent-red)' }}>🔴 Alert sent! Help is on the way...</span>
                                        : 'Tap to send an emergency alert with location and photo.'}
                                </div>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                            {[
                                { label: 'My Status', value: activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1), icon: Activity, color: activeStatus === 'safe' ? 'var(--accent-green)' : activeStatus === 'emergency' ? 'var(--accent-red)' : 'var(--accent-amber)' },
                                { label: 'Alerts Sent', value: myAlerts.length, icon: Bell, color: 'var(--accent-red)' },
                                { label: 'GPS', value: locationSharing ? 'Live' : 'Off', icon: MapPin, color: locationSharing ? 'var(--accent-blue)' : 'var(--text-muted)' },
                                { label: 'Pending', value: pendingCount, icon: AlertTriangle, color: pendingCount > 0 ? 'var(--accent-amber)' : 'var(--accent-green)' },
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
                                {myAlerts.length > 0 && (
                                    <span className="badge badge-blue" style={{ marginLeft: 'auto', fontSize: '0.6rem' }}>
                                        {myAlerts.length} total
                                    </span>
                                )}
                            </div>
                            {myAlerts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <CheckCircle size={20} style={{ margin: '0 auto 8px', display: 'block' }} color="var(--accent-green)" />
                                    No alerts sent yet
                                </div>
                            ) : myAlerts.map((alert, i) => (
                                <div key={alert._id || i} className="timeline-item">
                                    <div className="timeline-dot" style={{ background: alert.status === 'resolved' ? 'var(--accent-green-dim, #16a34a22)' : 'var(--accent-red-dim)' }}>
                                        {alert.status === 'resolved'
                                            ? <CheckCircle size={13} color="var(--accent-green)" />
                                            : <AlertTriangle size={13} color="var(--accent-red)" />}
                                    </div>
                                    <div style={{ paddingTop: 4 }}>
                                        <div className="text-sm font-medium capitalize">{alert.type} alert sent</div>
                                        <div className="text-xs text-muted flex items-center gap-4" style={{ marginTop: 2 }}>
                                            <Clock size={10} /> {timeAgo(alert.createdAt)}
                                        </div>
                                        {alert.evidence?.length > 0 && (
                                            <div className="flex items-center gap-4 mt-4 text-accent-blue" style={{ fontSize: '0.65rem' }}>
                                                <ImageIcon size={10} /> +{alert.evidence.length} Media Attached
                                            </div>
                                        )}
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
