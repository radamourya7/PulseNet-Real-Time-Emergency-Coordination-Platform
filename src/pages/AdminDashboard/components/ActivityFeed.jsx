import { Bell, Shield, CheckCircle, MapPin, User, AlertCircle } from 'lucide-react'

export default function ActivityFeed({ broadcasts = [] }) {
    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'new-alert':
            case 'alert':
                return <AlertCircle size={14} className="text-red" />
            case 'resolved':
                return <CheckCircle size={14} className="text-green" />
            case 'acknowledged':
                return <Shield size={14} className="text-blue" />
            case 'location-update':
                return <MapPin size={14} className="text-cyan" />
            default:
                return <Bell size={14} className="text-muted" />
        }
    }

    return (
        <div className="activity-feed-card card">
            <div className="flex items-center justify-between mb-16">
                <div className="section-title mb-0">Live Activity Feed</div>
                <div className="status-dot live" />
            </div>

            <div className="activity-list-container">
                {broadcasts.length === 0 ? (
                    <div className="text-center p-24 text-muted italic text-xs">
                        No recent activity recorded.
                    </div>
                ) : (
                    <div className="activity-list">
                        {broadcasts.map((item, i) => (
                            <div key={item.id || i} className="activity-item anim-slide-right" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="activity-icon-wrapper">
                                    {getIcon(item.type)}
                                </div>
                                <div className="activity-content">
                                    <p className="activity-message">{item.message}</p>
                                    <span className="activity-time">
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-16 text-center">
                <button className="text-xs text-blue font-bold hover:underline">View Full Audit Log</button>
            </div>
        </div>
    )
}
