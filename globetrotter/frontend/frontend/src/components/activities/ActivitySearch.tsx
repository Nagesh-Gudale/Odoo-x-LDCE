import React from 'react';
import { Search, MapPin, Tag, DollarSign, Star, Clock, ChevronDown } from 'lucide-react';

interface ActivitySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDestination: string;
  setSelectedDestination: (dest: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPriceRange: string;
  setSelectedPriceRange: (price: string) => void;
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  onSearchSubmit: () => void;
}

export const ActivitySearch: React.FC<ActivitySearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDestination,
  setSelectedDestination,
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedRating,
  setSelectedRating,
  selectedDuration,
  setSelectedDuration,
  onSearchSubmit,
}) => {
  return (
    <section className="activity-search-section" id="activity-search-bar">
      <div className="container">
        <div className="activity-search-card shadow-medium">
          <h3 className="search-card-heading">What do you want to experience?</h3>
          
          {/* Main Search Input */}
          <div className="search-input-wrapper-large">
            <Search className="search-icon-inside" size={20} />
            <input
              type="text"
              placeholder="Search activities, experiences, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-main"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="search-filters-row">
            {/* Destination Dropdown */}
            <div className="filter-select-wrapper">
              <MapPin size={16} className="filter-icon" />
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="filter-select-control"
              >
                <option value="All">All Destinations</option>
                <option value="Santorini, Greece">Santorini, Greece</option>
                <option value="Tokyo, Japan">Tokyo, Japan</option>
                <option value="Bali, Indonesia">Bali, Indonesia</option>
                <option value="Dubai, UAE">Dubai, UAE</option>
                <option value="Paris, France">Paris, France</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Maldives">Maldives</option>
                <option value="Kyoto, Japan">Kyoto, Japan</option>
                <option value="Istanbul, Turkey">Istanbul, Turkey</option>
                <option value="New York, USA">New York, USA</option>
                <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                <option value="Bangkok, Thailand">Bangkok, Thailand</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            {/* Category Dropdown */}
            <div className="filter-select-wrapper">
              <Tag size={16} className="filter-icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select-control"
              >
                <option value="All">All Categories</option>
                <option value="Adventure">Adventure</option>
                <option value="Beach & Water">Beach & Water</option>
                <option value="Culture & History">Culture & History</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Nature & Wildlife">Nature & Wildlife</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Wellness">Wellness</option>
                <option value="Shopping">Shopping</option>
                <option value="Sightseeing">Sightseeing</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            {/* Price Range Dropdown */}
            <div className="filter-select-wrapper">
              <DollarSign size={16} className="filter-icon" />
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="filter-select-control"
              >
                <option value="All">All Prices</option>
                <option value="Under ₹5,000">Under ₹5,000</option>
                <option value="₹5,000–₹10,000">₹5,000–₹10,000</option>
                <option value="₹10,000–₹20,000">₹10,000–₹20,000</option>
                <option value="₹20,000+">₹20,000+</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            {/* Rating Dropdown */}
            <div className="filter-select-wrapper">
              <Star size={16} className="filter-icon" />
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="filter-select-control"
              >
                <option value="All">Any Rating</option>
                <option value="4.8+">4.8+ Stars</option>
                <option value="4.5+">4.5+ Stars</option>
                <option value="4.0+">4.0+ Stars</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            {/* Duration Dropdown */}
            <div className="filter-select-wrapper">
              <Clock size={16} className="filter-icon" />
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="filter-select-control"
              >
                <option value="All">Any Duration</option>
                <option value="Under 2 hours">Under 2 hours</option>
                <option value="2–4 hours">2–4 hours</option>
                <option value="4–8 hours">4–8 hours</option>
                <option value="Full day">Full day (8h+)</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            {/* Submit Button */}
            <button onClick={onSearchSubmit} className="btn-search-action">
              <Search size={18} />
              <span>Search Activities</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
