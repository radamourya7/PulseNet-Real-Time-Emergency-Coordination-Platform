import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { apiFetch, SOCKET_URL, getTokenPayload } from '../../api'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Analytics from './components/Analytics'
import LiveMap from './components/LiveMap'
import Broadcast from './components/Broadcast'
import Incidents from './components/Incidents'
import Evidence from './components/Evidence'
import Tracking from './components/Tracking'
import SystemStatusWidget from './components/SystemStatusWidget'
import ActivityFeed from './components/ActivityFeed'
import AlertFilters from './components/AlertFilters'
import AlertManagement from './components/AlertManagement'

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('overview')
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [broadcasts, setBroadcasts] = useState([])
    const [socketStatus, setSocketStatus] = useState('Disconnected')
    const [connectedUsers, setConnectedUsers] = useState(0)
    const [filters, setFilters] = useState({ status: 'all', severity: 'all', region: 'all', query: '' })
    const socketRef = useRef(null)
    const user = getTokenPayload()

    // ── Data Fetching ──────────────────────────────────────────────────────────
    useEffect(() => {
        setLoading(true)
        apiFetch('/api/alerts')
            .then(data => setAlerts(data))
            .catch(err => console.error('Failed to fetch alerts:', err))
            .finally(() => setLoading(false))
    }, [])

    // ── Socket.IO Real-time ───────────────────────────────────────────────────
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })

        const token = localStorage.getItem('token')
        socketRef.current.on('connect', () => {
            setSocketStatus('Connected')
            socketRef.current.emit('join-admin-room', token)
        })

        socketRef.current.on('disconnect', () => {
            setSocketStatus('Disconnected')
        })

        socketRef.current.on('stats-update', (stats) => {
            setConnectedUsers(stats.activeUsers || 0)
        })

        socketRef.current.on('new-alert', (alert) => {
            setAlerts(prev => [alert, ...prev])
            setBroadcasts(prev => [{
                id: Date.now(),
                type: 'New Alert',
                message: `${alert.type.toUpperCase()} alert from ${alert.user?.name || 'User'}`,
                timestamp: new Date().toISOString(),
                isSystem: true
            }, ...prev.slice(0, 9)])
        })

        socketRef.current.on('alert-updated', (updated) => {
            setAlerts(prev => prev.map(a => a._id === updated._id ? updated : a))
        })

        socketRef.current.on('alert-deleted', ({ id }) => {
            setAlerts(prev => prev.filter(a => a._id !== id))
        })

        socketRef.current.on('system-broadcast', (data) => {
            setBroadcasts(prev => [data, ...prev.slice(0, 9)])
        })

        return () => socketRef.current?.disconnect()
    }, [])

    const handleUpdateStatus = async (alertId, status) => {
        try {
            await apiFetch(`/api/alerts/${alertId}`, {
                method: 'PATCH',
                body: { status }
            })
        } catch (err) {
            console.error('Failed to update status:', err)
        }
    }

    const renderSection = () => {
        const filteredAlerts = alerts.filter(a => {
            if (filters.status !== 'all' && a.status !== filters.status) return false
            if (filters.severity !== 'all') {
                const isPanic = a.type === 'panic'
                if (filters.severity === 'critical' && !isPanic) return false
                if (filters.severity === 'high' && isPanic) return false // simplistic mapping
            }
            if (filters.query) {
                const q = filters.query.toLowerCase()
                return a._id.toLowerCase().includes(q) || a.user?.name?.toLowerCase().includes(q)
            }
            return true
        })

        const commonProps = {
            alerts: filteredAlerts,
            loading,
            socket: socketRef.current,
            broadcasts,
            onUpdateStatus: handleUpdateStatus,
            user,
            connectedUsers,
            socketStatus
        }

        switch (activeSection) {
            case 'overview':
                return (
                    <div className="flex flex-col gap-24 anim-fade">
                        <SystemStatusWidget {...commonProps} />
                        <div className="adm-grid-2" style={{ gridTemplateColumns: '1fr 350px' }}>
                            <Analytics {...commonProps} />
                            <ActivityFeed {...commonProps} />
                        </div>
                    </div>
                )
            case 'analytics':
                return <Analytics {...commonProps} />
            case 'map':
                return <LiveMap {...commonProps} />
            case 'broadcasts':
                return <Broadcast {...commonProps} />
            case 'incidents':
            case 'alerts':
                return (
                    <div className="flex flex-col gap-16 anim-fade">
                        <AlertFilters filters={filters} setFilters={setFilters} />
                        <AlertManagement {...commonProps} />
                    </div>
                )
            case 'evidence':
                return <Evidence {...commonProps} />
            case 'tracking':
                return <Tracking {...commonProps} />
            default:
                return <Analytics {...commonProps} />
        }
    }

    return (
        <div className="adm-layout">
            <Sidebar active={activeSection} setActive={setActiveSection} />
            <main className="adm-main">
                <Header alerts={alerts} />
                <div className="adm-content">
                    <div className="flex justify-between items-center mb-24">
                        <div>
                            <h1 className="adm-page-title capitalize">{activeSection.replace('-', ' ')}</h1>
                            <p className="text-muted text-sm">Real-time system monitoring & coordination</p>
                        </div>
                        <div className="flex gap-12">
                            <button className="btn btn-ghost btn-sm" onClick={() => window.location.reload()}>Refresh Page</button>
                            <button className="btn btn-primary btn-sm" onClick={() => setActiveSection('map')}>View Map</button>
                        </div>
                    </div>
                    {renderSection()}
                </div>
            </main>
        </div>
    )
}
