import React, { useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  created_at?: string;
}

interface HeaderProps {
  user: AuthUser | null;
  activeSection: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeSection, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard': return 'Dashboard Overview';
      case 'users': return 'User Management';
      case 'transactions': return 'Transaction Management';
      case 'audit-logs': return 'Audit Logs';
      case 'system': return 'System Health';
      case 'settings': return 'System Settings';
      default: return 'Admin Panel';
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'dashboard': return '📊';
      case 'users': return '👥';
      case 'transactions': return '💳';
      case 'audit-logs': return '🕵️';
      case 'system': return '🩺';
      case 'settings': return '⚙️';
      default: return '🛡️';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
    setShowDropdown(false);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-header-title">
          <span style={{ marginRight: '10px' }}>{getSectionIcon(activeSection)}</span>
          {getSectionTitle(activeSection)}
        </h1>
      </div>

      <div className="admin-header-right">
        <div className="admin-user-info">
          <p className="admin-user-welcome">Welcome, {user?.email || 'admin@nomadpay.com'}</p>
          <p className="admin-user-role">{user?.role || 'ADMIN'}</p>
        </div>
        
        <button className="admin-logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

