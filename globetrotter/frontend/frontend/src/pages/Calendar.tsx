import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Badge, Card } from '../components/Common';
import './Calendar.css';

export const Calendar: React.FC = () => {
  // Calendar trip events
  const events = [
    {
      id: 1,
      title: 'European Explorer (Stop 1: Rome)',
      dates: 'Aug 25 - Aug 29, 2026',
      location: 'Rome, Italy',
      color: 'var(--color-sunset-orange)',
    },
    {
      id: 2,
      title: 'European Explorer (Stop 2: Paris)',
      dates: 'Aug 30 - Sep 04, 2026',
      location: 'Paris, France',
      color: 'var(--color-sunset-coral)',
    },
    {
      id: 3,
      title: 'European Explorer (Stop 3: London)',
      dates: 'Sep 05 - Sep 10, 2026',
      location: 'London, United Kingdom',
      color: 'var(--color-sunset-purple)',
    },
  ];

  // Dummy monthly dates for August 2026
  const daysInAugust = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventForDay = (day: number) => {
    // Aug 25 - Aug 29: Rome
    if (day >= 25 && day <= 29) return events[0];
    // Aug 30 - Aug 31: Paris
    if (day >= 30 && day <= 31) return events[1];
    return null;
  };

  return (
    <div className="calendar-page container">
      <div className="calendar-header">
        <h2>Travel Calendar</h2>
        <p className="subtitle">Track your upcoming routes and daily schedules in a unified calendar layout</p>
      </div>

      <div className="calendar-layout-grid">
        {/* Left Side: Monthly Grid */}
        <div className="calendar-left">
          <Card className="calendar-grid-card">
            <div className="grid-header">
              <h3>August 2026</h3>
              <div className="week-days">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
            </div>

            <div className="grid-cells">
              {/* Padding cells for starting day offset (assuming August 2026 starts on Saturday = 6 empty cells) */}
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={`empty-${idx}`} className="grid-cell empty"></div>
              ))}
              
              {daysInAugust.map((day) => {
                const event = getEventForDay(day);
                return (
                  <div key={day} className={`grid-cell ${event ? 'has-event' : ''}`}>
                    <span className="day-number">{day}</span>
                    {event && (
                      <div 
                        className="event-marker-dot" 
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Travel Event Cards List */}
        <div className="calendar-right">
          <Card className="events-list-card">
            <div className="card-title-wrapper">
              <Badge text="Events schedule" variant="pink" />
              <h3>Trip Timeline</h3>
            </div>

            <div className="events-timeline-list">
              {events.map((event) => (
                <div key={event.id} className="event-timeline-item" style={{ borderLeftColor: event.color }}>
                  <h4 className="event-item-title">{event.title}</h4>
                  <div className="event-item-meta">
                    <div className="meta-row">
                      <Clock size={12} />
                      <span>{event.dates}</span>
                    </div>
                    <div className="meta-row">
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
