import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import '../../styles/Modules.css';

interface DestinationItem {
  id: string;
  city: string;
  country: string;
  region: string;
  rating: number;
  cost: number;
}

const INITIAL_DESTINATIONS: DestinationItem[] = [
  { id: 'd-1', city: 'Paris', country: 'France', region: 'Europe', rating: 4.9, cost: 25000 },
  { id: 'd-2', city: 'Rome', country: 'Italy', region: 'Europe', rating: 4.8, cost: 21500 },
  { id: 'd-3', city: 'Santorini', country: 'Greece', region: 'Europe', rating: 4.9, cost: 26000 },
  { id: 'd-4', city: 'Tokyo', country: 'Japan', region: 'Asia', rating: 4.9, cost: 35000 },
  { id: 'd-5', city: 'Bali', country: 'Indonesia', region: 'Asia', rating: 4.8, cost: 32000 },
];

export const AdminDestinations: React.FC = () => {
  const [destList, setDestList] = useState<DestinationItem[]>(INITIAL_DESTINATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('Europe');
  const [cost, setCost] = useState(20000);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !country.trim()) return;

    setDestList([
      { id: `d-${Date.now()}`, city: city.trim(), country: country.trim(), region, rating: 4.8, cost: Number(cost) },
      ...destList,
    ]);

    setCity('');
    setCountry('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="module-eyebrow">
            <MapPin size={16} /> DESTINATION CATALOG
          </span>
          <h1 className="module-title">Destinations</h1>
          <p className="module-subtitle">Manage available multi-city destinations, regions, and cost estimates.</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gradient-cta">
          <Plus size={16} /> Add Destination
        </button>
      </div>

      <div className="admin-table-card shadow-medium">
        <table className="admin-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Country</th>
              <th>Region</th>
              <th>Est. Cost (INR)</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destList.map((d) => (
              <tr key={d.id}>
                <td><strong style={{ fontSize: '0.95rem' }}>{d.city}</strong></td>
                <td>{d.country}</td>
                <td><span className="category-pill">{d.region}</span></td>
                <td style={{ fontWeight: 800, color: 'var(--color-sunset-orange)' }}>
                  ₹{d.cost.toLocaleString('en-IN')}
                </td>
                <td>⭐ {d.rating}</td>
                <td>
                  <button onClick={() => setDestList(destList.filter((item) => item.id !== d.id))} className="btn-outline-cta" style={{ padding: '0.35rem 0.6rem', color: '#E5484D' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium">
            <span className="modal-eyebrow">NEW DESTINATION</span>
            <h3 className="modal-title">Add City Destination</h3>

            <form onSubmit={handleAdd} className="modal-form" style={{ marginTop: '1.25rem' }}>
              <div className="modal-field-group">
                <label className="modal-label">City *</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="modal-input-control" />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Country *</label>
                <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} className="modal-input-control" />
              </div>

              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="modal-select-control">
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Americas">Americas</option>
                    <option value="Middle East">Middle East</option>
                  </select>
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Est. Cost (INR)</label>
                  <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="modal-input-control" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline-cta" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-gradient-cta" style={{ flex: 1 }}>Save Destination</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
