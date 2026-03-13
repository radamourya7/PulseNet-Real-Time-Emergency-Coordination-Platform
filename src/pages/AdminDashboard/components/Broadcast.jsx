import { useState } from 'react'
import { Send, History, Bell } from 'lucide-react'

export default function Broadcast({ socket, broadcasts, user }) {
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('Safety Advisory')

    const handleSend = () => {
        if (!msg.trim() || !socket) return
        socket.emit('broadcast-message', {
            message: msg,
            type,
            from: user?.name || 'Admin'
        })
        setMsg('')
    }

    return (
        <div className="adm-grid-2">
            <div className="card">
                <div className="section-title flex items-center gap-8"><Send size={14} /> Compose Broadcast</div>
                <div className="flex flex-col gap-16 mt-16">
                    <div className="form-group">
                        <label className="form-label">Alert Category</label>
                        <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                            <option>Safety Advisory</option>
                            <option>Weather Warning</option>
                            <option>Security Alert</option>
                            <option>System Update</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message Content</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            placeholder="Type your message here..."
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                        ></textarea>
                    </div>
                    <button className="btn btn-danger w-full" onClick={handleSend} disabled={!msg.trim()}>
                        <Bell size={16} /> Dispatch Globally
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="section-title flex items-center gap-8"><History size={14} /> Broadcast Log</div>
                <div className="flex flex-col gap-12 mt-16" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {broadcasts.length === 0 && <div className="text-center p-24 text-muted">No recent activity</div>}
                    {broadcasts.map((b, i) => (
                        <div key={b._id || i} className="adm-timeline-content" style={{ padding: '12px' }}>
                            <div className="flex justify-between items-center mb-4">
                                <span className={`adm-badge ${b.isSystem ? 'badge-amber' : 'badge-red'}`}>{b.type || 'Alert'}</span>
                                <span className="text-xs text-muted">{new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-sm font-medium">{b.message}</p>
                            {!b.isSystem && <div className="text-xs text-muted mt-4">— Sent by {b.from}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
