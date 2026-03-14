import { useState, useEffect } from 'react'
import {
    Clock, User, CheckCircle, MapPin, AlertCircle,
    MoreVertical, UserPlus, FileText, ChevronRight,
    Shield, MessageSquare, ChevronDown
} from 'lucide-react'
import { apiFetch } from '../../../api'

export default function AlertManagement({ alerts, onUpdateStatus }) {
    const [selectedAlert, setSelectedAlert] = useState(null)
    const [notes, setNotes] = useState({})
    const [responders, setResponders] = useState([])
    const [loadingResponders, setLoadingResponders] = useState(false)
    const [showAssignDropdown, setShowAssignDropdown] = useState(false)

    useEffect(() => {
        setLoadingResponders(true)
        apiFetch('/api/admin/admins')
            .then(data => setResponders(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoadingResponders(false))
    }, [])

    const handleAssign = async (alertId, adminId) => {
        try {
            const updated = await apiFetch(`/api/alerts/${alertId}/assign`, {
                method: 'PATCH',
                body: { adminId }
            })
            if (selectedAlert?._id === alertId) {
                setSelectedAlert(updated)
            }
            setShowAssignDropdown(false)
        } catch (err) {
            console.error('Failed to assign responder:', err)
        }
    }

    const getSeverityBadge = (type) => {
        if (type === 'panic') return <span className="badge badge-red">CRITICAL</span>
        return <span className="badge badge-amber">HIGH</span>
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'status-pending'
            case 'in-progress': return 'status-progress'
            case 'resolved': return 'status-resolved'
            default: return ''
        }
    }

    const handleAddNote = (id, text) => {
        setNotes(prev => ({ ...prev, [id]: text }))
    }

    return (
        <div className="alert-management-layout">
            <div className="alert-list-column">
                {alerts.map(a => (
                    <div
                        key={a._id}
                        className={`alert-case-card ${selectedAlert?._id === a._id ? 'selected' : ''}`}
                        onClick={() => setSelectedAlert(a)}
                    >
                        <div className="flex items-start gap-12">
                            <div className={`severity-line ${a.type === 'panic' ? 'bg-red' : 'bg-amber'}`} />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="alert-id text-xs text-muted font-mono mb-4">#INC-{a._id.substring(18)}</div>
                                    {getSeverityBadge(a.type)}
                                </div>
                                <div className="font-bold text-base mb-4">{a.user?.name || 'Unknown Subject'}</div>
                                <div className="flex items-center gap-8 text-xs text-muted">
                                    <Clock size={12} /> {new Date(a.createdAt).toLocaleTimeString()}
                                    <span className="bullet" />
                                    <MapPin size={12} /> {a.location?.lat.toFixed(2)}, {a.location?.lng.toFixed(2)}
                                </div>
                                <div className="mt-12 flex items-center justify-between">
                                    <div className={`status-pill ${getStatusStyle(a.status)}`}>
                                        {a.status.replace('-', ' ')}
                                    </div>
                                    <div className="responder-mini">
                                        {a.assignedAdmin ? (
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="avatar-xs">{(a.assignedAdmin.name || 'A').substring(0, 1)}</div>
                                                <span className="text-blue">{a.assignedAdmin.name || 'Admin'}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted italic text-xs">Unassigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAlert ? (
                <div className="alert-detail-panel card anim-scale">
                    <div className="detail-header flex justify-between items-center mb-24">
                        <div>
                            <h2 className="text-xl font-bold">Incident Details</h2>
                            <p className="text-xs text-muted">ID: {selectedAlert._id}</p>
                        </div>
                        <div className="flex gap-12">
                            <button className="btn btn-ghost btn-sm"><MoreVertical size={16} /></button>
                            {selectedAlert.status !== 'resolved' && (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => onUpdateStatus(selectedAlert._id, 'resolved')}
                                >
                                    <CheckCircle size={14} /> Resolve
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-grid mb-24">
                        <div className="detail-item">
                            <label>Subject</label>
                            <div className="flex items-center gap-8 mt-4">
                                <div className="avatar-sm">{(selectedAlert.user?.name || 'U').substring(0, 1)}</div>
                                <div>
                                    <div className="font-bold">{selectedAlert.user?.name || 'Unknown'}</div>
                                    <div className="text-xs text-muted">{selectedAlert.user?.email || 'No email'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="detail-item">
                            <label>Assignment</label>
                            <div className="flex items-center gap-8 mt-4 relative">
                                <button
                                    className="btn btn-ghost btn-sm w-full justify-between"
                                    onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                                >
                                    <div className="flex items-center gap-8">
                                        <UserPlus size={14} className="text-blue" />
                                        <span className={selectedAlert.assignedAdmin ? 'font-bold' : 'italic text-muted'}>
                                            {selectedAlert.assignedAdmin?.name || 'Assign Responder'}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform ${showAssignDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showAssignDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-4 bg-secondary border border-border rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto">
                                        <button
                                            className="w-full px-12 py-8 text-left text-xs hover:bg-card border-b border-border/50 italic text-muted"
                                            onClick={() => handleAssign(selectedAlert._id, null)}
                                        >
                                            Unassign Responder
                                        </button>
                                        {responders.map(admin => (
                                            <button
                                                key={admin._id}
                                                className="w-full px-12 py-8 text-left text-xs hover:bg-card flex items-center justify-between"
                                                onClick={() => handleAssign(selectedAlert._id, admin._id)}
                                            >
                                                <span>{admin.name}</span>
                                                {selectedAlert.assignedAdmin?._id === admin._id && <CheckCircle size={10} className="text-green" />}
                                            </button>
                                        ))}
                                        {responders.length === 0 && (
                                            <div className="px-12 py-8 text-xs text-muted text-center">No admins found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="detail-section mb-24">
                        <div className="section-title"><MessageSquare size={12} /> Incident Notes</div>
                        <div className="notes-area mt-12">
                            <textarea
                                className="form-input text-xs"
                                rows="3"
                                placeholder="Add technical notes or situational awareness..."
                                value={notes[selectedAlert._id] || ''}
                                onChange={(e) => handleAddNote(selectedAlert._id, e.target.value)}
                            />
                            <button className="btn btn-primary btn-sm mt-8">Save Log</button>
                        </div>
                    </div>

                    <div className="detail-section">
                        <div className="section-title"><FileText size={12} /> Event History</div>
                        <div className="timeline-mini mt-12">
                            <div className="timeline-item-s">
                                <div className="t-dot" />
                                <div className="t-content">
                                    <span className="t-time">{new Date(selectedAlert.createdAt).toLocaleTimeString()}</span>
                                    <span className="t-event">Alert triggered by user via Mobile App</span>
                                </div>
                            </div>
                            {selectedAlert.status === 'resolved' && (
                                <div className="timeline-item-s">
                                    <div className="t-dot dot-green" />
                                    <div className="t-content">
                                        <span className="t-time">{new Date().toLocaleTimeString()}</span>
                                        <span className="t-event">Case resolved by Admin Console</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert-detail-panel empty card items-center justify-center flex flex-col text-muted">
                    <Shield size={48} className="mb-16 opacity-20" />
                    <p>Select an incident to view details and manage case</p>
                </div>
            )}
        </div>
    )
}
