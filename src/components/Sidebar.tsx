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
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🌺</span>
          <span>NomadPay</span>
        </div>
        
        {/* Role Badge */}
        <div 
          className="role-badge" 
          style={{ 
            backgroundColor: getRoleColor(userRole),
            color: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '15px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>{getRoleIcon(userRole)}</span>
          <span>{userRole}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        
        {/* Show disabled items for sections user doesn't have access to */}
        {allMenuItems
          .filter(item => !availableSections.includes(item.id))
          .map((item) => (
            <div
              key={`disabled-${item.id}`}
              className="sidebar-nav-item"
              style={{ opacity: 0.4, cursor: 'not-allowed' }}
              title={`Access denied - ${userRole} role required`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '12px' }}>🔒</span>
            </div>
          ))
        }
      </nav>

      {/* Remove the sidebar footer logout button to prevent duplicate */}
      {/* The logout button will be in the header only */}
    </div>
  );
};

export default Sidebar;

