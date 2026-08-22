import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Trash2, Edit } from 'lucide-react';
import { Badge, Card } from '../components/Common';
import './Admin.css';

export const AdminUsers: React.FC = () => {
  const users = [
    { name: 'Nagesh Gudale', email: 'nagesh@odoo.com', trips: 3, status: 'Active', joined: 'Aug 10, 2026' },
    { name: 'Ishwari Nandargi', email: 'ishwari@odoo.com', trips: 1, status: 'Active', joined: 'Aug 12, 2026' },
    { name: 'Archita Thakur', email: 'archita@odoo.com', trips: 2, status: 'Active', joined: 'Aug 15, 2026' },
    { name: 'Pratik Rathod', email: 'pratik@odoo.com', trips: 1, status: 'Inactive', joined: 'Aug 16, 2026' },
  ];

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <div className="title-section">
          <ShieldAlert className="admin-icon-top" />
          <h2>Admin Console</h2>
        </div>
        <div className="admin-tabs">
          <Link to="/admin/dashboard" className="admin-tab">Dashboard</Link>
          <Link to="/admin/users" className="admin-tab active">Manage Users</Link>
        </div>
      </div>

      <div className="admin-section-header">
        <h3>User Management</h3>
        <p>Monitor user registration and manage accounts permission roles</p>
      </div>

      <Card className="users-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Trips Created</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx}>
                  <td className="user-name-cell">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.trips} Trips</td>
                  <td>
                    <Badge 
                      text={u.status} 
                      variant={u.status === 'Active' ? 'success' : 'pink'} 
                    />
                  </td>
                  <td>{u.joined}</td>
                  <td className="text-right actions-cell">
                    <button className="btn-action-edit" title="Edit User"><Edit size={14} /></button>
                    <button className="btn-action-delete" title="Delete User"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
