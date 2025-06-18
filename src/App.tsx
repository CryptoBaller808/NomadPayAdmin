import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Shield, 
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';
import './App.css';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  balance: number;
  joinDate: string;
  lastActivity: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: 'send' | 'receive' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  description: string;
}

interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activeUsers: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    balance: 1250.75,
    joinDate: '2024-01-15',
    lastActivity: '2025-06-17'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    balance: 890.50,
    joinDate: '2024-02-20',
    lastActivity: '2025-06-16'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'suspended',
    balance: 0.00,
    joinDate: '2024-03-10',
    lastActivity: '2025-06-10'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    userId: '1',
    type: 'send',
    amount: 100.00,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-06-17T10:30:00Z',
    description: 'Payment to merchant'
  },
  {
    id: 'tx2',
    userId: '2',
    type: 'receive',
    amount: 250.00,
    currency: 'EUR',
    status: 'completed',
    timestamp: '2025-06-17T09:15:00Z',
    description: 'Freelance payment'
  },
  {
    id: 'tx3',
    userId: '1',
    type: 'deposit',
    amount: 500.00,
    currency: 'USD',
    status: 'pending',
    timestamp: '2025-06-17T08:45:00Z',
    description: 'Bank transfer'
  }
];

const mockStats: DashboardStats = {
  totalUsers: 15420,
  totalTransactions: 89650,
  totalVolume: 2450000,
  activeUsers: 8920
};

// Components
const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/security', icon: Shield, label: 'Security' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <CreditCard className="logo-icon" />
          <span className="logo-text">NomadPay Admin</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>
      
      <div className="header-right">
        <div className="search-box">
          <Search className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        
        <button className="notification-btn">
          <Bell className="notification-icon" />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <span className="admin-name">Admin User</span>
        </div>
      </div>
    </header>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; trend: 'up' | 'down' }> = ({ title, value, change, trend }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  
  return (
    <div className="stat-card">
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        <DollarSign className="stat-icon" />
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${trend}`}>
        <TrendIcon className="trend-icon" />
        <span>{change}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={mockStats.totalUsers.toLocaleString()}
          change="+12.5%"
          trend="up"
        />
        <StatCard
          title="Total Transactions"
          value={mockStats.totalTransactions.toLocaleString()}
          change="+8.2%"
          trend="up"
        />
        <StatCard
          title="Total Volume"
          value={`$${(mockStats.totalVolume / 1000000).toFixed(1)}M`}
          change="+15.3%"
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={mockStats.activeUsers.toLocaleString()}
          change="-2.1%"
          trend="down"
        />
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {mockTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="activity-item">
                <div className="activity-icon">
                  <Activity />
                </div>
                <div className="activity-details">
                  <div className="activity-title">{tx.description}</div>
                  <div className="activity-meta">
                    {tx.type} • {tx.currency} {tx.amount} • {new Date(tx.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className={`activity-status ${tx.status}`}>
                  {tx.status}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn primary">
              <Plus className="btn-icon" />
              Add User
            </button>
            <button className="action-btn secondary">
              <Download className="btn-icon" />
              Export Data
            </button>
            <button className="action-btn secondary">
              <Shield className="btn-icon" />
              Security Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <button className="btn primary">
          <Plus className="btn-icon" />
          Add User
        </button>
      </div>
      
      <div className="filters">
        <div className="search-filter">
          <Search className="filter-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="status-filter">
          <Filter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <button className="btn secondary">
          <Download className="btn-icon" />
          Export
        </button>
      </div>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Balance</th>
              <th>Join Date</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>${user.balance.toFixed(2)}</td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>{new Date(user.lastActivity).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn">
                      <Eye className="action-icon" />
                    </button>
                    <button className="action-btn">
                      <Edit className="action-icon" />
                    </button>
                    <button className="action-btn danger">
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <button className="btn secondary">
          <Download className="btn-icon" />
          Export
        </button>
      </div>
      
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="tx-id">{tx.id}</td>
                <td>
                  <span className={`type-badge ${tx.type}`}>
                    {tx.type}
                  </span>
                </td>
                <td>{tx.currency} {tx.amount}</td>
                <td>
                  <span className={`status-badge ${tx.status}`}>
                    {tx.status}
                  </span>
                </td>
                <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn">
                      <Eye className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SecurityPage: React.FC = () => {
  return (
    <div className="security-page">
      <div className="page-header">
        <h1 className="page-title">Security & Compliance</h1>
      </div>
      
      <div className="security-grid">
        <div className="security-card">
          <h3>Security Alerts</h3>
          <div className="alert-list">
            <div className="alert-item warning">
              <Shield className="alert-icon" />
              <div className="alert-content">
                <div className="alert-title">Suspicious Login Detected</div>
                <div className="alert-time">2 hours ago</div>
              </div>
            </div>
            <div className="alert-item info">
              <Shield className="alert-icon" />
              <div className="alert-content">
                <div className="alert-title">Security Scan Completed</div>
                <div className="alert-time">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="security-card">
          <h3>System Status</h3>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">API Security</span>
              <span className="status-value good">Secure</span>
            </div>
            <div className="status-item">
              <span className="status-label">Database Encryption</span>
              <span className="status-value good">Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">2FA Coverage</span>
              <span className="status-value warning">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label className="setting-label">Platform Name</label>
            <input type="text" value="NomadPay" className="setting-input" />
          </div>
          <div className="setting-item">
            <label className="setting-label">Support Email</label>
            <input type="email" value="support@nomadpay.io" className="setting-input" />
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Security Settings</h3>
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" checked className="setting-checkbox" />
              Require 2FA for all users
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" checked className="setting-checkbox" />
              Enable login notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;

