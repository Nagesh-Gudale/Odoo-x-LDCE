import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  X, 
  Mail,
  UserCheck,
  UserX,
  Calendar
} from 'lucide-react';
import { INITIAL_ADMIN_USERS } from '../../data/adminData';
import type { AdminUser, UserStatus, UserRole } from '../../types/admin';
import './AdminUsers.css';

export const AdminUsers: React.FC = () => {
  const { searchQuery: globalSearch } = useOutletContext<{ searchQuery?: string }>();
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modal State for Add / Edit User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Traveler');
  const [userStatus, setUserStatus] = useState<UserStatus>('active');
  const [userCountry, setUserCountry] = useState('India');

  const effectiveSearch = (globalSearch || localSearch).toLowerCase();

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(effectiveSearch) ||
      user.email.toLowerCase().includes(effectiveSearch) ||
      user.country.toLowerCase().includes(effectiveSearch);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const openAddModal = () => {
    setEditingUserId(null);
    setUserName('');
    setUserEmail('');
    setUserRole('Traveler');
    setUserStatus('active');
    setUserCountry('India');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserStatus(user.status);
    setUserCountry(user.country);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      setUsers(prev => 
        prev.map(u => 
          u.id === editingUserId 
            ? { ...u, name: userName, email: userEmail, role: userRole, status: userStatus, country: userCountry }
            : u
        )
      );
    } else {
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        name: userName,
        email: userEmail,
        tripsCount: 0,
        status: userStatus,
        role: userRole,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just registered',
        country: userCountry
      };
      setUsers(prev => [newUser, ...prev]);
    }
    setIsModalOpen(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => 
      prev.map(u => {
        if (u.id !== userId) return u;
        const nextStatus: UserStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user account? This will remove all their itineraries.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="admin-users-page">
      {/* Header & Quick Action Row */}
      <div className="users-page-header">
        <div>
          <h2 className="users-header-title">User Accounts Directory</h2>
          <p className="users-header-sub">Manage platform travelers, guides, moderators, and verify identity access.</p>
        </div>

        <button className="btn-add-new-user" onClick={openAddModal}>
          <Plus size={16} />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="users-filter-bar">
        <div className="search-filter-input">
          <Search size={16} className="filter-search-icon" />
          <input 
            type="text"
            placeholder="Search by name, email or country..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="status-filter-pills">
          {(['all', 'active', 'pending', 'suspended'] as const).map((st) => (
            <button
              key={st}
              className={`status-pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'all' ? 'All Status' : st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>

        {/* Role Filter */}
        <div className="role-filter-box">
          <Filter size={14} />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Pro Explorer">Pro Explorer</option>
            <option value="Traveler">Traveler</option>
            <option value="Guide">Guide</option>
          </select>
        </div>
      </div>

      {/* SECTION 27: Clean Users Data Table */}
      <div className="users-table-card">
        <div className="table-responsive-wrapper">
          <table className="users-data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Trips Planned</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data-cell">
                    <Users size={36} className="empty-table-icon" />
                    <div>No user accounts matching "{effectiveSearch}"</div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    {/* User Avatar + Name */}
                    <td>
                      <div className="user-profile-cell">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="table-user-avatar" />
                        ) : (
                          <div className="table-avatar-fallback">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="user-text-info">
                          <span className="user-display-name">{user.name}</span>
                          <span className="user-country-tag">📍 {user.country}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <div className="user-email-cell">
                        <Mail size={13} className="cell-icon-dim" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>
                        {user.role === 'Admin' && <ShieldCheck size={12} />}
                        {user.role}
                      </span>
                    </td>

                    {/* Trips Count */}
                    <td>
                      <span className="trips-count-badge">
                        {user.tripsCount} {user.tripsCount === 1 ? 'Trip' : 'Trips'}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`user-status-tag ${user.status}`}>
                        <span className="status-dot"></span>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td>
                      <div className="joined-date-cell">
                        <Calendar size={13} className="cell-icon-dim" />
                        <span>{user.joinedDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions-cluster">
                        <button 
                          className="table-btn-icon edit-btn"
                          onClick={() => openEditModal(user)}
                          title="Edit User"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button 
                          className={`table-btn-icon toggle-status-btn ${user.status === 'active' ? 'suspend' : 'activate'}`}
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {user.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>

                        <button 
                          className="table-btn-icon delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="table-pagination-footer">
          <span className="table-count-summary">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> registered accounts
          </span>
        </div>
      </div>

      {/* Add / Edit User Modal Dialog */}
      {isModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="user-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3>{editingUserId ? 'Edit User Details' : 'Add New User Account'}</h3>
              <button 
                className="user-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="user-modal-form">
              <div className="form-group-item">
                <label>Full Name</label>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Email Address</label>
                <input 
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. maya@wanderlust.io"
                  required
                />
              </div>

              <div className="modal-row-two">
                <div className="form-group-item">
                  <label>Role</label>
                  <select 
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                  >
                    <option value="Traveler">Traveler</option>
                    <option value="Pro Explorer">Pro Explorer</option>
                    <option value="Guide">Guide</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Account Status</label>
                  <select 
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value as UserStatus)}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="form-group-item">
                <label>Home Country</label>
                <input 
                  type="text"
                  value={userCountry}
                  onChange={(e) => setUserCountry(e.target.value)}
                  placeholder="e.g. Greece"
                  required
                />
              </div>

              <div className="modal-actions-footer">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit-user"
                >
                  {editingUserId ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
