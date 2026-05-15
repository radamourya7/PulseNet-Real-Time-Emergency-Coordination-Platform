import { useNavigate } from 'react-router-dom'
import {
    Radio, Shield, Zap, MapPin, Bell, Users,
    Activity, Lock, ArrowRight
} from 'lucide-react'

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

            {/* Creative Floating Pill Announcement */}
            <style>{`
                @keyframes floatPill {
                    0% { transform: translate(-50%, 150px) scale(0.9); opacity: 0; }
                    10% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                    90% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, 150px) scale(0.9); opacity: 0; }
                }
                @keyframes floatPillMobile {
                    0% { transform: translateY(100px) scale(0.95); opacity: 0; }
                    10% { transform: translateY(0) scale(1); opacity: 1; }
                    90% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(100px) scale(0.95); opacity: 0; }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
                .creative-pill {
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(10, 12, 15, 0.85);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(59, 130, 246, 0.25);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
                    padding: 12px 24px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 9999;
                    pointer-events: none;
                    animation: floatPill 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                    white-space: nowrap;
                    max-width: 90vw;
                }
                .creative-pill-glow {
                    width: 7px;
                    height: 7px;
                    background: var(--accent-blue);
                    border-radius: 50%;
                    flex-shrink: 0;
                    animation: pulseGlow 2s infinite;
                    box-shadow: 0 0 8px var(--accent-blue);
                }
                .creative-pill-text {
                    color: white;
                    font-size: 0.82rem;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                @media (max-width: 640px) {
                    .creative-pill {
                        bottom: 16px;
                        left: 12px;
                        right: 12px;
                        transform: none !important;
                        white-space: normal;
                        text-align: left;
                        padding: 10px 16px;
                        border-radius: 16px;
                        gap: 10px;
                        animation: floatPillMobile 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                        max-width: none;
                    }
                    .creative-pill-text {
                        font-size: 0.72rem;
                        white-space: normal;
                        overflow: visible;
                        text-overflow: unset;
                        line-height: 1.4;
                    }
                    .custom-tooltip { display: none !important; }
                }
            `}</style>
            <div className="creative-pill">
                <div className="creative-pill-glow"></div>
                <div className="creative-pill-text">
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Decrypting Transmission — </span>
                    Project Oracle A.I. Tactical Core drops <span style={{ color: '#60a5fa', textShadow: '0 0 15px rgba(96,165,250,0.5)' }}>May 23rd</span>
                </div>
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
                <div
                    className="hero-eyebrow anim-fade"
                    style={{ position: 'relative' }}
                    onMouseEnter={(e) => e.currentTarget.querySelector('.custom-tooltip').style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.querySelector('.custom-tooltip').style.opacity = '0'}
                >
                    <div className="status-dot live"></div>
                    Emergency Response Platform ·
                    <span
                        style={{ cursor: 'pointer', fontWeight: 600, marginLeft: '4px' }}
                        onClick={() => navigate('/about')}
                    >
                        v3.0.0
                    </span>

                    <div className="custom-tooltip" style={{
                        position: 'absolute',
                        left: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginLeft: '20px',
                        background: 'rgba(10,12,15,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        width: '280px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 400,
                        textAlign: 'center',
                        lineHeight: '1.5',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s ease',
                        zIndex: 100
                    }}>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                            🔥 Project Apex Released
                        </div>
                        Click to check out the architectural deployment logs on the About Us board.
                    </div>
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
