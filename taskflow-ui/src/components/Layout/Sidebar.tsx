import React from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const baseNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/projects', label: 'Projects', icon: '◫' },
  { path: '/kanban', label: 'Kanban Board', icon: '▦' },
  { path: '/tasks', label: 'All Tasks', icon: '✓' },
];

const adminNavItem = { path: '/users', label: 'Users', icon: '⚙' };


const aboutNavItem = { path: '/about', label: 'About Me', icon: '☺' };



const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems =
  user?.role === "Admin"
    ? [...baseNavItems, adminNavItem, aboutNavItem]
    : [...baseNavItems, aboutNavItem];


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: 220, height: '100vh', background: '#1a1d27',
      display: 'flex', flexDirection: 'column', color: '#fff'
    }}>
      <div style={{ padding: '20px', fontSize: 18, fontWeight: 700, borderBottom: '1px solid #2e3350' }}>
        TaskFlow
      </div>

      <nav style={{ flex: 1, padding: '12px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                textDecoration: 'none', color: isActive ? '#6366f1' : '#8b92b8',
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid #2e3350' }}>
        <div style={{ fontSize: 13, marginBottom: 8 }}>{user?.fullName}</div>
        <button
          onClick={handleLogout}
          style={{ width: '100%', padding: 8, background: '#2e3350', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;