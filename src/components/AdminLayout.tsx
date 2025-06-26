import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import SystemHealth from './SystemHealth';
import { usePermissions, PERMISSIONS } from '../utils/permissions';
import { useAuth } from '../contexts/AuthContext';

// Lazy load components that might not exist yet
const TransactionMonitoring = React.lazy(() => 
  import('./TransactionMonitoring').catch(() => ({ 
    default: () => (
      <div className="content-section">
        <div className="section-header">
          <h2>💳 Transaction Monitoring</h2>
          <p>Monitor and manage all platform transactions</p>
        </div>
        <div className="coming-soon">
          <span className="coming-soon-icon">🚧</span>
          <h3>Coming Soon</h3>
          <p>Advanced transaction monitoring features are being developed</p>
        </div>
      </div>
    )
  }))
);

const AuditLogs = React.lazy(() => 
  import('./AuditLogs').catch(() => ({ 
    default: () => (
      <div className="content-section">
        <div className="section-header">
          <h2>🕵️ Audit Logs</h2>
          <p>View administrative actions and security events</p>
        </div>
        <div className="coming-soon">
          <span className="coming-soon-icon">🚧</span>
          <h3>Coming Soon</h3>
          <p>Comprehensive audit logging system is being developed</p>
        </div>
      </div>
    )
  }))
);

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: string;
}

const AdminLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, logout } = useAuth();
  
  // Always call hooks at the top level - use empty string as fallback
  const permissions = usePermissions(user?.role || 'Viewer');;

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          
            <AdminDashboard user={user} onLogout={logout} />
          
        );
      
      case 'users':
        return (
          
            <UserManagement />
          
        );
      
      case 'transactions':
        return (
          
            <React.Suspense fallback={<div className="loading-state"><div className="loading-spinner"></div><p>Loading...</p></div>}>
              <TransactionMonitoring />
            </React.Suspense>
          
        );
      
      case 'audit-logs':
        return (
          
            <React.Suspense fallback={<div className="loading-state"><div className="loading-spinner"></div><p>Loading...</p></div>}>
              <AuditLogs />
            </React.Suspense>
          
        );
      
      case 'system':
        return (
          
            <SystemHealth />
          
        );
      
      case 'settings':
        return (
          
            <SystemSettings />
          
        );
      
      default:
        return (
          
            <AdminDashboard user={user} onLogout={logout} />
          
        );
    }
  };

  // Filter available sections based on user permissions
  const getAvailableSections = () => {
    if (!permissions) return ['dashboard'];
    
    const sections = [];
    
    if (permissions.canAccessSection('dashboard')) {
      sections.push('dashboard');
    }
    if (permissions.canAccessSection('users')) {
      sections.push('users');
    }
    if (permissions.canAccessSection('transactions')) {
      sections.push('transactions');
    }
    if (permissions.canAccessSection('audit-logs')) {
      sections.push('audit-logs');
    }
    if (permissions.canAccessSection('system')) {
      sections.push('system');
    }
    if (permissions.canAccessSection('settings')) {
      sections.push('settings');
    }
    
    return sections;
  };

  const availableSections = getAvailableSections();

  // Redirect to available section if current section is not accessible
  React.useEffect(() => {
    if (!availableSections.includes(activeSection)) {
      setActiveSection(availableSections[0] || 'dashboard');
    }
  }, [activeSection, availableSections]);

  return (
    <div className="admin-layout">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={logout}
        availableSections={availableSections}
        userRole={user?.role}
      />
      
      <div className="main-content">
        <Header 
          user={user}
          activeSection={activeSection}
          onLogout={logout}
        />
        
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

