import { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function makePinIcon(sev) {
    const color = sev === 'crit' ? '#ef4444' : sev === 'warn' ? '#f59e0b' : '#22c55e'
    const ping = sev === 'crit'
        ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${color};opacity:.3;animation:ping 1.5s infinite;"></div>` : ''
    return L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 0 4px ${color}33;position:relative;">${ping}</div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    })
}

export default function LiveMap({ alerts, selectedId, onSelectAlert }) {
    const mapRef = useRef(null)
    const containerRef = useRef(null)
    const markersRef = useRef({})

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return
        mapRef.current = L.map(containerRef.current, { center: [28.6139, 77.2090], zoom: 11, zoomControl: false })
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© CARTO'
        }).addTo(mapRef.current)
        L.control.zoom({ position: 'topright' }).addTo(mapRef.current)
    }, [])

    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        // Sync markers
        const seen = new Set()
        alerts?.forEach(a => {
            const { lat, lng } = a.location || {}
            if (!lat || !lng) return
            seen.add(a._id)

            const sev = a.status === 'resolved' ? 'safe' : (a.type === 'panic' ? 'crit' : 'warn')

            if (markersRef.current[a._id]) {
                markersRef.current[a._id].setLatLng([lat, lng])
                markersRef.current[a._id].setIcon(makePinIcon(sev))
            } else {
                const m = L.marker([lat, lng], { icon: makePinIcon(sev) })
                    .addTo(map)
                    .bindPopup(`<b>${a.user?.name || 'User'}</b><br/>${a.type} · ${a.status}`)
                m.on('click', () => onSelectAlert && onSelectAlert(a))
                markersRef.current[a._id] = m
            }
        })

        // Remove old
        Object.keys(markersRef.current).forEach(id => {
            if (!seen.has(id)) {
                map.removeLayer(markersRef.current[id])
                delete markersRef.current[id]
            }
        })
    }, [alerts, onSelectAlert])

    useEffect(() => {
        if (selectedId && markersRef.current[selectedId]) {
            const m = markersRef.current[selectedId]
            mapRef.current?.flyTo(m.getLatLng(), 15, { duration: 1 })
            m.openPopup()
        }
    }, [selectedId])

    return (
        <div className="adm-map-container card-sm p-0 overflow-hidden relative" ref={containerRef} style={{ height: '500px' }}>
            <div className="absolute bottom-16 right-16 z-[1000] flex flex-col gap-8 bg-card/80 backdrop-blur-md p-12 rounded-lg border border-border shadow-xl">
                <div className="text-[10px] font-black tracking-widest text-muted mb-4">GEOSPATIAL KEY</div>
                <div className="flex items-center gap-12 text-[11px] font-bold">
                    <span className="w-8 h-8 rounded-full bg-red shadow-red-glow" />
                    <span className="text-secondary">CRITICAL INCIDENT</span>
                </div>
                <div className="flex items-center gap-12 text-[11px] font-bold">
                    <span className="w-8 h-8 rounded-full bg-amber" />
                    <span className="text-secondary">ELEVATED WARNING</span>
                </div>
                <div className="flex items-center gap-12 text-[11px] font-bold">
                    <span className="w-8 h-8 rounded-full bg-green" />
                    <span className="text-secondary">ASSET SECURED</span>
                </div>
            </div>

            <div className="absolute top-16 left-16 z-[1000] bg-blue-dim/20 backdrop-blur-sm px-12 py-6 rounded border border-blue/20 flex items-center gap-8">
                <div className="status-dot live" />
                <span className="text-[9px] font-black tracking-[2px] text-blue">MAP CLUSTERS ACTIVE</span>
            </div>
        </div>
    )
}
