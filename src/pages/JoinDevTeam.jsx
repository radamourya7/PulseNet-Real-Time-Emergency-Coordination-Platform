import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Mail, Zap, Code, Rocket,
    Users, ShieldCheck, Cpu, ArrowRight
} from 'lucide-react';

const JoinDevTeam = () => {
    const navigate = useNavigate();

    return (
        <div className="join-dev-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            paddingBottom: '80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <div className="landing-bg" style={{ pointerEvents: 'none' }}>
                <div className="landing-orb orb-red" style={{ top: '-10%', left: '10%' }}></div>
                <div className="landing-orb orb-blue" style={{ bottom: '20%', right: '10%' }}></div>
                <div className="landing-orb orb-purple" style={{ top: '40%', right: '-5%' }}></div>
            </div>

            {/* Header */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 10
            }}>
                <button
                    onClick={() => navigate('/about')}
                    className="btn btn-ghost"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="logo-text" style={{ fontSize: '1.2rem', opacity: 0.8 }}>Developer Opportunities</div>
                <div style={{ width: '40px' }}></div>
            </div>

            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>

                {/* Hero Section */}
                <section className="anim-fade-up" style={{ textAlign: 'center', marginBottom: '80px', marginTop: '40px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--accent-blue-dim)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        color: 'var(--accent-blue)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '24px'
                    }}>
                        <Rocket size={14} />
                        We're Scaling
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-2px', lineHeight: '1.1' }}>
                        Build Software that<br />
                        <span style={{ color: 'var(--accent-red)' }}>Saves Lives.</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        maxWidth: '700px',
                        margin: '0 auto 40px'
                    }}>
                        PulseNet is more than just code. It's a mission-critical infrastructure for the moments that matter most. We are looking for engineers who want to solve the hardest problems in real-time systems.
                    </p>

                    <a
                        href="mailto:radamourya7@gmail.com?subject=PulseNet Dev Team Interest&body=Hi Rada Sai Mourya,%0D%0A%0D%0AI'm interested in joining the PulseNet development team. Here's why I'm a good fit..."
                        className="btn btn-primary btn-lg"
                        style={{ padding: '16px 40px', fontSize: '1.1rem' }}
                    >
                        <Mail size={20} />
                        Apply to the Team
                    </a>
                </section>

                {/* Why Join Grid */}
                <div className="grid-2" style={{ gap: '24px', marginBottom: '80px' }}>
                    {[
                        {
                            icon: Zap,
                            title: 'Real-Time Masters',
                            desc: 'Work with sub-50ms latency WebSockets, live Geo-clustering, and high-frequency data pipelines.'
                        },
                        {
                            icon: ShieldCheck,
                            title: 'Mission Critical',
                            desc: 'None of our systems can fail. Learn to build for 99.99% uptime and extreme hardware resilience.'
                        },
                        {
                            icon: Cpu,
                            title: 'Modern Stack',
                            desc: 'We use the latest React features, Node.js streams, MongoDB clustering, and edge computing.'
                        },
                        {
                            icon: Users,
                            title: 'Small Team, Huge Impact',
                            desc: 'No bureaucracy. You own entire features from concept to production deployment.'
                        }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="card anim-fade-up"
                            style={{
                                padding: '32px',
                                animationDelay: `${0.1 * (i + 1)}s`,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--accent-blue-dim)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                color: 'var(--accent-blue)'
                            }}>
                                <item.icon size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Final Pitch */}
                <section style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                    padding: '64px',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--accent-blue-dim)',
                    textAlign: 'center'
                }}>
                    <Code size={40} color="var(--accent-blue)" style={{ marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Ready to ship impact?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                        We don't care about your degree. We care about your passion for building resilient systems and your ability to ship high-quality code. Send me an email and let's talk.
                    </p>
                    <button
                        onClick={() => window.location.href = 'mailto:radamourya7@gmail.com'}
                        className="btn btn-ghost btn-lg"
                        style={{ background: 'var(--bg-primary)' }}
                    >
                        Contact Rada Sai Mourya
                        <ArrowRight size={18} />
                    </button>
                </section>

                <p style={{ textAlign: 'center', marginTop: '64px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    © 2026 PulseNet Development Team · Open for collaboration
                </p>
            </main>

            <style>{`
                @media (max-width: 768px) {
                    h1 { font-size: 2.5rem !important; }
                    .grid-2 { grid-template-columns: 1fr !important; }
                    section { padding: 40px 24px !important; }
                }
            `}</style>
        </div>
    );
};

export default JoinDevTeam;
