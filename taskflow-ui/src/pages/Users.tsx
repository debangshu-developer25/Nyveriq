import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { User } from '../types';

const roleColors: Record<User['role'], string> = {
  Member: '#94a3b8',
  Manager: '#f59e0b',
  Admin: '#6366f1',
};

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, error, updateRole } = useUsers();

  // Extra safety: redirect non-admins even if they bypass the sidebar
  if (currentUser?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) return <p style={{ padding: 24 }}>Loading users...</p>;
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 24 }}>
        <h2>User Management</h2>
        <p style={{ color: '#94a3b8', marginBottom: 20 }}>Manage roles for all registered users</p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Role</th>
              <th style={{ padding: 12 }}>Joined</th>
              <th style={{ padding: 12 }}>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12, fontWeight: 500 }}>{u.fullName}</td>
                <td style={{ padding: 12, fontSize: 13, color: '#64748b' }}>{u.email}</td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: 12,
                    color: '#fff', background: roleColors[u.role],
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: 12, fontSize: 13, color: '#64748b' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: 12 }}>
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.userId, e.target.value as User['role'])}
                    disabled={u.userId === Number(currentUser?.userId)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;