import React from 'react';
import { Mountain, Waves, Landmark, Utensils, Trees, Moon, Heart, ShoppingBag } from 'lucide-react';

interface ActivityCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ActivityCategories: React.FC<ActivityCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { name: 'Adventure', icon: Mountain, count: '120+ experiences', colorClass: 'bg-peach' },
    { name: 'Beach & Water', icon: Waves, count: '95+ experiences', colorClass: 'bg-ocean' },
    { name: 'Culture & History', icon: Landmark, count: '140+ experiences', colorClass: 'bg-lavender' },
    { name: 'Food & Dining', icon: Utensils, count: '85+ experiences', colorClass: 'bg-pink' },
    { name: 'Nature & Wildlife', icon: Trees, count: '110+ experiences', colorClass: 'bg-mint' },
    { name: 'Nightlife', icon: Moon, count: '60+ experiences', colorClass: 'bg-purple' },
    { name: 'Wellness', icon: Heart, count: '50+ experiences', colorClass: 'bg-rose' },
    { name: 'Shopping', icon: ShoppingBag, count: '75+ experiences', colorClass: 'bg-gold' },
  ];

  return (
    <section className="activity-categories-section">
      <div className="container">
        <div className="section-header-centered">
          <h2>Explore by Category</h2>
          <p>Choose an experience that matches your travel style.</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                className={`category-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
              >
                <div className={`category-icon-circle ${cat.colorClass}`}>
                  <IconComponent size={24} />
                </div>
                <h4 className="category-title">{cat.name}</h4>
                <span className="category-count">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
