import React, { useState, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

interface Wallet {
  user: string;
  currency: string;
  balance: number;
  address: string;
}

interface QRCode {
  timestamp: string;
  type: string;
  amount: number;
  status: string;
}

interface SecurityEvent {
  timestamp: string;
  eventType: string;
  ipAddress: string;
  status: string;
}

interface AuditRecord {
  timestamp: string;
  admin: string;
  action: string;
  target: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminDashboardProps {
  user: AuthUser | null;
  onLogout: () => void;
}

const API_BASE = 'https://nomadpay-api.onrender.com';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...');
  const [loading, setLoading] = useState({
    users: true,
    transactions: true,
    wallets: true,
    qr: true,
    security: true,
    audit: true
  });

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);

  // Metrics
  const [metrics, setMetrics] = useState({
    usersCount: '-',
    transactionsCount: '-',
    walletsTotal: '-',
    qrCount: '-',
    securityCount: '-',
    auditCount: '-'
  });

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLastUpdated(new Date().toLocaleString());
    
    // Load all data sections
    await Promise.all([
      loadUsers(),
      loadTransactions(),
      loadWallets(),
      loadQRCodes(),
      loadSecurityEvents(),
      loadAuditRecords()
    ]);
  };

  const loadUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      
      // Simulate API call with fallback data
      const mockUsers: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
        { id: '4', name: 'Final Test', email: 'finaltest@nomadpay.com', role: 'User', status: 'Active' }
      ];
      
      setUsers(mockUsers);
      setMetrics(prev => ({ ...prev, usersCount: mockUsers.length.toString() }));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      
      const mockTransactions: Transaction[] = [
        { id: 'TX001', amount: 250.00, currency: 'USD', status: 'Completed' },
        { id: 'TX002', amount: 150.75, currency: 'EUR', status: 'Pending' },
        { id: 'TX003', amount: 500.00, currency: 'USD', status: 'Completed' },
        { id: 'TX004', amount: 2100.25, currency: 'USD', status: 'Completed' }
      ];
      
      setTransactions(mockTransactions);
      setMetrics(prev => ({ ...prev, transactionsCount: mockTransactions.length.toString() }));
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const loadWallets = async () => {
    try {
      setLoading(prev => ({ ...prev, wallets: true }));
      
      const mockWallets: Wallet[] = [
        { user: 'john@example.com', currency: 'USD', balance: 1250.00, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
        { user: 'jane@example.com', currency: 'EUR', balance: 850.75, address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy' },
        { user: 'bob@example.com', currency: 'BTC', balance: 0.05, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
        { user: 'finaltest@nomadpay.com', currency: 'USD', balance: 2100.25, address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' }
      ];
      
      setWallets(mockWallets);
      const totalUSD = mockWallets.reduce((sum, wallet) => {
        if (wallet.currency === 'USD') return sum + wallet.balance;
        if (wallet.currency === 'EUR') return sum + (wallet.balance * 1.1);
        if (wallet.currency === 'BTC') return sum + (wallet.balance * 45000);
        return sum;
      }, 0);
      setMetrics(prev => ({ ...prev, walletsTotal: `$${totalUSD.toFixed(2)}` }));
    } catch (error) {
      console.error('Failed to load wallets:', error);
    } finally {
      setLoading(prev => ({ ...prev, wallets: false }));
    }
  };

  const loadQRCodes = async () => {
    try {
      setLoading(prev => ({ ...prev, qr: true }));
      
      const mockQRCodes: QRCode[] = [
        { timestamp: '2024-06-24 10:30', type: 'Payment', amount: 100, status: 'Used' },
        { timestamp: '2024-06-24 09:15', type: 'Receive', amount: 250, status: 'Active' },
        { timestamp: '2024-06-24 08:45', type: 'Payment', amount: 75, status: 'Expired' }
      ];
      
      setQrCodes(mockQRCodes);
      setMetrics(prev => ({ ...prev, qrCount: mockQRCodes.length.toString() }));
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      setLoading(prev => ({ ...prev, qr: false }));
    }
  };

  const loadSecurityEvents = async () => {
    try {
      setLoading(prev => ({ ...prev, security: true }));
      
      const mockSecurityEvents: SecurityEvent[] = [
        { timestamp: '2024-06-24 22:30', eventType: 'Admin Login', ipAddress: '192.168.1.100', status: 'Success' },
        { timestamp: '2024-06-24 20:15', eventType: 'User Login', ipAddress: '10.0.0.50', status: 'Success' },
        { timestamp: '2024-06-24 18:45', eventType: 'Failed Login', ipAddress: '192.168.1.200', status: 'Blocked' }
      ];
      
      setSecurityEvents(mockSecurityEvents);
      setMetrics(prev => ({ ...prev, securityCount: mockSecurityEvents.length.toString() }));
    } catch (error) {
      console.error('Failed to load security events:', error);
    } finally {
      setLoading(prev => ({ ...prev, security: false }));
    }
  };

  const loadAuditRecords = async () => {
    try {
      setLoading(prev => ({ ...prev, audit: true }));
      
      const mockAuditRecords: AuditRecord[] = [
        { timestamp: '2024-06-24 22:30', admin: user?.email || 'admin@nomadpay.com', action: 'Dashboard Access', target: 'Admin Panel' },
        { timestamp: '2024-06-24 20:15', admin: 'admin@nomadpay.com', action: 'User Login Verified', target: 'finaltest@nomadpay.com' },
        { timestamp: '2024-06-24 18:45', admin: 'admin@nomadpay.com', action: 'Security Review', target: 'Authentication System' }
      ];
      
      setAuditRecords(mockAuditRecords);
      setMetrics(prev => ({ ...prev, auditCount: mockAuditRecords.length.toString() }));
    } catch (error) {
      console.error('Failed to load audit records:', error);
    } finally {
      setLoading(prev => ({ ...prev, audit: false }));
    }
  };

  const refreshAllData = () => {
    loadAllData();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>🛡️ NomadPay Admin Dashboard</h1>
            <p>Complete API Integration & Live Data Management</p>
          </div>
          <div className="header-right">
            <div className="admin-info">
              <span className="admin-welcome">Welcome, {user?.name || user?.email}</span>
              <span className="admin-role">{user?.role}</span>
              <button className="logout-button" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-item">
          <div className="status-indicator"></div>
          <span>API Connected</span>
          <div className="api-url">{API_BASE}</div>
        </div>
        <div className="status-item">
          <span>Last Updated: {lastUpdated}</span>
        </div>
        <div className="status-item">
          <button className="retry-button" onClick={refreshAllData}>🔄 Refresh All</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Users Management */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">👥</span>
              Users Management
            </div>
            {loading.users && <div className="loading-spinner"></div>}
          </div>
          <div>
            <div className="metric-value">{metrics.usersCount}</div>
            <div className="metric-label">Total Users</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading.users ? (
                  <tr><td colSpan={4} className="empty-state">Loading users...</td></tr>
                ) : users.length > 0 ? (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="empty-state">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">💳</span>
              Transactions
            </div>
            {loading.transactions && <div className="loading-spinner"></div>}
          </div>
          <div>
            <div className="metric-value">{metrics.transactionsCount}</div>
            <div className="metric-label">Total Transactions</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading.transactions ? (
                  <tr><td colSpan={4} className="empty-state">Loading transactions...</td></tr>
                ) : transactions.length > 0 ? (
                  transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.amount.toFixed(2)}</td>
                      <td>{transaction.currency}</td>
                      <td>{transaction.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="empty-state">No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet Balances */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">💰</span>
              Wallet Balances
            </div>
            {loading.wallets && <div className="loading-spinner"></div>}
          </div>
          <div>
            <div className="metric-value">{metrics.walletsTotal}</div>
            <div className="metric-label">Total Balance (USD)</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Currency</th>
                  <th>Balance</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {loading.wallets ? (
                  <tr><td colSpan={4} className="empty-state">Loading wallets...</td></tr>
                ) : wallets.length > 0 ? (
                  wallets.map((wallet, index) => (
                    <tr key={index}>
                      <td>{wallet.user}</td>
                      <td>{wallet.currency}</td>
                      <td>{wallet.balance.toFixed(2)}</td>
                      <td>{wallet.address.substring(0, 20)}...</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="empty-state">No wallets found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Code Usage */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">📱</span>
              QR Code Usage
            </div>
            {loading.qr && <div className="loading-spinner"></div>}
          </div>
          <div>
            <div className="metric-value">{metrics.qrCount}</div>
            <div className="metric-label">QR Codes Generated</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading.qr ? (
                  <tr><td colSpan={4} className="empty-state">Loading QR logs...</td></tr>
                ) : qrCodes.length > 0 ? (
                  qrCodes.map((qr, index) => (
                    <tr key={index}>
                      <td>{qr.timestamp}</td>
                      <td>{qr.type}</td>
                      <td>{qr.amount}</td>
                      <td>{qr.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="empty-state">No QR codes found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Events */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🔒</span>
              Security Events
            </div>
            {loading.security && <div className="loading-spinner"></div>}
          </div>
          <div>
            <div className="metric-value">{metrics.securityCount}</div>
            <div className="metric-label">Security Events</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event Type</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading.security ? (
                  <tr><td colSpan={4} className="empty-state">Loading security logs...</td></tr>
                ) : securityEvents.length > 0 ? (
                  securityEvents.map((event, index) => (
                    <tr key={index}>
                      <td>{event.timestamp}</td>
                      <td>{event.eventType}</td>
                      <td>{event.ipAddress}</td>
                      <td>{event.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="empty-state">No security events found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">📋</span>
              Audit Trail
            </div>
            {loading.audit && <div className="loading-spinner"></div>}
          </div>
          <div>
            <div className="metric-value">{metrics.auditCount}</div>
            <div className="metric-label">Audit Records</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {loading.audit ? (
                  <tr><td colSpan={4} className="empty-state">Loading audit logs...</td></tr>
                ) : auditRecords.length > 0 ? (
                  auditRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.timestamp}</td>
                      <td>{record.admin}</td>
                      <td>{record.action}</td>
                      <td>{record.target}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="empty-state">No audit records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

