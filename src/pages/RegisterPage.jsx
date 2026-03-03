import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle, ArrowRight, Clock } from 'lucide-react'
import { API_BASE } from '../api'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [showPw, setShowPw] = useState(false)
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [registered, setRegistered] = useState(false)   // show pending screen

    // Form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [organization, setOrganization] = useState('')

    // ── Password strength (0–4) ───────────────────────────────────────────────
    const pwStrength = (() => {
        if (!password) return 0
        let score = 0
        if (password.length >= 8) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        return score
    })()
    const pwLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength]
    const pwColor = ['', 'var(--accent-red)', 'var(--accent-amber)', 'var(--accent-blue)', 'var(--accent-green)'][pwStrength]

    const handleRegister = async () => {
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    password,
                    // role is always assigned server-side as 'user'
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Registration failed')
                return
            }
            // Show the pending approval screen
            setRegistered(true)
        } catch {
            setError('Cannot connect to server. Is the backend running?')
        } finally {
            setLoading(false)
        }
    }

    // ── Pending approval success screen ──────────────────────────────────────────
    if (registered) {
        return (
            <div className="auth-page">
                <div className="auth-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-amber-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Clock size={32} color="var(--accent-amber)" />
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 10 }}>Account Created!</h1>
                    <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 320, marginBottom: 24 }}>
                        Your account is <strong style={{ color: 'var(--accent-amber)' }}>pending superadmin approval</strong>.
                        You'll be able to sign in once an administrator approves your request.
                    </p>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 28, width: '100%', maxWidth: 320 }}>
                        <div className="text-xs text-muted mb-4">Registered email</div>
                        <div className="font-semibold" style={{ fontSize: '0.9rem' }}>{email}</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ justifyContent: 'center', width: '100%', maxWidth: 320 }}>
                        <ArrowRight size={16} /> Go to Sign In
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-left" style={{ overflowY: 'auto' }}>
                {/* Logo */}
                <div className="flex items-center gap-12" style={{ marginBottom: 36 }}>
                    <div className="logo-icon"><Radio size={16} color="white" /></div>
                    <div>
                        <div className="logo-text">PulseNet</div>
                        <div className="logo-sub">Emergency OS</div>
                    </div>
                </div>

                <div className="anim-fade-up">
                    <h1 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>Create Account</h1>
                    <p className="text-sm text-secondary" style={{ marginBottom: 28 }}>Join the emergency coordination network</p>

                    {/* Steps indicator */}
                    <div className="flex items-center gap-8 mb-24">
                        {[1, 2].map((s) => (
                            <div key={s} className="flex items-center gap-8">
                                <div style={{
                                    width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: step >= s ? 'var(--accent-blue)' : 'var(--bg-card)',
                                    border: `1px solid ${step >= s ? 'var(--accent-blue)' : 'var(--border)'}`,
                                    fontSize: '0.72rem', fontWeight: 700, color: step >= s ? 'white' : 'var(--text-muted)',
                                    transition: 'all 0.3s ease'
                                }}>{step > s ? <CheckCircle size={13} /> : s}</div>
                                <span className="text-xs" style={{ color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step >= s ? 600 : 400 }}>
                                    {s === 1 ? 'Account Info' : 'Confirm & Submit'}
                                </span>
                                {s < 2 && <div style={{ flex: 1, height: 1, background: step > s ? 'var(--accent-blue)' : 'var(--border)', width: 40, transition: 'all 0.3s ease' }} />}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: 'var(--accent-red)', fontSize: '0.8rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input className="form-input" placeholder="John" style={{ paddingLeft: 32 }} value={firstName} onChange={e => setFirstName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name *</label>
                                    <input className="form-input" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input className="form-input" type="email" placeholder="you@organization.com" style={{ paddingLeft: 32 }} value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input className="form-input" type="tel" placeholder="+1 (555) 000-0000" style={{ paddingLeft: 32 }} value={phone} onChange={e => setPhone(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" style={{ paddingLeft: 32, paddingRight: 36 }} value={password} onChange={e => setPassword(e.target.value)} />
                                    <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                                        {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center' }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{
                                            flex: 1, height: 3, borderRadius: 2,
                                            background: i <= pwStrength ? pwColor : 'var(--border)',
                                            transition: 'all 0.3s'
                                        }} />
                                    ))}
                                    {pwLabel && <span style={{ fontSize: '0.65rem', color: pwColor, marginLeft: 4, whiteSpace: 'nowrap' }}>{pwLabel}</span>}
                                </div>
                            </div>
                            <button className="btn btn-primary btn-lg" style={{ justifyContent: 'center', marginTop: 4 }} onClick={() => setStep(2)}>
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Account type info — users are always registered as Field Users */}
                            <div className="card" style={{ background: 'var(--accent-blue-dim)', borderColor: 'rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <User size={16} color="var(--accent-blue)" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: 'var(--accent-blue)' }}>Field User Account</div>
                                    <div className="text-xs text-muted" style={{ marginTop: 2 }}>Participant in events. Can share location and send alerts. Admins are promoted by org super-admins.</div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Organization / Team <span className="text-muted">(optional)</span></label>
                                <input className="form-input" placeholder="e.g. City Security Department" value={organization} onChange={e => setOrganization(e.target.value)} />
                            </div>

                            <div className="flex items-center gap-8" style={{ marginTop: 4 }}>
                                <input type="checkbox" id="tos" style={{ accentColor: 'var(--accent-blue)' }} />
                                <label htmlFor="tos" className="text-xs text-secondary" style={{ cursor: 'pointer' }}>
                                    I agree to the <span style={{ color: 'var(--accent-blue)' }}>Terms of Service</span> and <span style={{ color: 'var(--accent-blue)' }}>Privacy Policy</span>
                                </label>
                            </div>

                            <div className="flex items-center gap-10">
                                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
                                <button
                                    className="btn btn-success"
                                    style={{ flex: 2, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                                    onClick={handleRegister}
                                    disabled={loading}
                                >
                                    <CheckCircle size={15} />
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="divider" />
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <button style={{ background: 'none', color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                            Sign in
                        </button>
                    </p>
                </div>

                <div className="mt-auto" style={{ paddingTop: 24 }}>
                    <div className="flex items-center gap-8 text-xs text-muted">
                        <Lock size={11} />
                        <span>Your data is encrypted and never shared without consent.</span>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div style={{ width: '100%', height: '100%', background: 'var(--bg-primary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                    <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'var(--accent-red)', filter: 'blur(140px)', opacity: 0.07, top: -150, right: -150 }} />
                    <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'var(--accent-purple)', filter: 'blur(120px)', opacity: 0.08, bottom: -100, left: -100 }} />
                    <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: 40 }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>Join the<br />Response Network</div>
                        <div className="text-sm text-secondary" style={{ lineHeight: 1.8, maxWidth: 280, margin: '0 auto 32px' }}>
                            Get instant access to live coordination tools used by security professionals worldwide.
                        </div>
                        {[
                            { icon: CheckCircle, color: 'var(--accent-green)', text: 'Live GPS tracking & zone assignment' },
                            { icon: CheckCircle, color: 'var(--accent-green)', text: 'One-tap SOS panic button' },
                            { icon: CheckCircle, color: 'var(--accent-green)', text: 'Access to event command dashboards' },
                            { icon: CheckCircle, color: 'var(--accent-green)', text: 'End-to-end encrypted communications' },
                        ].map(({ icon: Icon, color, text }) => (
                            <div key={text} className="flex items-center gap-10" style={{ marginBottom: 10, maxWidth: 280, margin: '0 auto 10px' }}>
                                <Icon size={15} color={color} style={{ flexShrink: 0 }} />
                                <span className="text-sm text-secondary" style={{ textAlign: 'left' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
