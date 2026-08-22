import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { activitiesData } from '../data/activitiesData';
import type { Activity } from '../data/activitiesData';
import { ActivitiesHero } from '../components/activities/ActivitiesHero';
import { ActivitySearch } from '../components/activities/ActivitySearch';
import { ActivityCategories } from '../components/activities/ActivityCategories';
import { ActivityCard } from '../components/activities/ActivityCard';
import { ActivityMap } from '../components/activities/ActivityMap';
import { ActivityStats } from '../components/activities/ActivityStats';
import { ActivitiesCTA } from '../components/activities/ActivitiesCTA';
import { AddToTripModal } from '../components/activities/AddToTripModal';
import './Activities.css';

export const Activities: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [sortOption, setSortOption] = useState('Recommended');

  const [modalActivity, setModalActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteActivities');
      return saved ? JSON.parse(saved) : ['activity-001', 'activity-005'];
    } catch {
      return ['activity-001', 'activity-005'];
    }
  });

  useEffect(() => {
    localStorage.setItem('favoriteActivities', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleOpenAddToTrip = (activity: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalActivity(activity);
    setIsModalOpen(true);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDestination('All');
    setSelectedCategory('All');
    setSelectedPriceRange('All');
    setSelectedRating('All');
    setSelectedDuration('All');
    setSortOption('Recommended');
  };

  // Filter Logic
  const filteredActivities = activitiesData.filter((act) => {
    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchDest = act.destination.toLowerCase().includes(q);
      const matchCat = act.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDest && !matchCat) return false;
    }

    // Destination filter
    if (selectedDestination !== 'All' && act.destination !== selectedDestination) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && act.category !== selectedCategory) {
      return false;
    }

    // Price range filter
    if (selectedPriceRange === 'Under ₹5,000' && act.price >= 5000) return false;
    if (selectedPriceRange === '₹5,000–₹10,000' && (act.price < 5000 || act.price > 10000)) return false;
    if (selectedPriceRange === '₹10,000–₹20,000' && (act.price < 10000 || act.price > 20000)) return false;
    if (selectedPriceRange === '₹20,000+' && act.price <= 20000) return false;

    // Rating filter
    if (selectedRating === '4.8+' && act.rating < 4.8) return false;
    if (selectedRating === '4.5+' && act.rating < 4.5) return false;
    if (selectedRating === '4.0+' && act.rating < 4.0) return false;

    // Duration filter
    if (selectedDuration === 'Under 2 hours' && act.duration.includes('hours') && parseInt(act.duration) >= 2) return false;
    if (selectedDuration === '2–4 hours' && act.duration.includes('hours') && (parseInt(act.duration) < 2 || parseInt(act.duration) > 4)) return false;
    if (selectedDuration === '4–8 hours' && act.duration.includes('hours') && (parseInt(act.duration) < 4 || parseInt(act.duration) > 8)) return false;
    if (selectedDuration === 'Full day' && (!act.duration.includes('hours') || parseInt(act.duration) < 8)) return false;

    return true;
  });

  // Sort Logic
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortOption === 'Most Popular') return b.reviews - a.reviews;
    if (sortOption === 'Highest Rated') return b.rating - a.rating;
    if (sortOption === 'Price: Low to High') return a.price - b.price;
    if (sortOption === 'Price: High to Low') return b.price - a.price;
    if (sortOption === 'Shortest Duration') return parseInt(a.duration) - parseInt(b.duration);
    return 0; // Recommended default
  });

  const recommendedActivities = activitiesData.slice(0, 4);

  const scrollToSearchBar = () => {
    const el = document.getElementById('activity-search-bar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="activities-page-container">
      {/* Hero Section */}
      <ActivitiesHero onExploreClick={scrollToSearchBar} />

      {/* Dedicated Search Section */}
      <ActivitySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriceRange={selectedPriceRange}
        setSelectedPriceRange={setSelectedPriceRange}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        onSearchSubmit={scrollToSearchBar}
      />

      {/* Category Strip */}
      <ActivityCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Grid Header & Controls */}
      <section className="activities-grid-section">
        <div className="container">
          <div className="grid-control-bar">
            <div className="bar-left">
              <h2 className="grid-main-heading">Popular Activities</h2>
              <span className="results-badge">
                {sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'} found
              </span>
            </div>

            <div className="bar-right">
              {(selectedCategory !== 'All' || selectedDestination !== 'All' || selectedPriceRange !== 'All' || searchQuery !== '') && (
                <button onClick={clearAllFilters} className="btn-clear-filters">
                  <RefreshCw size={14} />
                  <span>Reset Filters</span>
                </button>
              )}

              <div className="sort-wrapper">
                <SlidersHorizontal size={14} className="sort-icon" />
                <label className="sort-label">Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Most Popular">Most Popular</option>
                  <option value="Highest Rated">Highest Rated</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Shortest Duration">Shortest Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Cards Grid */}
          {sortedActivities.length > 0 ? (
            <div className="activities-grid">
              {sortedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isFavorite={favorites.includes(activity.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToTripClick={handleOpenAddToTrip}
                />
              ))}
            </div>
          ) : (
            <div className="empty-activities-card shadow-subtle">
              <h3>No activities found</h3>
              <p>Try adjusting your search criteria or clearing active filters to see more results.</p>
              <button onClick={clearAllFilters} className="btn-gradient-cta">
                <span>Clear All Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Activities Section */}
      <section className="recommended-section">
        <div className="container">
          <div className="section-header-centered">
            <h2>Recommended for You</h2>
            <p>Handpicked experiences based on popular traveler trends.</p>
          </div>
          <div className="activities-grid">
            {recommendedActivities.map((act) => (
              <ActivityCard
                key={`rec-${act.id}`}
                activity={act}
                isFavorite={favorites.includes(act.id)}
                onToggleFavorite={toggleFavorite}
                onAddToTripClick={handleOpenAddToTrip}
              />
            ))}
          </div>
        </div>
      </section>

      {/* World Activity Map Section */}
      <ActivityMap activities={activitiesData} />

      {/* Statistics Section */}
      <ActivityStats />

      {/* Call to Action Section */}
      <ActivitiesCTA />

      {/* Add To Trip Modal */}
      <AddToTripModal
        activity={modalActivity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
