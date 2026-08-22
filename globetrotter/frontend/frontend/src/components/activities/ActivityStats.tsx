import React from 'react';

export const ActivityStats: React.FC = () => {
  const stats = [
    { value: '500+', label: 'Activities' },
    { value: '80+', label: 'Destinations' },
    { value: '25K+', label: 'Bookings' },
    { value: '4.8', label: 'Average Rating' },
  ];

  return (
    <section className="activities-stats-section">
      <div className="container">
        <div className="activity-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="activity-stat-card shadow-subtle">
              <h3 className="stat-number">{stat.value}</h3>
              <p className="stat-title">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
