import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, Shield, Eye, EyeOff, Lock, Mail, ArrowRight, Activity, MapPin, Bell } from 'lucide-react'

function AuthVisual() {
    return (
        <div className="auth-visual" style={{ background: 'var(--bg-primary)' }}>
            {/* Animated particles */}
            <div className="particles">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${8 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 8}s`,
                        '--drift': `${(Math.random() - 0.5) * 80}px`,
                        background: ['var(--accent-red)', 'var(--accent-blue)', 'var(--accent-green)'][i % 3],
                    }} />
                ))}
            </div>

            {/* Grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            {/* Glowing orbs */}
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'var(--accent-red)', filter: 'blur(120px)', opacity: 0.1, top: -100, right: -100 }} />
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'var(--accent-blue)', filter: 'blur(100px)', opacity: 0.12, bottom: 0, left: 0 }} />

            {/* Center content */}
            <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: 40 }}>
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                        {[
                            { icon: Activity, color: 'var(--accent-red)', bg: 'var(--accent-red-dim)', label: 'Live Alerts' },
                            { icon: MapPin, color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)', label: 'GPS Tracking' },
                            { icon: Bell, color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', label: 'Instant Notify' },
                        ].map(({ icon: Icon, color, bg, label }) => (
                            <div key={label} style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, maxWidth: 100 }}>
                                <Icon size={22} color={color} />
                                <span style={{ fontSize: '0.65rem', color, fontWeight: 600 }}>{label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
                        Secure. Real-Time. Reliable.
                    </div>
                    <div className="text-sm text-secondary" style={{ lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                        Trusted by security teams worldwide to coordinate emergency responses in critical situations.
                    </div>
                </div>

                {/* Fake terminal-ish live ticker */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', textAlign: 'left', maxWidth: 340, margin: '0 auto' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>● SYSTEM LOG</div>
                    {[
                        { text: '[02:14:33] SOS signal received · Zone A-3', color: 'var(--accent-red)' },
                        { text: '[02:14:28] Unit R-5 dispatched to Zone A-3', color: 'var(--accent-amber)' },
                        { text: '[02:13:15] 248 participants tracked live', color: 'var(--accent-green)' },
                        { text: '[02:12:00] All zones nominal', color: 'var(--text-muted)' },
                    ].map((l, i) => (
                        <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: l.color, padding: '2px 0' }}>{l.text}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    const navigate = useNavigate()
    const [showPw, setShowPw] = useState(false)
    const [role, setRole] = useState('user')

    return (
        <div className="auth-page">
            <div className="auth-left">
                {/* Logo */}
                <div className="flex items-center gap-12 mb-12" style={{ marginBottom: 40 }}>
                    <div className="logo-icon">
                        <Radio size={16} color="white" />
                    </div>
                    <div>
                        <div className="logo-text">PulseNet</div>
                        <div className="logo-sub">Emergency OS</div>
                    </div>
                </div>

                <div className="anim-fade-up">
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>Welcome back</h1>
                    <p className="text-sm text-secondary" style={{ marginBottom: 32 }}>Sign in to access your command dashboard</p>

                    {/* Role Toggle */}
                    <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: 4, display: 'flex', marginBottom: 24 }}>
                        {[
                            { k: 'user', label: 'User', icon: '👤' },
                            { k: 'admin', label: 'Admin', icon: '🛡️' },
                        ].map(({ k, label, icon }) => (
                            <button
                                key={k}
                                onClick={() => setRole(k)}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                                    background: role === k ? (k === 'admin' ? 'var(--accent-red)' : 'var(--accent-blue)') : 'transparent',
                                    color: role === k ? 'white' : 'var(--text-muted)',
                                    fontWeight: 600, fontSize: '0.875rem', transition: 'all var(--transition)',
                                    cursor: 'pointer',
                                }}
                            >{icon} {label}</button>
                        ))}
                    </div>

                    {role === 'admin' && (
                        <div style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20 }}
                            className="flex items-center gap-8">
                            <Shield size={14} color="var(--accent-red)" />
                            <span className="text-xs" style={{ color: 'var(--accent-red)', fontWeight: 500 }}>Administrative access — enhanced audit logging enabled</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-input" type="email" placeholder="you@organization.com" style={{ paddingLeft: 36 }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="flex items-center justify-between">
                                <label className="form-label">Password</label>
                                <button style={{ background: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="••••••••" style={{ paddingLeft: 36, paddingRight: 40 }} />
                                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <input type="checkbox" id="remember" style={{ accentColor: 'var(--accent-blue)' }} />
                            <label htmlFor="remember" className="text-sm text-secondary" style={{ cursor: 'pointer' }}>Keep me signed in</label>
                        </div>

                        <button className={`btn ${role === 'admin' ? 'btn-danger' : 'btn-primary'} btn-lg`} style={{ justifyContent: 'center', marginTop: 4 }}
                            onClick={() => navigate(role === 'admin' ? '/admin' : '/dashboard')}>
                            {role === 'admin' ? <Shield size={16} /> : <ArrowRight size={16} />}
                            Sign In as {role === 'admin' ? 'Admin' : 'User'}
                        </button>
                    </div>

                    <div className="divider" />

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <button style={{ background: 'none', color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/register')}>
                            Register here
                        </button>
                    </p>
                </div>

                <div className="mt-auto" style={{ paddingTop: 32 }}>
                    <div className="flex items-center gap-8 text-xs text-muted">
                        <Lock size={11} />
                        <span>End-to-end encrypted · SOC 2 certified · GDPR compliant</span>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <AuthVisual />
            </div>
        </div>
    )
}
