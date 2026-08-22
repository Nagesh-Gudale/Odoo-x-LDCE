import React from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import '../../styles/Modules.css';

export const AdminAnalytics: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="module-eyebrow">
          <BarChart3 size={16} /> SYSTEM REPORTS
        </span>
        <h1 className="module-title">Analytics & Insights</h1>
        <p className="module-subtitle">Deep dive into traveler behavior, popular destinations, and budget distribution.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Popular Destinations Share */}
        <div className="admin-table-card shadow-subtle">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} /> Most Popular Destinations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { city: 'Paris, France', share: 38 },
              { city: 'Santorini, Greece', share: 26 },
              { city: 'Tokyo, Japan', share: 20 },
              { city: 'Bali, Indonesia', share: 16 },
            ].map((item) => (
              <div key={item.city}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <span>{item.city}</span>
                  <span>{item.share}%</span>
                </div>
                <div className="progress-track-bg" style={{ height: '8px', margin: 0 }}>
                  <div className="progress-fill-bar" style={{ width: `${item.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Ranges Breakdown */}
        <div className="admin-table-card shadow-subtle">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> Trip Budget Range Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { range: '₹20,000 - ₹50,000 (Budget)', count: '32% of Trips' },
              { range: '₹50,000 - ₹1,00,000 (Moderate)', count: '45% of Trips' },
              { range: '₹1,00,000+ (Luxury & Multi-City)', count: '23% of Trips' },
            ].map((b) => (
              <div key={b.range} style={{ padding: '0.85rem', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{b.range}</h4>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-sunset-orange)', fontWeight: 700 }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
