import { useNavigate } from 'react-router-dom'
import {
    Radio, Shield, Zap, MapPin, Bell, Users,
    Activity, Lock, ArrowRight
} from 'lucide-react'
import AdBanner from '../components/AdBanner'

function Particles() {
    const count = 20
    return (
        <div className="particles">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${8 + Math.random() * 12}s`,
                        animationDelay: `${Math.random() * 8}s`,
                        '--drift': `${(Math.random() - 0.5) * 100}px`,
                        background: i % 3 === 0 ? 'var(--accent-red)' : i % 3 === 1 ? 'var(--accent-blue)' : 'var(--accent-green)',
                        width: `${1 + Math.random() * 2}px`,
                        height: `${1 + Math.random() * 2}px`,
                    }}
                />
            ))}
        </div>
    )
}

const features = [
    { icon: MapPin, color: '#ef4444', bg: 'var(--accent-red-dim)', title: 'Live Location Tracking', desc: 'Real-time GPS tracking for all participants with 2-second update intervals on a live map.' },
    { icon: Bell, color: '#f59e0b', bg: 'var(--accent-amber-dim)', title: 'Instant Alert System', desc: 'Multi-tier alert propagation from panic button to command center in under 500ms.' },
    { icon: Shield, color: '#3b82f6', bg: 'var(--accent-blue-dim)', title: 'Role-Based Access', desc: 'Granular permissions for admins, coordinators, and field responders.' },
    { icon: Radio, color: '#22c55e', bg: 'var(--accent-green-dim)', title: 'Real-Time Comms', desc: 'WebSocket-powered live status updates, synchronized across all connected terminals.' },
    { icon: Activity, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', title: 'Incident Timeline', desc: 'Immutable audit trail for every action, location update, and status change.' },
    { icon: Users, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', title: 'Event Coordination', desc: 'Manage multiple concurrent events with isolated participant groups and channels.' },
]

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="landing-page">
            {/* Animated background */}
            <div className="landing-bg">
                <div className="landing-orb orb-red"></div>
                <div className="landing-orb orb-blue"></div>
                <div className="landing-orb orb-purple"></div>
                <Particles />
                {/* Grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* Nav */}
            <nav className="landing-nav">
                <div className="flex items-center gap-12">
                    <div className="logo-icon">
                        <Radio size={16} color="white" />
                    </div>
                    <div>
                        <div className="logo-text">PulseNet</div>
                    </div>
                    <button
                        className="btn btn-ghost btn-sm hide-mobile"
                        style={{ marginLeft: '12px', color: 'var(--accent-red)' }}
                        onClick={() => navigate('/join-dev')}
                    >
                        Join Dev Team
                    </button>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-8 hide-mobile">
                        <div className="status-dot live"></div>
                        <span className="text-sm text-secondary">System Operational</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn btn-danger btn-sm" onClick={() => navigate('/register')}>Get Started</button>
                </div>
            </nav>

            {/* Hero */}
            <section className="landing-hero">
                <div className="hero-eyebrow anim-fade">
                    <div className="status-dot live"></div>
                    Emergency Response Platform · v2.4.1
                </div>

                <h1 className="hero-title anim-fade-up delay-1">
                    Real-Time Emergency<br />
                    <span>Coordination at Scale</span>
                </h1>

                <p className="hero-desc anim-fade-up delay-2">
                    A unified command platform for live location tracking, instant alerts, and seamless coordination during critical events — built for security teams that can't afford downtime.
                </p>

                <div className="hero-buttons anim-fade-up delay-3">
                    <button className="btn btn-danger btn-lg" onClick={() => navigate('/register')}>
                        <Zap size={18} />
                        Get Started
                    </button>
                    <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
                        Sign In
                        <ArrowRight size={18} />
                    </button>
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                    <AdBanner
                        atOptions={{
                            'key': '98fb135b1a06771ff53237f7356bf1c7',
                            'format': 'iframe',
                            'height': 300,
                            'width': 160,
                            'params': {}
                        }}
                        scriptUrl="https://www.highperformanceformat.com/98fb135b1a06771ff53237f7356bf1c7/invoke.js"
                    />
                </div>

                {/* Stats */}
                <div className="hero-stats anim-fade-up delay-4">
                    {[
                        { num: '2.4s', label: 'Avg Response Time', color: 'var(--accent-green)' },
                        { num: '99.97%', label: 'Uptime SLA', color: 'var(--accent-blue)' },
                        { num: '10k+', label: 'Active Users', color: 'var(--accent-amber)' },
                        { num: 'E2E', label: 'Encrypted', color: 'var(--accent-purple)' },
                    ].map(({ num, label, color }) => (
                        <div key={label} className="hero-stat">
                            <div className="hero-stat-num" style={{ color }}>{num}</div>
                            <div className="hero-stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <AdBanner
                    atOptions={{
                        'key': '0071efe9fd792b358f3320cadcb877d1',
                        'format': 'iframe',
                        'height': 60,
                        'width': 468,
                        'params': {}
                    }}
                    scriptUrl="https://www.highperformanceformat.com/0071efe9fd792b358f3320cadcb877d1/invoke.js"
                />
            </div>

            {/* Features */}
            <div className="features-grid">
                {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
                    <div key={title} className={`feature-card anim-fade-up delay-${(i % 4) + 1}`}>
                        <div className="feature-icon" style={{ background: bg }}>
                            <Icon size={20} color={color} />
                        </div>
                        <div className="font-semibold mb-8" style={{ fontSize: '0.95rem' }}>{title}</div>
                        <div className="text-sm text-secondary" style={{ lineHeight: '1.7' }}>{desc}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', borderTop: '1px solid var(--border)', background: 'rgba(10,12,15,0.4)' }}>
                <AdBanner
                    atOptions={{
                        'key': '0071efe9fd792b358f3320cadcb877d1',
                        'format': 'iframe',
                        'height': 60,
                        'width': 468,
                        'params': {}
                    }}
                    scriptUrl="https://www.highperformanceformat.com/0071efe9fd792b358f3320cadcb877d1/invoke.js"
                />
            </div>

            {/* Footer bar */}
            <div style={{
                borderTop: '1px solid var(--border)', padding: '16px 48px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(10,12,15,0.8)', backdropFilter: 'blur(20px)',
                position: 'relative', zIndex: 5
            }}>
                <div className="flex items-center gap-8">
                    <Lock size={12} color="var(--text-muted)" />
                    <span className="text-xs text-muted">End-to-end encrypted · SOC 2 Type II · GDPR compliant</span>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <AdBanner
                        id="container-705cbac46b18dbd5f76ccbcd95be60a9"
                        scriptUrl="https://pl29003862.profitablecpmratenetwork.com/705cbac46b18dbd5f76ccbcd95be60a9/invoke.js"
                    />
                </div>
                <div className="flex items-center gap-8">
                    <span
                        className="text-xs cursor-pointer transition-all hover:scale-105 show-mobile"
                        style={{
                            color: 'var(--accent-red)',
                            fontWeight: 600,
                            padding: '4px 10px',
                            background: 'var(--accent-red-dim)',
                            borderRadius: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            marginRight: '8px',
                            display: 'none' /* Will be shown by index.css .show-mobile */
                        }}
                        onClick={() => navigate('/join-dev')}
                    >
                        Join Dev Team
                    </span>
                    <span
                        className="text-xs cursor-pointer transition-all hover:scale-105"
                        style={{
                            color: 'var(--accent-blue)',
                            fontWeight: 600,
                            padding: '4px 10px',
                            background: 'var(--accent-blue-dim)',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}
                        onClick={() => navigate('/about')}
                    >
                        About Developer
                    </span>
                    <span className="text-xs text-muted">© 2026 PulseNet Systems. All rights reserved.</span>
                </div>
            </div>
        </div >
    )
}
