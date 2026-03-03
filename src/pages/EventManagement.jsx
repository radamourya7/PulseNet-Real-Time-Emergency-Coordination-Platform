import { useState } from 'react'
import {
    Calendar, Users, Shield, Clock, MapPin, PlusCircle,
    CheckCircle, Radio, ChevronRight, Hash
} from 'lucide-react'

function Topbar({ onCreateClick }) {
    return (
        <div className="topbar">
            <div>
                <div className="font-semibold" style={{ fontSize: '0.95rem' }}>Events</div>
                <div className="text-xs text-secondary hide-mobile">Manage and join active events</div>
            </div>
            <div className="flex items-center gap-12 ml-auto">
                <span className="text-xs text-muted hide-mobile">3 active events</span>
                <button className="btn btn-primary btn-sm" onClick={onCreateClick}>
                    <PlusCircle size={13} /> <span className="hide-mobile">Create Event</span><span className="show-mobile" style={{ display: 'none' }}>New</span>
                </button>
            </div>
        </div>
    )
}

const events = [
    {
        id: 'EVT-001', name: 'Marathon Safety 2026', status: 'live', type: 'Large Event',
        desc: 'City-wide marathon with safety coordination across 12 zones. 5000+ participants.',
        date: 'Mar 2, 2026', time: '06:00 – 14:00', location: 'Central Park Ring Road',
        participants: 248, capacity: 300, zones: 12, alerts: 3, role: 'joined',
    },
    {
        id: 'EVT-002', name: 'Stadium Concert: Neon Pulse', status: 'upcoming', type: 'Concert',
        desc: 'Large indoor concert with crowd monitoring and emergency exits coordination.',
        date: 'Mar 8, 2026', time: '19:00 – 23:30', location: 'National Arena, Block D',
        participants: 0, capacity: 5000, zones: 8, alerts: 0, role: 'none',
    },
    {
        id: 'EVT-003', name: 'Corporate Summit – Tech West', status: 'live', type: 'Conference',
        desc: 'Multi-floor corporate conference with medical and security units on standby.',
        date: 'Mar 2, 2026', time: '09:00 – 18:00', location: 'Convention Center, Tower B',
        participants: 84, capacity: 200, zones: 4, alerts: 1, role: 'none',
    },
    {
        id: 'EVT-004', name: 'Night Cycling Event', status: 'closed', type: 'Sports',
        desc: 'Evening cycling event across 3 districts. Successfully completed.',
        date: 'Feb 28, 2026', time: '18:00 – 22:00', location: 'District Route 7-B',
        participants: 156, capacity: 200, zones: 6, alerts: 0, role: 'admin',
    },
]

function statusStyle(s) {
    if (s === 'live') return { badge: 'badge-red', label: 'LIVE' }
    if (s === 'upcoming') return { badge: 'badge-amber', label: 'UPCOMING' }
    return { badge: 'badge-blue', label: 'CLOSED' }
}

function ProgressBar({ value, max, color = 'var(--accent-blue)' }) {
    const pct = Math.round((value / max) * 100)
    return (
        <div style={{ background: 'var(--border)', borderRadius: 99, height: 4, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
        </div>
    )
}

function CreateEventModal({ onClose }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="card anim-scale" style={{
                width: '100%', maxWidth: 520,
                maxHeight: '90vh', overflowY: 'auto',
                borderColor: 'var(--border-bright)',
                borderRadius: '20px 20px 0 0',
                padding: '24px 20px 40px'
            }}>
                {/* Drag handle */}
                <div style={{ width: 36, height: 4, background: 'var(--border-bright)', borderRadius: 99, margin: '0 auto 20px' }} />
                <div className="flex items-center gap-12 mb-20">
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--accent-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlusCircle size={16} color="var(--accent-blue)" />
                    </div>
                    <div className="font-bold" style={{ fontSize: '1rem' }}>Create New Event</div>
                    <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-group">
                        <label className="form-label">Event Name *</label>
                        <input className="form-input" placeholder="e.g. City Marathon Safety 2026" />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Event Type</label>
                            <select className="form-input" style={{ padding: '10px 14px' }}>
                                <option>Conference</option><option>Concert</option>
                                <option>Sports</option><option>Festival</option><option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Capacity</label>
                            <input className="form-input" type="number" placeholder="500" />
                        </div>
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Start Date & Time</label>
                            <input className="form-input" type="datetime-local" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date & Time</label>
                            <input className="form-input" type="datetime-local" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input className="form-input" placeholder="Venue name and address" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input" rows={3} placeholder="Brief description..." style={{ resize: 'vertical' }} />
                    </div>
                    <hr className="divider" />
                    <div className="flex items-center gap-12">
                        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                            <PlusCircle size={14} /> Create Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function JoinModal({ event, onClose }) {
    if (!event) return null
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div className="card anim-scale" style={{ width: '100%', maxWidth: 480, borderColor: 'var(--border-bright)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
                <div style={{ width: 36, height: 4, background: 'var(--border-bright)', borderRadius: 99, margin: '0 auto 20px' }} />
                <div className="font-bold mb-4" style={{ fontSize: '1rem' }}>Join Event</div>
                <div className="text-sm text-secondary mb-20">{event.name}</div>
                <div className="form-group mb-16">
                    <label className="form-label">Event Join Code</label>
                    <input className="form-input" placeholder="e.g. MARA-2026-B4" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
                <div className="form-group mb-20">
                    <label className="form-label">Your Role</label>
                    <select className="form-input" style={{ padding: '10px 14px' }}>
                        <option>Participant</option>
                        <option>Volunteer</option>
                    </select>
                </div>
                <div className="flex items-center gap-12">
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
                    <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }}>
                        <CheckCircle size={14} /> Join Event
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function EventManagement() {
    const [showCreate, setShowCreate] = useState(false)
    const [joinEvent, setJoinEvent] = useState(null)

    return (
        <>
            <Topbar onCreateClick={() => setShowCreate(true)} />
            <div className="content-area">
                {/* Stats Row */}
                <div className="grid-4 mb-24">
                    {[
                        { label: 'Active Events', value: '2', icon: Radio, color: 'var(--accent-red)', bg: 'var(--accent-red-dim)' },
                        { label: 'Participants', value: '332', icon: Users, color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)' },
                        { label: 'Open Alerts', value: '4', icon: Shield, color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
                        { label: 'Completed', value: '18', icon: CheckCircle, color: 'var(--accent-green)', bg: 'var(--accent-green-dim)' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="card anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={18} color={color} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color }}>{value}</div>
                                <div className="text-xs text-muted" style={{ marginTop: 2 }}>{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Events List */}
                <div className="section-title">All Events</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {events.map((ev, i) => {
                        const s = statusStyle(ev.status)
                        return (
                            <div key={ev.id} className={`card anim-fade-up delay-${i + 1}`}
                                style={{ borderColor: ev.role === 'joined' ? 'rgba(59,130,246,0.4)' : ev.role === 'admin' ? 'rgba(139,92,246,0.3)' : 'var(--border)' }}>

                                {/* Card inner — uses mobile-responsive class */}
                                <div className="event-card-inner" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                                    {/* Icon */}
                                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Calendar size={18} color="var(--text-muted)" />
                                    </div>

                                    {/* Main content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="flex items-center gap-8 mb-8 flex-wrap">
                                            <div className="font-bold" style={{ fontSize: '0.95rem' }}>{ev.name}</div>
                                            <span className={`badge ${s.badge}`}>
                                                {ev.status === 'live' && <div className="status-dot live" />}
                                                {s.label}
                                            </span>
                                            <span className="badge badge-blue">{ev.type}</span>
                                            {ev.role === 'joined' && <span className="badge badge-green"><CheckCircle size={9} /> Joined</span>}
                                            {ev.role === 'admin' && <span className="badge" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(139,92,246,0.3)' }}><Shield size={9} /> Admin</span>}
                                        </div>
                                        <div className="text-sm text-secondary mb-12" style={{ lineHeight: 1.6 }}>{ev.desc}</div>

                                        <div className="flex items-center gap-16 flex-wrap mb-12">
                                            {[
                                                { icon: Clock, text: `${ev.date} · ${ev.time}` },
                                                { icon: MapPin, text: ev.location },
                                                { icon: Hash, text: `${ev.zones} zones` },
                                            ].map(({ icon: Icon, text }) => (
                                                <div key={text} className="flex items-center gap-6 text-xs text-muted">
                                                    <Icon size={11} /> {text}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-12 mb-8">
                                            <Users size={11} color="var(--text-muted)" />
                                            <span className="text-xs text-muted">{ev.participants} / {ev.capacity} participants</span>
                                            {ev.alerts > 0 && <span className="badge badge-red" style={{ marginLeft: 4 }}>{ev.alerts} alerts</span>}
                                        </div>
                                        <ProgressBar value={ev.participants} max={ev.capacity}
                                            color={ev.participants / ev.capacity > 0.8 ? 'var(--accent-red)' : 'var(--accent-blue)'} />
                                    </div>

                                    {/* Actions — responsive class */}
                                    <div className="event-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minWidth: 110 }}>
                                        {ev.status !== 'closed' && ev.role === 'none' && (
                                            <button className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }} onClick={() => setJoinEvent(ev)}>
                                                <CheckCircle size={12} /> Join
                                            </button>
                                        )}
                                        {ev.role === 'joined' && (
                                            <button className="btn btn-danger btn-sm" style={{ justifyContent: 'center' }}>
                                                <Radio size={12} /> View Live
                                            </button>
                                        )}
                                        {ev.role === 'admin' && (
                                            <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }}>
                                                <Shield size={12} /> Manage
                                            </button>
                                        )}
                                        <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }}>
                                            <ChevronRight size={12} /> Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Create CTA */}
                <div className="card anim-fade-up" style={{ marginTop: 14, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer', padding: '32px 20px' }} onClick={() => setShowCreate(true)}>
                    <PlusCircle size={28} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <div className="font-semibold mb-4">Create a New Event</div>
                    <div className="text-xs text-muted">Set up a new coordination event with zones, capacity, and alert configurations</div>
                </div>
            </div>

            {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} />}
            {joinEvent && <JoinModal event={joinEvent} onClose={() => setJoinEvent(null)} />}
        </>
    )
}
