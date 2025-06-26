import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login?: string;
}

interface UserModalData {
  user: User;
  isOpen: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [userModal, setUserModal] = useState<UserModalData>({ user: {} as User, isOpen: false });

  // Mock data - replace with API call
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      last_login: '2024-06-24T08:30:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-10T14:30:00Z',
      last_login: '2024-06-24T09:15:00Z'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      created_at: '2024-02-20T16:45:00Z',
      last_login: '2024-06-20T12:00:00Z'
    },
    {
      id: '4',
      name: 'Final Test',
      email: 'finaltest@nomadpay.com',
      role: 'user',
      status: 'active',
      created_at: '2024-06-24T14:33:49Z',
      last_login: '2024-06-24T22:30:00Z'
    },
    {
      id: '5',
      name: 'Admin User',
      email: 'admin@nomadpay.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-06-25T03:23:05Z',
      last_login: '2024-06-24T23:23:00Z'
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Simulate API call
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      console.log(`Updated user ${userId} role to ${newRole}`);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      // Simulate API call
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));
      console.log(`Toggled user ${userId} status`);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Simulate API call
        setUsers(users.filter(user => user.id !== userId));
        console.log(`Deleted user ${userId}`);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const openUserModal = (user: User) => {
    setUserModal({ user, isOpen: true });
  };

  const closeUserModal = () => {
    setUserModal({ user: {} as User, isOpen: false });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <p>Manage user accounts, roles, and permissions</p>
      </div>

      {/* Filters and Search */}
      <div className="user-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button onClick={loadUsers} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="user-stats">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-number">{users.filter(u => u.status === 'active').length}</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🛡️</span>
          <div className="stat-info">
            <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <span className="stat-number">{filteredUsers.length}</span>
            <span className="stat-label">Filtered Results</span>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="user-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>{user.last_login ? formatDate(user.last_login) : 'Never'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openUserModal(user)}
                        className="action-btn view"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        className={`action-btn ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="action-btn delete"
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            
            <span className="pagination-info">
              Page {currentPage} of {totalPages} ({filteredUsers.length} users)
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {userModal.isOpen && (
        <div className="modal-overlay" onClick={closeUserModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button onClick={closeUserModal} className="close-btn">✕</button>
            </div>
            
            <div className="modal-content">
              <div className="user-profile">
                <div className="profile-avatar">
                  {userModal.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h4>{userModal.user.name}</h4>
                  <p>{userModal.user.email}</p>
                  <span className={`status-badge ${userModal.user.status}`}>
                    {userModal.user.status}
                  </span>
                </div>
              </div>

              <div className="user-details">
                <div className="detail-row">
                  <span className="detail-label">User ID:</span>
                  <span className="detail-value">{userModal.user.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{userModal.user.role}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Registered:</span>
                  <span className="detail-value">{formatDate(userModal.user.created_at)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Login:</span>
                  <span className="detail-value">
                    {userModal.user.last_login ? formatDate(userModal.user.last_login) : 'Never'}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => handleStatusToggle(userModal.user.id)}
                  className={`modal-btn ${userModal.user.status === 'active' ? 'deactivate' : 'activate'}`}
                >
                  {userModal.user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                </button>
                <button
                  onClick={() => {
                    handleDeleteUser(userModal.user.id);
                    closeUserModal();
                  }}
                  className="modal-btn delete"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

