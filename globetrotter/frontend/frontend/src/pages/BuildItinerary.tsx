import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  MapPin, 
  Wallet, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Plane, 
  Hotel, 
  Compass, 
  Utensils, 
  Palmtree, 
  X, 
  Layers,
  Calendar
} from 'lucide-react';
import { useTrip } from '../context/useTrip';
import { Navbar } from '../components/Navbar';
import type { ItinerarySection } from '../types/trip';
import './BuildItinerary.css';

export const BuildItinerary: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tripData, 
    addSection, 
    updateSection, 
    deleteSection, 
    totalSectionBudget,
    calculatedDays
  } = useTrip();

  // Modal / Form state for Adding or Editing a section
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ItinerarySection['category']>('Activity');
  const [formDescription, setFormDescription] = useState('');
  const [formStartDate, setFormStartDate] = useState(tripData.startDate || '2026-09-10');
  const [formEndDate, setFormEndDate] = useState(tripData.endDate || '2026-09-11');
  const [formBudget, setFormBudget] = useState<number>(15000);
  const [formLocation, setFormLocation] = useState(tripData.destination || 'Santorini, Greece');
  const [formActivities, setFormActivities] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);

  // Budget calculations
  const budgetPercentage = Math.min(
    100, 
    Math.round((totalSectionBudget / (tripData.estimatedBudget || 1)) * 100)
  );
  const budgetRemaining = (tripData.estimatedBudget || 0) - totalSectionBudget;

  const openAddModal = () => {
    setEditingSectionId(null);
    setFormTitle(`Section ${tripData.sections.length + 1}: `);
    setFormCategory('Activity');
    setFormDescription('All the necessary information about this section. This can be anything like travel section, hotel or any other activity');
    setFormStartDate(tripData.startDate || '2026-09-12');
    setFormEndDate(tripData.endDate || '2026-09-13');
    setFormBudget(18000);
    setFormLocation(tripData.destination);
    setFormActivities('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (section: ItinerarySection) => {
    setEditingSectionId(section.id);
    setFormTitle(section.title);
    setFormCategory(section.category);
    setFormDescription(section.description);
    setFormStartDate(section.startDate);
    setFormEndDate(section.endDate);
    setFormBudget(section.budget);
    setFormLocation(section.location);
    setFormActivities(section.activities ? section.activities.join(', ') : '');
    setFormNotes(section.notes || '');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateRangeStr = `${formStartDate} to ${formEndDate}`;
    const activitiesList = formActivities
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingSectionId) {
      updateSection(editingSectionId, {
        title: formTitle,
        category: formCategory,
        description: formDescription,
        startDate: formStartDate,
        endDate: formEndDate,
        dateRange: dateRangeStr,
        budget: Number(formBudget),
        location: formLocation,
        activities: activitiesList,
        notes: formNotes
      });
    } else {
      addSection({
        title: formTitle,
        category: formCategory,
        description: formDescription,
        startDate: formStartDate,
        endDate: formEndDate,
        dateRange: dateRangeStr,
        budget: Number(formBudget),
        currency: tripData.currency,
        location: formLocation,
        activities: activitiesList,
        notes: formNotes,
        status: 'planned'
      });
    }

    setIsModalOpen(false);
  };

  const getCategoryIcon = (category: ItinerarySection['category']) => {
    switch (category) {
      case 'Travel':
        return <Plane size={16} className="category-icon travel" />;
      case 'Hotel':
        return <Hotel size={16} className="category-icon hotel" />;
      case 'Dining':
        return <Utensils size={16} className="category-icon dining" />;
      case 'Relaxation':
        return <Palmtree size={16} className="category-icon relaxation" />;
      case 'Sightseeing':
      case 'Activity':
      default:
        return <Compass size={16} className="category-icon activity" />;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="build-itinerary-page">
      <Navbar />

      {/* Screen Identifier Bar */}
      <div className="screen-badge-bar">
        <div className="screen-badge-inner">
          <div className="screen-badge">
            <span className="badge-dot"></span>
            <strong>SCREEN 5:</strong> Build Itinerary Screen
          </div>
          <div className="screen-flow-step">
            Step 2 of 2: Multi-Section Journey Organizer & Budget Breakdown
          </div>
        </div>
      </div>

      <main className="itinerary-main-container">
        {/* Navigation & Trip Control Bar */}
        <div className="itinerary-top-bar">
          <button 
            className="btn-back-link"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            <span>Back to Plan Trip (Screen 4)</span>
          </button>

          <div className="top-bar-actions">
            <button className="btn-share-itinerary" onClick={handleShare}>
              {copiedLink ? <CheckCircle2 size={16} className="text-success" /> : <Share2 size={16} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Itinerary'}</span>
            </button>
            <button className="btn-save-journey" onClick={() => alert('Journey saved successfully!')}>
              <Sparkles size={16} />
              <span>Save Journey</span>
            </button>
          </div>
        </div>

        {/* Trip Overview Header Card */}
        <section className="itinerary-header-card">
          <div className="header-card-content">
            <div className="trip-tag-pill">
              <Sparkles size={13} />
              <span>Sunset Journey Itinerary</span>
            </div>

            <h1 className="itinerary-trip-title">{tripData.title}</h1>

            <div className="trip-meta-chips-row">
              <div className="meta-chip">
                <MapPin size={15} className="chip-icon text-coral" />
                <span>{tripData.destination}</span>
              </div>
              <div className="meta-chip">
                <CalendarDays size={15} className="chip-icon text-ocean" />
                <span>{calculatedDays} Days ({tripData.startDate} — {tripData.endDate})</span>
              </div>
              <div className="meta-chip">
                <Layers size={15} className="chip-icon" />
                <span>{tripData.sections.length} Itinerary Sections</span>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="itinerary-budget-bar-box">
              <div className="budget-bar-header">
                <div className="budget-label-group">
                  <span className="budget-text-label">Allocated Section Budget</span>
                  <span className="budget-allocated-val">
                    {tripData.currency}{totalSectionBudget.toLocaleString()} / {tripData.currency}{tripData.estimatedBudget.toLocaleString()}
                  </span>
                </div>
                <div className="budget-percentage-badge">
                  {budgetPercentage}% Planned
                </div>
              </div>

              <div className="progress-track">
                <div 
                  className="progress-fill-sunset"
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>

              <div className="budget-bar-footer">
                <span>Total Target: {tripData.currency}{tripData.estimatedBudget.toLocaleString()}</span>
                <span className={budgetRemaining >= 0 ? 'text-positive' : 'text-negative'}>
                  {budgetRemaining >= 0 ? `Remaining: ${tripData.currency}${budgetRemaining.toLocaleString()}` : `Over Budget by: ${tripData.currency}${Math.abs(budgetRemaining).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1, 2, 3... (Wireframe Stack) */}
        <section className="sections-stack-container">
          <div className="stack-header-row">
            <div>
              <h2 className="stack-title">Itinerary Timeline Sections</h2>
              <p className="stack-subtitle">
                Organize your journey into structured travel, hotel, and activity sections as shown in Screen 5.
              </p>
            </div>

            <button className="btn-primary-add-section" onClick={openAddModal}>
              <Plus size={16} />
              <span>+ Add Section</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="itinerary-cards-list">
            {tripData.sections.length === 0 ? (
              <div className="empty-sections-state">
                <Compass size={48} className="empty-icon" />
                <h3>No sections added yet</h3>
                <p>Click the button below to add your first travel, accommodation, or activity section.</p>
                <button className="btn-add-first-section" onClick={openAddModal}>
                  <Plus size={16} />
                  <span>Add First Section</span>
                </button>
              </div>
            ) : (
              tripData.sections.map((section, index) => (
                <div key={section.id} className="section-card-wireframe">
                  {/* Card Left Badge & Number */}
                  <div className="section-number-rail">
                    <span className="rail-number">{index + 1}</span>
                    <div className="rail-line"></div>
                  </div>

                  {/* Card Content Area */}
                  <div className="section-card-body">
                    <div className="section-card-top-row">
                      <div className="section-title-group">
                        <div className="section-category-pill">
                          {getCategoryIcon(section.category)}
                          <span>{section.category}</span>
                        </div>
                        <h3 className="section-heading-text">
                          {section.title.startsWith('Section') ? section.title : `Section ${index + 1}: ${section.title}`}
                        </h3>
                      </div>

                      {/* Edit / Delete Controls */}
                      <div className="section-actions-group">
                        <button 
                          className="btn-action-icon edit-action"
                          onClick={() => openEditModal(section)}
                          title="Edit section"
                          aria-label="Edit section"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-action-icon delete-action"
                          onClick={() => deleteSection(section.id)}
                          title="Delete section"
                          aria-label="Delete section"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Section Description (Wireframe Text) */}
                    <p className="section-description-text">
                      {section.description}
                    </p>

                    {/* Sub-Activities tags if present */}
                    {section.activities && section.activities.length > 0 && (
                      <div className="section-sub-activities">
                        {section.activities.map((act, actIdx) => (
                          <span key={actIdx} className="sub-act-pill">
                            ✓ {act}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Wireframe Detail Row: Date Range & Budget */}
                    <div className="section-meta-boxes-row">
                      {/* Date Range Box */}
                      <div className="meta-box date-range-box">
                        <div className="box-header-label">
                          <Calendar size={13} />
                          <span>Date Range</span>
                        </div>
                        <div className="box-value-text">
                          {section.dateRange || `${section.startDate} to ${section.endDate}`}
                        </div>
                      </div>

                      {/* Budget Box */}
                      <div className="meta-box budget-box">
                        <div className="box-header-label">
                          <Wallet size={13} />
                          <span>Budget of this section</span>
                        </div>
                        <div className="box-value-text budget-highlight">
                          {section.currency || tripData.currency}{section.budget ? Number(section.budget).toLocaleString() : '0'}
                        </div>
                      </div>

                      {/* Location Box */}
                      {section.location && (
                        <div className="meta-box location-box">
                          <div className="box-header-label">
                            <MapPin size={13} />
                            <span>Location</span>
                          </div>
                          <div className="box-value-text">
                            {section.location}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Wireframe Button: + Add another Section */}
          <button 
            type="button" 
            className="btn-wireframe-add-section"
            onClick={openAddModal}
          >
            <div className="add-icon-circle">
              <Plus size={20} />
            </div>
            <span className="add-btn-text">+ Add another Section</span>
          </button>
        </section>
      </main>

      {/* Interactive Modal for Adding / Editing a Section */}
      {isModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <Layers size={18} />
                </div>
                <h3>{editingSectionId ? 'Edit Itinerary Section' : 'Add New Itinerary Section'}</h3>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="modal-form-content">
              {/* Section Title */}
              <div className="modal-field">
                <label>Section Title</label>
                <input 
                  type="text" 
                  value={formTitle} 
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Section 4: Sunset Wine Tasting & Coastal Cruise"
                  required
                />
              </div>

              {/* Category & Budget */}
              <div className="modal-two-col">
                <div className="modal-field">
                  <label>Section Category</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ItinerarySection['category'])}
                  >
                    <option value="Activity">Activity / Tour</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Travel">Travel / Flight / Transfer</option>
                    <option value="Hotel">Hotel / Accommodation</option>
                    <option value="Dining">Dining / Food Experience</option>
                    <option value="Relaxation">Relaxation / Beach</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label>Budget for this Section ({tripData.currency})</label>
                  <input 
                    type="number" 
                    value={formBudget} 
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    min={0}
                    step={500}
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="modal-two-col">
                <div className="modal-field">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={formStartDate} 
                    onChange={(e) => setFormStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-field">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={formEndDate} 
                    onChange={(e) => setFormEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="modal-field">
                <label>Section Information / Description</label>
                <textarea 
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity."
                  required
                />
              </div>

              {/* Location & Activities */}
              <div className="modal-two-col">
                <div className="modal-field">
                  <label>Location / Destination</label>
                  <input 
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Oia, Santorini"
                  />
                </div>

                <div className="modal-field">
                  <label>Key Activities (comma separated)</label>
                  <input 
                    type="text"
                    value={formActivities}
                    onChange={(e) => setFormActivities(e.target.value)}
                    placeholder="e.g. Wine tour, Sunset viewing"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-footer-row">
                <button 
                  type="button" 
                  className="btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-save"
                >
                  <span>{editingSectionId ? 'Update Section' : 'Add to Itinerary'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-bar">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="sunset-text">🌅</span>
              <span>GlobeTrotter Itinerary Builder</span>
            </div>
            <p className="footer-tagline">"Plan. Explore. Experience More."</p>
          </div>
          <div className="footer-copyright">
            © 2026 GlobeTrotter • Sunset Journey Edition
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuildItinerary;
