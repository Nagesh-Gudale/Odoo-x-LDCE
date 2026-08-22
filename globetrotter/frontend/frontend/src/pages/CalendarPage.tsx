import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Compass, X 
} from 'lucide-react';
import { useTrip } from '../context/useTrip';
import type { ItineraryItem, Trip } from '../data/tripData';
import '../styles/Modules.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarPage: React.FC = () => {
  const { trips, itineraryItems } = useTrip();

  const [currentView, setCurrentView] = useState<'Month' | 'Week' | 'Agenda'>('Month');
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    tripName: string;
    tripId: string;
    date: string;
    time?: string;
    duration?: number;
    destination?: string;
    notes?: string;
  } | null>(null);

  // Derive all events dynamically from trips & itinerary items
  const calendarEvents: Array<{
    id: string;
    tripId: string;
    tripName: string;
    title: string;
    date: string;
    time?: string;
    duration?: number;
    destination?: string;
    notes?: string;
    type: 'trip' | 'activity';
  }> = [];

  trips.forEach((t: Trip) => {
    calendarEvents.push({
      id: `trip-ev-${t.id}`,
      tripId: t.id,
      tripName: t.name,
      title: `✈️ ${t.name}`,
      date: t.startDate,
      destination: t.destinations[0]?.city || 'Global',
      notes: t.description,
      type: 'trip',
    });
  });

  itineraryItems.forEach((item: ItineraryItem) => {
    const parentTrip = trips.find((t: Trip) => t.id === item.tripId);
    calendarEvents.push({
      id: item.id,
      tripId: item.tripId,
      tripName: parentTrip?.name || 'Trip',
      title: `📍 ${item.title}`,
      date: item.date,
      time: item.time,
      duration: item.duration,
      destination: item.destination,
      notes: item.notes,
      type: 'activity',
    });
  });

  // Calendar 30-day Grid for Sept 2026
  const monthDays = Array.from({ length: 30 }).map((_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const eventsOnDay = calendarEvents.filter((e) => e.date === dateStr);
    return { dayNum, dateStr, eventsOnDay };
  });

  return (
    <div className="module-page-container">
      <div className="container">
        {/* Header */}
        <div className="module-header-banner">
          <span className="module-eyebrow">
            <CalendarIcon size={16} /> INTEGRATED TRAVEL CALENDAR
          </span>
          <h1 className="module-title">Your Schedule & Itineraries</h1>
          <p className="module-subtitle">
            View upcoming trip departure dates, daily scheduled activities, and travel events in a unified calendar.
          </p>
        </div>

        {/* Calendar Control Toolbar */}
        <div className="itinerary-header-card" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
                September 2026
              </h2>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-outline-cta" style={{ padding: '0.4rem 0.6rem' }}><ChevronLeft size={16} /></button>
                <button className="btn-outline-cta" style={{ padding: '0.4rem 0.6rem' }}><ChevronRight size={16} /></button>
                <button className="btn-outline-cta" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>Today</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['Month', 'Week', 'Agenda'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`btn-outline-cta ${currentView === view ? 'selected' : ''}`}
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.4rem 1rem',
                    borderColor: currentView === view ? 'var(--color-sunset-orange)' : undefined,
                    color: currentView === view ? 'var(--color-sunset-orange)' : undefined,
                  }}
                >
                  {view} View
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MONTH VIEW */}
        {currentView === 'Month' && (
          <div className="calendar-grid-frame">
            <div className="calendar-month-grid">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="weekday-header">
                  {day}
                </div>
              ))}

              {monthDays.map((cell) => (
                <div key={cell.dayNum} className="day-cell">
                  <span className="day-number">{cell.dayNum}</span>

                  {cell.eventsOnDay.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className="calendar-event-pill"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGENDA VIEW */}
        {currentView === 'Agenda' && (
          <div className="expenses-table-card shadow-subtle">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Upcoming Agenda Events ({calendarEvents.length})
            </h3>

            {calendarEvents.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No scheduled activities or trips found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {calendarEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="selectable-option-card"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,122,69,0.15)', color: '#FF7A45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Compass size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}>{ev.title}</h4>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          Trip: {ev.tripName} • Date: {ev.date}
                        </span>
                      </div>
                    </div>

                    <span className="category-pill">{ev.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEEK VIEW */}
        {currentView === 'Week' && (
          <div className="expenses-table-card shadow-subtle">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Week View — Sept 01 to Sept 07, 2026
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Displaying weekly hour timeline grid for active day scheduled events.</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium">
            <button onClick={() => setSelectedEvent(null)} className="modal-close-btn">
              <X size={20} />
            </button>

            <span className="modal-eyebrow">EVENT DETAILS</span>
            <h3 className="modal-title">{selectedEvent.title}</h3>
            <p className="modal-subtitle">Belongs to trip: {selectedEvent.tripName}</p>

            <div style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <CalendarIcon size={16} style={{ color: 'var(--color-sunset-orange)' }} />
                <span>Date: <strong>{selectedEvent.date}</strong></span>
              </div>
              {selectedEvent.time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Clock size={16} style={{ color: 'var(--color-sunset-orange)' }} />
                  <span>Time Slot: <strong>{selectedEvent.time}</strong></span>
                </div>
              )}
              {selectedEvent.destination && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <MapPin size={16} style={{ color: 'var(--color-sunset-orange)' }} />
                  <span>Destination: <strong>{selectedEvent.destination}</strong></span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setSelectedEvent(null)} className="btn-outline-cta" style={{ flex: 1 }}>
                Close
              </button>
              <Link to={`/trips/${selectedEvent.tripId}`} className="btn-gradient-cta" style={{ flex: 1 }}>
                View Full Trip →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
