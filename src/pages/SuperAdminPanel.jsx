import { useState, useEffect } from 'react'
import { Shield, CheckCircle, XCircle, UserPlus, Users, Clock, Mail, Trash2, RefreshCw, ChevronDown } from 'lucide-react'
import { apiFetch, getTokenPayload, logout } from '../api'

function statusBadge(status) {
    if (status === 'approved') return <span className="badge badge-green"><CheckCircle size={9} /> Approved</span>
    if (status === 'rejected') return <span className="badge badge-red"><XCircle size={9} /> Rejected</span>
    if (status === 'pending') return <span className="badge badge-amber"><Clock size={9} /> Pending</span>
    return <span className="badge badge-green"><CheckCircle size={9} /> Approved</span>
}

function roleBadge(role) {
    if (role === 'admin') return <span className="badge badge-red"><Shield size={9} /> Admin</span>
    return <span className="badge badge-blue"><Users size={9} /> User</span>
}

function CreateAdminModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleCreate = async () => {
        if (!form.name || !form.email || !form.password) { setError('All fields required'); return }
        setError(''); setLoading(true)
        try {
            await apiFetch('/api/admin/users', { method: 'POST', body: form })
            onCreated(); onClose()
        } catch (e) { setError(e.message) } finally { setLoading(false) }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div className="card" style={{ width: '100%', maxWidth: 480, padding: '24px' }}>
                <div className="flex items-center justify-between mb-20">
                    <h2 className="text-xl font-bold">Create New User</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                {error && <div style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: 'var(--accent-red)', fontSize: '0.8rem' }}>⚠️ {error}</div>}

                <div className="flex flex-col gap-12">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" placeholder="Enter name" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select className="form-input" style={{ padding: '10px 14px' }} value={form.role} onChange={e => set('role', e.target.value)}>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-10 mt-12">
                        <button className="btn btn-ghost flex-1" onClick={onClose}>Cancel</button>
                        <button className="btn btn-danger flex-1" onClick={handleCreate} disabled={loading}>
                            {loading ? 'Processing...' : 'Create Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SuperAdminPanel() {
    const [users, setUsers] = useState([])
    const [admins, setAdmins] = useState([])   // for assign dropdown
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [filter, setFilter] = useState('pending')

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [u, a] = await Promise.all([
                apiFetch('/api/admin/users'),
                apiFetch('/api/admin/admins'),
            ])
            setUsers(u)
            setAdmins(a)
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    useEffect(() => { fetchAll() }, [])

    // ── Status actions ────────────────────────────────────────────────────────
    const approve = async (id) => {
        await apiFetch(`/api/admin/users/${id}/approve`, { method: 'PATCH' })
        setUsers(u => u.map(x => x._id === id ? { ...x, status: 'approved' } : x))
    }
    const reject = async (id) => {
        await apiFetch(`/api/admin/users/${id}/reject`, { method: 'PATCH' })
        setUsers(u => u.map(x => x._id === id ? { ...x, status: 'rejected' } : x))
    }
    const deleteUser = async (id) => {
        if (!confirm('Delete this user permanently?')) return
        await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' })
        setUsers(u => u.filter(x => x._id !== id))
    }

    // ── Role toggle (user ↔ admin) — real-time optimistic update ─────────────
    const toggleRole = async (u) => {
        const newRole = u.role === 'admin' ? 'user' : 'admin'
        // Optimistic update
        setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x))
        try {
            await apiFetch(`/api/admin/users/${u._id}/role`, { method: 'PATCH', body: { role: newRole } })
            // Also refresh admin list for the dropdown
            const a = await apiFetch('/api/admin/admins')
            setAdmins(a)
        } catch (e) {
            // Rollback on error
            setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: u.role } : x))
        }
    }

    // ── Assign user to admin ───────────────────────────────────────────────────
    const assignAdmin = async (userId, adminId) => {
        setUsers(prev => prev.map(x => {
            if (x._id !== userId) return x
            const admin = admins.find(a => a._id === adminId) || null
            return { ...x, assignedAdmin: admin }
        }))
        await apiFetch(`/api/admin/users/${userId}/assign`, { method: 'PATCH', body: { adminId: adminId || null } })
    }

    const pendingCount = users.filter(u => u.status === 'pending').length
    const effectiveStatus = (u) => u.status || 'approved'
    const filtered = filter === 'all' ? users : users.filter(u => effectiveStatus(u) === filter)

    return (
        <>
            {/* Topbar */}
            <div className="topbar">
                <div className="flex items-center gap-10">
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--accent-red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={16} color="var(--accent-red)" />
                    </div>
                    <div>
                        <div className="font-bold">Super Admin Panel</div>
                        <div className="text-xs text-muted">Manage system users and assignments</div>
                    </div>
                    {pendingCount > 0 && <span className="badge badge-red" style={{ marginLeft: 8 }}>{pendingCount} PENDING</span>}
                </div>
                <div className="flex items-center gap-10 ml-auto">
                    <button className="btn btn-ghost btn-sm" onClick={fetchAll} title="Refresh Data"><RefreshCw size={14} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => setShowCreate(true)}>
                        <UserPlus size={14} /> <span className="hide-mobile">CREATE USER</span>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
                </div>
            </div>

            <div className="content-area">
                {/* Stats */}
                <div className="grid-4 mb-24">
                    {[
                        { label: 'Pending Users', value: users.filter(u => u.status === 'pending').length, color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', icon: Clock },
                        { label: 'Approved Users', value: users.filter(u => effectiveStatus(u) === 'approved').length, color: 'var(--accent-green)', bg: 'var(--accent-green-dim)', icon: CheckCircle },
                        { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'var(--accent-red)', bg: 'var(--accent-red-dim)', icon: Shield },
                        { label: 'Total Users', value: users.length, color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)', icon: Users },
                    ].map(({ label, value, color, bg, icon: Icon }) => (
                        <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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

                {/* Filter tabs */}
                <div className="flex items-center gap-8 mb-16" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, overflowX: 'auto' }}>
                    {[
                        { k: 'pending', label: 'Pending' },
                        { k: 'approved', label: 'Approved' },
                        { k: 'rejected', label: 'Rejected' },
                        { k: 'all', label: 'All Users' },
                    ].map(({ k, label }) => (
                        <button key={k} onClick={() => setFilter(k)} style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 12px', whiteSpace: 'nowrap',
                            fontSize: '0.82rem', fontWeight: filter === k ? 700 : 400,
                            color: filter === k ? 'var(--text-primary)' : 'var(--text-muted)',
                            borderBottom: filter === k ? '2px solid var(--accent-blue)' : '2px solid transparent',
                        }}>{label}</button>
                    ))}
                </div>

                {/* User list */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <RefreshCw size={20} style={{ margin: '0 auto 8px', display: 'block', animation: 'spin 2s linear infinite' }} />Loading Users...
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <CheckCircle size={24} style={{ margin: '0 auto 8px', display: 'block' }} color="var(--accent-green)" />
                        No members found in this category
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {filtered.map(u => (
                            <div key={u._id} className="card" style={{
                                borderColor: effectiveStatus(u) === 'pending' ? 'rgba(245,158,11,0.3)' : effectiveStatus(u) === 'rejected' ? 'rgba(239,68,68,0.2)' : 'var(--border)'
                            }}>
                                <div className="flex items-center gap-12" style={{ flexWrap: 'wrap' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: u.role === 'admin' ? 'var(--accent-red-dim)' : 'var(--accent-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem', fontBold: true, color: u.role === 'admin' ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
                                        {u.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="font-semibold" style={{ fontSize: '0.9rem' }}>{u.name}</div>
                                        <div className="flex items-center gap-6" style={{ marginTop: 2 }}>
                                            <Mail size={10} color="var(--text-muted)" />
                                            <span className="text-xs text-muted">{u.email}</span>
                                        </div>
                                        <div className="flex items-center gap-6" style={{ marginTop: 5 }}>
                                            {statusBadge(u.status)}
                                            {roleBadge(u.role)}
                                            <span className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        {effectiveStatus(u) === 'pending' && <>
                                            <button className="btn btn-success btn-sm" onClick={() => approve(u._id)}><CheckCircle size={12} /> Approve</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => reject(u._id)}><XCircle size={12} /> Reject</button>
                                        </>}
                                        {effectiveStatus(u) === 'approved' && u.role !== 'admin' && (
                                            <button className="btn btn-ghost btn-sm" onClick={() => reject(u._id)}><XCircle size={12} /> Revoke</button>
                                        )}
                                        {effectiveStatus(u) === 'rejected' && (
                                            <button className="btn btn-success btn-sm" onClick={() => approve(u._id)}><CheckCircle size={12} /> Re-approve</button>
                                        )}

                                        <button className={`btn btn-sm ${u.role === 'admin' ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleRole(u)}>
                                            <Shield size={12} /> {u.role === 'admin' ? '→ User' : '→ Admin'}
                                        </button>

                                        <button className="btn btn-ghost btn-sm" onClick={() => deleteUser(u._id)} style={{ color: 'var(--accent-red)' }}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>

                                {u.role === 'user' && (
                                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                        <span className="text-xs text-muted" style={{ minWidth: 100 }}>Assigned Admin:</span>
                                        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                                            <select
                                                className="form-input"
                                                style={{ padding: '7px 32px 7px 12px', fontSize: '0.82rem', appearance: 'none', cursor: 'pointer' }}
                                                value={u.assignedAdmin?._id || u.assignedAdmin || ''}
                                                onChange={e => assignAdmin(u._id, e.target.value || null)}
                                            >
                                                <option value="">— Unassigned —</option>
                                                {admins.map(a => (
                                                    <option key={a._id} value={a._id}>{a.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreate && <CreateAdminModal onClose={() => setShowCreate(false)} onCreated={fetchAll} />}
        </>
    )
}
