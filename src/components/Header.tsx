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
      case 'settings': return 'System Settings';
      default: return 'Admin Panel';
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'dashboard': return '📊';
      case 'users': return '👥';
      case 'transactions': return '💳';
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
      <div className="header-left">
        <div className="section-info">
          <span className="section-icon">{getSectionIcon(activeSection)}</span>
          <h1 className="section-title">{getSectionTitle(activeSection)}</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="admin-info">
          <div 
            className="admin-profile"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="admin-avatar">
              <span>{user?.email?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
            <div className="admin-details">
              <span className="admin-email">{user?.email || 'admin@nomadpay.com'}</span>
              <span className="admin-role">{user?.role || 'Admin'}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </div>

          {showDropdown && (
            <div className="admin-dropdown">
              <div className="dropdown-item">
                <span className="dropdown-icon">👤</span>
                <span>Profile</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-icon">⚙️</span>
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <span className="dropdown-icon">🚪</span>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

