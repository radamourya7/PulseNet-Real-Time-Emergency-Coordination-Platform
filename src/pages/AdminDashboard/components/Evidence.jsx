import { Upload, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react'

export default function Evidence({ alerts }) {
    // Aggregate all evidence from all alerts
    const evidenceList = alerts?.reduce((acc, alert) => {
        if (alert.evidence && alert.evidence.length > 0) {
            alert.evidence.forEach(e => acc.push({ ...e, alertId: alert._id, user: alert.user?.name }))
        }
        return acc
    }, []) || []

    return (
        <div className="evidence-section">
            <div className="upload-zone mb-24">
                <Upload size={40} className="text-blue mb-8" />
                <div className="font-bold text-lg">Case Evidence Repository</div>
                <p className="text-muted text-sm">System automatically archives media shared by users during active alerts.</p>
                <button className="btn btn-ghost btn-sm mt-8" onClick={() => alert('Evidence upload will be connected in next phase')}>Manual Upload</button>
            </div>

            <div className="section-title mb-16">All Attached Evidence ({evidenceList.length})</div>
            {evidenceList.length === 0 ? (
                <div className="card text-center p-24 text-muted border-dashed">
                    No media evidence has been submitted yet.
                </div>
            ) : (
                <div className="grid-4">
                    {evidenceList.map((item, i) => (
                        <div key={i} className="card card-sm">
                            <div style={{ height: 120, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                {item.url && (item.url.startsWith('data:image') || item.url.match(/\.(jpeg|jpg|gif|png)$/) != null) ? (
                                    <img src={item.url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon size={32} className="text-muted" />
                                )}
                                <a href={item.url} target="_blank" rel="noreferrer" className="absolute top-8 right-8 text-blue hover:scale-110 transition-transform bg-black/50 p-4 rounded-full">
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            <div className="mt-8">
                                <div className="text-xs font-bold truncate">File: {item.url?.startsWith('data:') ? 'Captured Image' : (item.url?.split('/').pop() || 'Untitled')}</div>
                                <div className="flex justify-between mt-4">
                                    <span className="text-xs text-blue">By: {item.user || 'Unknown'}</span>
                                    <span className="text-xs text-muted">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
