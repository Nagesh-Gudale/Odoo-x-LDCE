import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  DollarSign, Plus, Trash2, ArrowLeft, AlertTriangle, PieChart, Tag, Hotel, Plane, Utensils, Compass, ShoppingBag, ShieldCheck, FileText 
} from 'lucide-react';
import { useTrip } from '../context/useTrip';
import type { Trip, Expense } from '../data/tripData';
import '../styles/Modules.css';

const CATEGORY_ICONS: Record<Expense['category'], React.ReactNode> = {
  Accommodation: <Hotel size={16} />,
  Transport: <Plane size={16} />,
  Food: <Utensils size={16} />,
  Activities: <Compass size={16} />,
  Shopping: <ShoppingBag size={16} />,
  Visa: <FileText size={16} />,
  Insurance: <ShieldCheck size={16} />,
  Other: <Tag size={16} />,
};

export const TripBudget: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, expenses, addExpense, deleteExpense } = useTrip();

  const currentTrip = trips.find((t: Trip) => t.id === id) || trips[0];
  const tripExpenses = expenses.filter((e: Expense) => e.tripId === currentTrip.id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(5000);
  const [category, setCategory] = useState<Expense['category']>('Accommodation');
  const [expenseDate, setExpenseDate] = useState(currentTrip.startDate);
  const [destination, setDestination] = useState(currentTrip.destinations[0]?.city || 'Paris');
  const [notes, setNotes] = useState('');

  const totalBudget = currentTrip.totalBudget || 85000;
  const totalSpent = tripExpenses.reduce((acc: number, curr: Expense) => acc + curr.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = Math.min(100, Math.round((totalSpent / totalBudget) * 100));
  const isOverBudget = totalSpent > totalBudget;

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addExpense({
      tripId: currentTrip.id,
      title: title.trim(),
      category,
      amount: Number(amount),
      date: expenseDate,
      destination,
      notes,
    });

    setTitle('');
    setNotes('');
    setIsModalOpen(false);
  };

  // Group by category
  const categoriesList: Expense['category'][] = ['Accommodation', 'Transport', 'Food', 'Activities', 'Shopping', 'Visa', 'Insurance', 'Other'];
  const categoryTotals = categoriesList.map((cat) => {
    const total = tripExpenses.filter((e: Expense) => e.category === cat).reduce((s: number, e: Expense) => s + e.amount, 0);
    const catPercent = totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;
    return { category: cat, total, percentage: catPercent };
  });

  return (
    <div className="module-page-container">
      <div className="container">
        {/* Top Link Bar */}
        <div style={{ paddingTop: '2rem' }}>
          <Link to={`/trips/${currentTrip.id}`} className="btn-back-link">
            <ArrowLeft size={16} /> Back to Trip Details
          </Link>
        </div>

        {/* Header */}
        <div className="module-header-banner">
          <span className="module-eyebrow">
            <DollarSign size={16} /> Budget & Expense Intelligence
          </span>
          <h1 className="module-title">{currentTrip.name} — Budget</h1>
          <p className="module-subtitle">
            Track planned expenses, categorize costs, analyze daily spending, and keep your trip on budget.
          </p>
        </div>

        {/* Metric Cards Summary */}
        <div className="budget-summary-grid">
          <div className="budget-metric-card shadow-subtle">
            <span className="metric-label">Total Budget</span>
            <div className="metric-val">₹{totalBudget.toLocaleString('en-IN')}</div>
            <span className="metric-status-badge status-ok">Target Budget</span>
          </div>

          <div className="budget-metric-card shadow-subtle">
            <span className="metric-label">Planned Spent</span>
            <div className="metric-val" style={{ color: isOverBudget ? '#E5484D' : 'var(--color-sunset-orange)' }}>
              ₹{totalSpent.toLocaleString('en-IN')}
            </div>
            <span className={`metric-status-badge ${isOverBudget ? 'status-warn' : 'status-ok'}`}>
              {percentage}% Allocated
            </span>
          </div>

          <div className="budget-metric-card shadow-subtle">
            <span className="metric-label">Remaining Balance</span>
            <div className="metric-val" style={{ color: remaining < 0 ? '#E5484D' : '#32B48A' }}>
              ₹{remaining.toLocaleString('en-IN')}
            </div>
            <span className={`metric-status-badge ${remaining < 0 ? 'status-warn' : 'status-ok'}`}>
              {remaining < 0 ? 'Over Budget' : 'Safe Margin'}
            </span>
          </div>

          <div className="budget-metric-card shadow-subtle">
            <span className="metric-label">Budget Status</span>
            <div className="metric-val" style={{ fontSize: '1.5rem', marginTop: '0.4rem' }}>
              {isOverBudget ? '⚠️ Warning' : '✅ On Track'}
            </div>
            <span className="metric-status-badge status-ok">Auto-Calculated</span>
          </div>
        </div>

        {/* Progress Bar & Alert */}
        <div className="budget-progress-box shadow-medium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
              Budget Utilization Progress
            </h3>
            <span style={{ fontWeight: 800, color: 'var(--color-sunset-orange)' }}>
              ₹{totalSpent.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="progress-track-bg">
            <div
              className="progress-fill-bar"
              style={{
                width: `${percentage}%`,
                background: isOverBudget ? '#E5484D' : 'linear-gradient(135deg, #FF7A45, #FF4F9A, #8B5CF6)',
              }}
            ></div>
          </div>

          {isOverBudget && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#E5484D', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem' }}>
              <AlertTriangle size={18} />
              <span>Warning: Your planned expenses exceed the allocated budget by ₹{Math.abs(remaining).toLocaleString('en-IN')}.</span>
            </div>
          )}
        </div>

        {/* Categories & Expense Table Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '32% 68%', gap: '2rem' }}>
          {/* Categories Sidebar */}
          <div className="expenses-table-card shadow-subtle">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              <PieChart size={18} /> Category Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryTotals.map((cat) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {CATEGORY_ICONS[cat.category]} {cat.category}
                    </span>
                    <span>₹{cat.total.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                  </div>
                  <div className="progress-track-bg" style={{ height: '6px', margin: 0 }}>
                    <div className="progress-fill-bar" style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses Table */}
          <div className="expenses-table-card shadow-subtle">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
                Recorded Expenses ({tripExpenses.length})
              </h3>
              <button onClick={() => setIsModalOpen(true)} className="btn-gradient-cta">
                <Plus size={16} /> Add Expense
              </button>
            </div>

            {tripExpenses.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                No expenses added yet. Click "+ Add Expense" to begin tracking.
              </p>
            ) : (
              <div>
                <div className="expense-row-item" style={{ fontWeight: 800, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <span>Expense Title</span>
                  <span>Category</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Action</span>
                </div>

                {tripExpenses.map((exp: Expense) => (
                  <div key={exp.id} className="expense-row-item">
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{exp.title}</strong>
                      {exp.destination && <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>📍 {exp.destination}</span>}
                    </div>
                    <span className="category-pill">{exp.category}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{exp.date}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <button onClick={() => deleteExpense(exp.id)} className="btn-outline-cta" style={{ padding: '0.35rem 0.5rem', color: '#E5484D' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium">
            <span className="modal-eyebrow">NEW EXPENSE</span>
            <h3 className="modal-title">Record Trip Expense</h3>

            <form onSubmit={handleAddExpenseSubmit} className="modal-form" style={{ marginTop: '1.25rem' }}>
              <div className="modal-field-group">
                <label className="modal-label">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="modal-input-control"
                  placeholder="e.g. Hotel Booking, Flight, Dinner"
                />
              </div>

              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="modal-input-control"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Expense['category'])}
                    className="modal-select-control"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-fields-row">
                <div className="modal-field-group">
                  <label className="modal-label">Expense Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="modal-input-control"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Destination City</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="modal-input-control"
                    placeholder="e.g. Paris"
                  />
                </div>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="modal-input-control"
                  placeholder="Receipt reference or booking details"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline-cta" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gradient-cta" style={{ flex: 1 }}>
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
