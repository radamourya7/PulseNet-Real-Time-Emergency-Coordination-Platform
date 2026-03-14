import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Github, Linkedin, Mail, Twitter, ChevronLeft,
    ArrowRight, Globe, Zap, Shield, MapPin,
    MessageSquare, Image as ImageIcon, CheckCircle2,
    Calendar, User
} from 'lucide-react';

const updates = [
    {
        version: 'v2.3.0',
        type: 'Small',
        date: 'March 15, 2026',
        title: 'Admin Media Integration',
        desc: 'Implemented real-time media preview for SOS alerts. Admins can now view photos uploaded by users during emergencies directly in the Command Center.',
        tags: ['Backend', 'UI/UX']
    },
    {
        version: 'v2.2.0',
        type: 'Small',
        date: 'March 12, 2026',
        title: 'SOS Image Upload & Compression',
        desc: 'Added client-side image compression for faster emergency uploads and secondary cloud storage for incident evidence.',
        tags: ['Feature', 'Optimization']
    },
    {
        version: 'v2.1.0',
        type: 'Small',
        date: 'March 08, 2026',
        title: 'Real-time Tracking Engine',
        desc: 'Upgraded WebSocket engine to support 2-second location polling with sub-50ms latency for all responders.',
        tags: ['Core', 'Performance']
    },
    {
        version: 'v2.0.0',
        type: 'Major',
        date: 'March 04, 2026',
        title: 'Admin Dashboard Refactor',
        desc: 'Completely redesigned the Admin Command Center with a multi-panel layout for incident management, fleet tracking, and live communications.',
        tags: ['UI/UX', 'Refactor']
    },
    {
        version: 'v1.0.0',
        type: 'Major',
        date: 'March 01, 2026',
        title: 'Role-Based Access Control',
        desc: 'Implemented granular permissions system for SuperAdmins, Admins, and Users to ensure data security.',
        tags: ['Security', 'Core']
    }
];

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            paddingBottom: '80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Orbs */}
            <div className="landing-bg" style={{ pointerEvents: 'none' }}>
                <div className="landing-orb orb-red" style={{ top: '-10%', right: '-5%' }}></div>
                <div className="landing-orb orb-blue" style={{ bottom: '10%', left: '-5%' }}></div>
            </div>

            {/* Header */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .updates-scroll-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    animation: scroll 30s linear infinite;
                }
                .updates-scroll-container:hover {
                    animation-play-state: paused;
                }
                @media (max-width: 768px) {
                    .profile-title { font-size: 1.8rem !important; }
                    .about-header { padding: 24px 16px !important; }
                    .about-main { padding: 0 16px !important; }
                    .tech-stack-container { padding: 32px 16px !important; }
                }
            `}</style>

            <div className="about-header" style={{
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
                    onClick={() => navigate('/')}
                    className="btn btn-ghost"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="logo-text" style={{ fontSize: '1.5rem', opacity: 0.8 }}>About PulseNet</div>
                <div style={{ width: '40px' }}></div>
            </div>

            <main className="about-main" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>

                {/* Profile Section */}
                <section className="anim-fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                        border: '4px solid var(--bg-card)'
                    }}>
                        <User size={60} color="white" />
                    </div>
                    <h1 className="profile-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>Rada Sai Mourya</h1>
                    <p style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '24px' }}>Full Stack Developer & Architect</p>

                    <p style={{
                        lineHeight: '1.8',
                        color: 'var(--text-secondary)',
                        fontSize: '1.05rem',
                        marginBottom: '32px'
                    }}>
                        I am a passionate Full Stack Developer dedicated to building high-performance, real-time applications
                        that solve complex logistical and safety challenges. PulseNet is the culmination of my vision for a
                        unified, resilient, and lightning-fast emergency coordination platform.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <a href="https://github.com/radamourya7" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ padding: '8px 16px' }}>
                            <Github size={18} />
                        </a>
                        <a href="https://www.linkedin.com/in/rada-sai-mourya/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ padding: '8px 16px' }}>
                            <Linkedin size={18} />
                        </a>
                        <a href="#" className="btn btn-ghost btn-sm" style={{ padding: '8px 16px' }}>
                            <Twitter size={18} />
                        </a>
                        <a href="mailto:radamourya7@gmail.com" className="btn btn-primary btn-sm" style={{ padding: '8px 20px' }}>
                            <Mail size={18} />
                            Contact Me
                        </a>
                    </div>
                </section>

                <div className="divider" style={{ margin: '64px 0' }}></div>

                {/* Updates Section */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div className="logo-icon" style={{ width: '32px', height: '32px', background: 'var(--accent-blue-dim)' }}>
                            <Zap size={16} color="var(--accent-blue)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Project Updates</h2>
                    </div>

                    <div style={{
                        height: '400px',
                        overflow: 'hidden',
                        position: 'relative',
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}>
                        <div className="updates-scroll-container">
                            {[...updates, ...updates].map((update, i) => {
                                const realIndex = i % updates.length;
                                const displayNumber = updates.length - realIndex;
                                return (
                                    <div
                                        key={i}
                                        className="card"
                                        style={{
                                            padding: '24px',
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            right: '24px',
                                            top: '-12px',
                                            background: 'var(--accent-blue)',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            boxShadow: 'var(--shadow-blue)'
                                        }}>
                                            UPDATE #{displayNumber}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                <Calendar size={14} />
                                                {update.date}
                                                <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>• {update.version}</span>
                                                <span
                                                    className={update.type === 'Major' ? 'badge badge-green' : 'badge badge-amber'}
                                                    style={{ fontSize: '0.55rem', padding: '1px 6px', opacity: 0.9 }}
                                                >
                                                    {update.type.toUpperCase()} UPDATE
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {update.tags.map(tag => (
                                                    <span key={tag} className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                                            {update.title}
                                        </h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                            {update.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section style={{ marginTop: '80px' }}>
                    <div className="tech-stack-container" style={{ textAlign: 'center', background: 'var(--bg-card)', padding: '48px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px' }}>Built with Modern Technology</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px' }}>
                            {[
                                { name: 'React', icon: Globe },
                                { name: 'Node.js', icon: Zap },
                                { name: 'MongoDB', icon: Shield },
                                { name: 'Socket.IO', icon: MessageSquare },
                                { name: 'Vite', icon: Zap },
                                { name: 'Lucide', icon: ImageIcon }
                            ].map(tech => (
                                <div key={tech.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                                        <tech.icon size={20} color="var(--text-muted)" />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{tech.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <div style={{ textAlign: 'center', marginTop: '80px' }}>
                    <button
                        onClick={() => navigate('/register')}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', maxWidth: '300px' }}
                    >
                        Join the Network
                        <ArrowRight size={18} />
                    </button>
                    <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        © 2026 PulseNet Systems · Developed with ❤️ by Rada Sai Mourya
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AboutUs;
