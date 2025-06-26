import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  availableSections?: string[];
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  onLogout, 
  availableSections = [],
  userRole = 'User'
}) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'audit-logs', label: 'Audit Logs', icon: '🕵️' },
    { id: 'system', label: 'System', icon: '🩺' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  // Filter menu items based on available sections
  const menuItems = allMenuItems.filter(item => 
    availableSections.includes(item.id)
  );

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return '#ff6b6b'; // Red for Super Admin
      case 'Admin':
        return '#4ecdc4'; // Teal for Admin
      case 'Viewer':
        return '#45b7d1'; // Blue for Viewer
      default:
        return '#95a5a6'; // Gray for unknown
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return '👑'; // Crown for Super Admin
      case 'Admin':
        return '🛡️'; // Shield for Admin
      case 'Viewer':
        return '👁️'; // Eye for Viewer
      default:
        return '👤'; // Person for unknown
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🌺</span>
          <span className="logo-text">NomadPay</span>
        </div>
        <div className="admin-badge">Admin Panel</div>
        
        {/* Role Badge */}
        <div 
          className="role-badge" 
          style={{ 
            backgroundColor: getRoleColor(userRole),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '8px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <span>{getRoleIcon(userRole)}</span>
          <span>{userRole}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        
        {/* Show disabled items for sections user doesn't have access to */}
        {allMenuItems
          .filter(item => !availableSections.includes(item.id))
          .map((item) => (
            <div
              key={`disabled-${item.id}`}
              className="nav-item disabled"
              title={`Access denied - ${userRole} role required`}
            >
              <span className="nav-icon" style={{ opacity: 0.3 }}>{item.icon}</span>
              <span className="nav-label" style={{ opacity: 0.3 }}>{item.label}</span>
              <span className="access-denied-icon">🔒</span>
            </div>
          ))
        }
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

