import React, { useState } from 'react';
import { Users, Trash2, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTrip } from '../../context/useTrip';
import type { UserAdminProfile } from '../../data/tripData';
import '../../styles/Modules.css';

export const AdminUsers: React.FC = () => {
  const { adminUsers, updateUserStatus, deleteUser } = useTrip();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <span className="module-eyebrow">
          <Users size={16} /> ACCOUNT MANAGEMENT
        </span>
        <h1 className="module-title">User Management</h1>
        <p className="module-subtitle">View, edit, toggle account status, and manage permissions for all registered platform users.</p>
      </div>

      <div className="admin-table-card shadow-medium">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Trips</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user: UserAdminProfile) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: 800 }}>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="category-pill" style={{ background: user.role === 'admin' ? 'rgba(255,122,69,0.15)' : undefined }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span
                    onClick={() =>
                      updateUserStatus(user.id, user.status === 'Active' ? 'Disabled' : 'Active')
                    }
                    className={`metric-status-badge ${user.status === 'Active' ? 'status-ok' : 'status-warn'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.status} (Click to toggle)
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.joinedDate}</td>
                <td style={{ fontWeight: 800 }}>{user.tripsCount}</td>
                <td>
                  <button
                    onClick={() => setDeleteTargetId(user.id)}
                    className="btn-outline-cta"
                    style={{ padding: '0.35rem 0.6rem', color: '#E5484D' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="modal-backdrop">
          <div className="modal-card shadow-medium" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <button onClick={() => setDeleteTargetId(null)} className="modal-close-btn">
              <X size={20} />
            </button>

            <AlertTriangle size={42} style={{ color: '#E5484D', marginBottom: '1rem' }} />
            <h3 className="modal-title">Confirm Delete User?</h3>
            <p className="modal-subtitle">This action will remove the user account permanently.</p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={() => setDeleteTargetId(null)} className="btn-outline-cta" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUser(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="btn-gradient-cta"
                style={{ flex: 1, background: '#E5484D' }}
              >
                Delete Account <ShieldCheck size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
