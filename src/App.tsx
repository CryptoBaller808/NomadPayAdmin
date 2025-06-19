import React, { useState, useEffect } from 'react';
import './App.css';

// Types
interface User {
  id: string;
  email: string;
  created_at: string;
  status: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface Wallet {
  user_id: string;
  balance: string;
  currency: string;
  updated_at: string;
}

interface QRLog {
  id: string;
  user_id: string;
  action: string;
  created_at: string;
}

interface SecurityLog {
  id: string;
  event_type: string;
  ip_address: string;
  severity: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  admin_user: string;
  action: string;
  details: string;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

// Configuration
const API_BASE = process.env.REACT_APP_API_URL || 'https://nomadpay-api.onrender.com';
const FALLBACK_API = 'https://58hpi8clpqvp.manus.space';

// API utility
class AdminApiClient {
  private static getAuthToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  private static async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    // Create headers as Record<string, string> for proper TypeScript typing
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
    };

    // Try primary API first
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, requestOptions);
      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }

      // If 401, try to refresh token
      if (response.status === 401 && token) {
        await this.refreshToken();
        return this.makeRequest(endpoint, options);
      }

      throw new Error(`API Error: ${response.status}`);
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle abort error (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Primary API request timed out, trying fallback');
      } else {
        console.warn('Primary API failed, trying fallback:', error);
      }
      
      // Try fallback API with new AbortController
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);
      
      const fallbackOptions: RequestInit = {
        ...options,
        headers,
        signal: fallbackController.signal,
      };

      try {
        const response = await fetch(`${FALLBACK_API}${endpoint}`, fallbackOptions);
        clearTimeout(fallbackTimeoutId);

        if (response.ok) {
          return await response.json();
        }

        throw new Error(`Fallback API Error: ${response.status}`);
      } catch (fallbackError) {
        clearTimeout(fallbackTimeoutId);
        
        if (fallbackError instanceof Error && fallbackError.name === 'AbortError') {
          console.error('Both APIs timed out');
          throw new Error('Request timeout - please check your connection');
        } else {
          console.error('Both APIs failed:', fallbackError);
          throw new Error('Service temporarily unavailable');
        }
      }
    }
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ access_token: string }>('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.success && response.access_token) {
        localStorage.setItem('admin_token', response.access_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
    return false;
  }

  static async login(email: string, password: string): Promise<ApiResponse<{ access_token: string }>> {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.makeRequest('/api/admin/users');
  }

  static async getTransactions(): Promise<ApiResponse<{ transactions: Transaction[] }>> {
    return this.makeRequest('/api/admin/transactions');
  }

  static async getWallets(): Promise<ApiResponse<{ wallets: Wallet[] }>> {
    return this.makeRequest('/api/admin/wallets');
  }

  static async getQRLogs(): Promise<ApiResponse<{ qr_logs: QRLog[] }>> {
    return this.makeRequest('/api/admin/qr-logs');
  }

  static async getSecurityLogs(): Promise<ApiResponse<{ security_logs: SecurityLog[] }>> {
    return this.makeRequest('/api/admin/security-logs');
  }

  static async getAuditLogs(): Promise<ApiResponse<{ audit_logs: AuditLog[] }>> {
    return this.makeRequest('/api/admin/audit-history');
  }

  static logout(): void {
    localStorage.removeItem('admin_token');
    // Call logout API
    this.makeRequest('/api/auth/logout', { method: 'POST' }).catch(console.error);
  }
}

// Utility functions
const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className="loading" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true"></div>
    Loading...
  </div>
);

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="error-state" role="alert">
    <strong>Error:</strong> {message}
    {onRetry && (
      <button className="btn btn-secondary" onClick={onRetry} style={{ marginTop: '12px' }}>
        Retry
      </button>
    )}
  </div>
);

const DataTable: React.FC<{
  data: any[];
  columns: { key: string; label: string; format?: (value: any) => string }[];
  onExport: () => void;
  onRefresh: () => void;
}> = ({ data, columns, onExport, onRefresh }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available</p>
        <small>Data will appear here when available</small>
      </div>
    );
  }

  return (
    <div>
      <div className="table-actions">
        <button className="btn btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
        <button className="btn btn-success" onClick={onExport}>
          Export CSV
        </button>
      </div>
      <div className="table-container">
        <table className="data-table" role="table">
          <thead>
            <tr role="row">
              {columns.map((col) => (
                <th key={col.key} role="columnheader">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} role="row">
                {columns.map((col) => (
                  <td key={col.key} role="cell">
                    {col.format ? col.format(item[col.key]) : item[col.key] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="kpi-card">
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-content">
      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
    </div>
  </div>
);

const AdminLogin: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AdminApiClient.login(email, password);
      if (response.success && response.access_token) {
        localStorage.setItem('admin_token', response.access_token);
        onLogin(response.access_token);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">NP</div>
            <span>NomadPay Admin</span>
          </div>
        </div>
        <h2>Admin Login</h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter admin email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [qrLogs, setQRLogs] = useState<QRLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, transactionsRes, walletsRes, qrRes, securityRes, auditRes] = await Promise.allSettled([
        AdminApiClient.getUsers(),
        AdminApiClient.getTransactions(),
        AdminApiClient.getWallets(),
        AdminApiClient.getQRLogs(),
        AdminApiClient.getSecurityLogs(),
        AdminApiClient.getAuditLogs(),
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.users || []);
      }
      if (transactionsRes.status === 'fulfilled' && transactionsRes.value.success) {
        setTransactions(transactionsRes.value.transactions || []);
      }
      if (walletsRes.status === 'fulfilled' && walletsRes.value.success) {
        setWallets(walletsRes.value.wallets || []);
      }
      if (qrRes.status === 'fulfilled' && qrRes.value.success) {
        setQRLogs(qrRes.value.qr_logs || []);
      }
      if (securityRes.status === 'fulfilled' && securityRes.value.success) {
        setSecurityLogs(securityRes.value.security_logs || []);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value.success) {
        setAuditLogs(auditRes.value.audit_logs || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalVolume = transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount.toString()) || 0), 0);

  const userColumns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Joined', format: (date: string) => new Date(date).toLocaleDateString() },
    { key: 'status', label: 'Status' }
  ];

  const transactionColumns = [
    { key: 'id', label: 'ID' },
    { key: 'amount', label: 'Amount', format: (amount: number) => `$${amount}` },
    { key: 'currency', label: 'Currency' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Date', format: (date: string) => new Date(date).toLocaleDateString() }
  ];

  const walletColumns = [
    { key: 'user_id', label: 'User ID' },
    { key: 'balance', label: 'Balance', format: (balance: string) => `$${balance}` },
    { key: 'currency', label: 'Currency' },
    { key: 'updated_at', label: 'Last Updated', format: (date: string) => new Date(date).toLocaleDateString() }
  ];

  const qrColumns = [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User' },
    { key: 'action', label: 'Action' },
    { key: 'created_at', label: 'Timestamp', format: (date: string) => new Date(date).toLocaleString() }
  ];

  const securityColumns = [
    { key: 'id', label: 'ID' },
    { key: 'event_type', label: 'Event Type' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'severity', label: 'Severity' },
    { key: 'created_at', label: 'Timestamp', format: (date: string) => new Date(date).toLocaleString() }
  ];

  const auditColumns = [
    { key: 'id', label: 'ID' },
    { key: 'admin_user', label: 'Admin' },
    { key: 'action', label: 'Action' },
    { key: 'details', label: 'Details' },
    { key: 'created_at', label: 'Timestamp', format: (date: string) => new Date(date).toLocaleString() }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">
          <div className="logo-icon">NP</div>
          <span>NomadPay Admin</span>
        </div>
        <div className="header-actions">
          <span className="status-badge">System Online</span>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* KPI Overview */}
      <section className="kpi-section">
        <KPICard title="Total Users" value={users.length} icon="👥" />
        <KPICard title="Transactions" value={transactions.length} icon="💳" />
        <KPICard title="Volume" value={`$${totalVolume.toLocaleString()}`} icon="💰" />
        <KPICard title="Security Events" value={securityLogs.length} icon="🔒" />
      </section>

      {/* Data Tables */}
      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2 className="card-title">
            <span className="card-icon">👥</span>
            Users Management
          </h2>
          <DataTable
            data={users}
            columns={userColumns}
            onExport={() => exportToCSV(users, 'nomadpay-users.csv')}
            onRefresh={loadData}
          />
        </section>

        <section className="dashboard-card">
          <h2 className="card-title">
            <span className="card-icon">💳</span>
            Transactions
          </h2>
          <DataTable
            data={transactions}
            columns={transactionColumns}
            onExport={() => exportToCSV(transactions, 'nomadpay-transactions.csv')}
            onRefresh={loadData}
          />
        </section>

        <section className="dashboard-card">
          <h2 className="card-title">
            <span className="card-icon">💰</span>
            Wallet Balances
          </h2>
          <DataTable
            data={wallets}
            columns={walletColumns}
            onExport={() => exportToCSV(wallets, 'nomadpay-wallets.csv')}
            onRefresh={loadData}
          />
        </section>

        <section className="dashboard-card">
          <h2 className="card-title">
            <span className="card-icon">📱</span>
            QR Code Usage
          </h2>
          <DataTable
            data={qrLogs}
            columns={qrColumns}
            onExport={() => exportToCSV(qrLogs, 'nomadpay-qr-logs.csv')}
            onRefresh={loadData}
          />
        </section>

        <section className="dashboard-card">
          <h2 className="card-title">
            <span className="card-icon">🔒</span>
            Security Events
          </h2>
          <DataTable
            data={securityLogs}
            columns={securityColumns}
            onExport={() => exportToCSV(securityLogs, 'nomadpay-security-logs.csv')}
            onRefresh={loadData}
          />
        </section>

        <section className="dashboard-card">
          <h2 className="card-title">
            <span className="card-icon">📋</span>
            Audit Trail
          </h2>
          <DataTable
            data={auditLogs}
            columns={auditColumns}
            onExport={() => exportToCSV(auditLogs, 'nomadpay-audit-trail.csv')}
            onRefresh={loadData}
          />
        </section>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    AdminApiClient.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;

