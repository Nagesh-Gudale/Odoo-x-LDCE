import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Compass, ShieldCheck, Users, Sparkles, ArrowRight, Award, Zap, Code 
} from 'lucide-react';
import '../styles/Modules.css';

export const About: React.FC = () => {
  return (
    <div className="module-page-container">
      <div className="container">
        {/* Hero Section */}
        <div className="community-hero-card" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <span className="module-eyebrow" style={{ justifyContent: 'center' }}>
            <Globe size={16} /> OUR MISSION & VISION
          </span>
          <h1 className="module-title" style={{ fontSize: '3.4rem', maxWidth: '800px', margin: '0 auto 1rem' }}>
            Travel should be planned, not complicated.
          </h1>
          <p className="module-subtitle" style={{ maxWidth: '680px', margin: '0 auto 2rem', fontSize: '1.15rem' }}>
            GlobeTrotter empowers travelers to effortlessly discover world cities, schedule day-by-day itineraries, track expenses, and collaborate on multi-city adventures.
          </p>

          <Link to="/trips/create" className="btn-gradient-cta" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
            Start Planning Your Journey <ArrowRight size={18} />
          </Link>
        </div>

        {/* Story & Mission Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', margin: '4rem 0', alignItems: 'center' }}>
          <div>
            <span className="module-eyebrow">
              <Sparkles size={16} /> THE GLOBETROTTER STORY
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Built for Modern Multi-City Explorers
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Traditional travel tools force users to jump between spreadsheets, calendar apps, booking confirmations, and budget files.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              GlobeTrotter brings everything into one intuitive platform: interactive timeline building, dynamic currency budget calculation, integrated social feeds, and administrative moderation controls.
            </p>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', height: '360px', position: 'relative' }} className="shadow-medium">
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
              alt="GlobeTrotter Journey"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,16,38,0.85), transparent)' }}></div>
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#ffffff' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>Seamless Travel Design</h3>
              <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Sunset Journey Visual Identity & Architecture</p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="budget-summary-grid" style={{ marginBottom: '4rem' }}>
          <div className="budget-metric-card shadow-subtle" style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-sunset-orange)' }}>10K+</h3>
            <span className="metric-label">Global Destinations</span>
          </div>

          <div className="budget-metric-card shadow-subtle" style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-sunset-orange)' }}>25K+</h3>
            <span className="metric-label">Trips Planned</span>
          </div>

          <div className="budget-metric-card shadow-subtle" style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-sunset-orange)' }}>15K+</h3>
            <span className="metric-label">Active Travelers</span>
          </div>

          <div className="budget-metric-card shadow-subtle" style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-sunset-orange)' }}>4.9 ★</h3>
            <span className="metric-label">Average Rating</span>
          </div>
        </div>

        {/* Features Highlights */}
        <div className="expenses-table-card shadow-subtle" style={{ padding: '3rem 2.5rem', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="module-eyebrow" style={{ justifyContent: 'center' }}>
              <Zap size={16} /> CORE PLATFORM FEATURES
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>Why Travelers Choose GlobeTrotter</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <Compass size={28} style={{ color: 'var(--color-sunset-orange)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Multi-City Wizard</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Organize stops, travel dates, cover photos, and style preferences in a guided 4-step workflow.
              </p>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <ShieldCheck size={28} style={{ color: 'var(--color-sunset-orange)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Budget Tracking</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Auto-calculate expenses in INR across stays, flights, and food with over-budget alerts.
              </p>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <Users size={28} style={{ color: 'var(--color-sunset-orange)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Traveler Community</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Share posts, leave comments, like itineraries, and discover public multi-city trips.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="module-eyebrow" style={{ justifyContent: 'center' }}>
              <Award size={16} /> ENGINEERING & DESIGN TEAM
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800 }}>Odoo Hackathon Project</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Nagesh Gudale', role: 'Full Stack & Lead Architecture', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
              { name: 'Ishwari Nandargi', role: 'UI/UX & Frontend Integration', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
            ].map((member) => (
              <div key={member.name} className="post-card shadow-subtle" style={{ textAlign: 'center', padding: '2rem' }}>
                <img src={member.avatar} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>{member.name}</h3>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-sunset-orange)', fontWeight: 700 }}>{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Tech Stack Section */}
        <div className="expenses-table-card shadow-subtle" style={{ padding: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>
          <Code size={36} style={{ color: 'var(--color-sunset-orange)', marginBottom: '0.75rem' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Technology Architecture</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Built with React 19, TypeScript, Vite, Express Node.js backend, Lucide Icons, and localStorage state persistence.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['React 19', 'TypeScript', 'Vite', 'Node.js', 'Express', 'CSS Variables', 'Lucide React'].map((tech) => (
              <span key={tech} className="category-pill" style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
