// RBAC Permissions System for NomadPay Admin Panel

export type UserRole = 'Super Admin' | 'Admin' | 'Viewer';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

// Define all available permissions
export const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_REFRESH: 'dashboard:refresh',
  
  // User management permissions
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_CHANGE_ROLE: 'users:change_role',
  USERS_ACTIVATE: 'users:activate',
  USERS_DEACTIVATE: 'users:deactivate',
  
  // Transaction permissions
  TRANSACTIONS_VIEW: 'transactions:view',
  TRANSACTIONS_EDIT: 'transactions:edit',
  TRANSACTIONS_DELETE: 'transactions:delete',
  TRANSACTIONS_EXPORT: 'transactions:export',
  
  // Audit logs permissions
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  AUDIT_LOGS_EXPORT: 'audit_logs:export',
  
  // System settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  SETTINGS_SECURITY: 'settings:security',
  
  // System health and monitoring permissions
  SYSTEM_VIEW: 'system:view',
  SYSTEM_HEALTH: 'system:health',
  SYSTEM_RESTART: 'system:restart',
  SYSTEM_CACHE: 'system:cache',
  
  // System administration
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_LOGS: 'system:logs',
} as const;

// Role-based permission definitions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Super Admin': [
    // Full access to everything
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_REFRESH,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_CHANGE_ROLE,
    PERMISSIONS.USERS_ACTIVATE,
    PERMISSIONS.USERS_DEACTIVATE,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_EDIT,
    PERMISSIONS.TRANSACTIONS_DELETE,
    PERMISSIONS.TRANSACTIONS_EXPORT,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.AUDIT_LOGS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.SETTINGS_SECURITY,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.SYSTEM_HEALTH,
    PERMISSIONS.SYSTEM_RESTART,
    PERMISSIONS.SYSTEM_CACHE,
    PERMISSIONS.SYSTEM_MAINTENANCE,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_LOGS,
  ],
  
  'Admin': [
    // Access to dashboard, users, transactions, audit logs
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_REFRESH,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_ACTIVATE,
    PERMISSIONS.USERS_DEACTIVATE,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_EDIT,
    PERMISSIONS.TRANSACTIONS_EXPORT,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.SYSTEM_HEALTH,
    PERMISSIONS.SETTINGS_VIEW, // Can view but not edit settings
  ],
  
  'Viewer': [
    // Read-only access to dashboard and users
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
  ],
};

// Permission checking utilities
export class PermissionChecker {
  private userRole: UserRole;
  private userPermissions: string[];

  constructor(userRole: UserRole) {
    this.userRole = userRole;
    this.userPermissions = ROLE_PERMISSIONS[userRole] || [];
  }

  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Check if user has all of the specified permissions
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Check if user can access a specific section
  canAccessSection(section: string): boolean {
    switch (section) {
      case 'dashboard':
        return this.hasPermission(PERMISSIONS.DASHBOARD_VIEW);
      case 'users':
        return this.hasPermission(PERMISSIONS.USERS_VIEW);
      case 'transactions':
        return this.hasPermission(PERMISSIONS.TRANSACTIONS_VIEW);
      case 'audit-logs':
        return this.hasPermission(PERMISSIONS.AUDIT_LOGS_VIEW);
      case 'system':
        return this.hasPermission(PERMISSIONS.SYSTEM_VIEW);
      case 'settings':
        return this.hasPermission(PERMISSIONS.SETTINGS_VIEW);
      default:
        return false;
    }
  }

  // Check if user can perform an action on a resource
  canPerformAction(resource: string, action: string): boolean {
    const permission = `${resource}:${action}`;
    return this.hasPermission(permission);
  }

  // Get user's role
  getRole(): UserRole {
    return this.userRole;
  }

  // Get all user permissions
  getPermissions(): string[] {
    return [...this.userPermissions];
  }

  // Check if user is Super Admin
  isSuperAdmin(): boolean {
    return this.userRole === 'Super Admin';
  }

  // Check if user is Admin or higher
  isAdmin(): boolean {
    return this.userRole === 'Super Admin' || this.userRole === 'Admin';
  }

  // Check if user is Viewer only
  isViewer(): boolean {
    return this.userRole === 'Viewer';
  }
}

// React hook for permission checking
export const usePermissions = (userRole: string) => {
  const role = userRole as UserRole;
  const permissionChecker = new PermissionChecker(role);
  
  return {
    hasPermission: (permission: string) => permissionChecker.hasPermission(permission),
    hasAnyPermission: (permissions: string[]) => permissionChecker.hasAnyPermission(permissions),
    hasAllPermissions: (permissions: string[]) => permissionChecker.hasAllPermissions(permissions),
    canAccessSection: (section: string) => permissionChecker.canAccessSection(section),
    canPerformAction: (resource: string, action: string) => permissionChecker.canPerformAction(resource, action),
    getRole: () => permissionChecker.getRole(),
    getPermissions: () => permissionChecker.getPermissions(),
    isSuperAdmin: () => permissionChecker.isSuperAdmin(),
    isAdmin: () => permissionChecker.isAdmin(),
    isViewer: () => permissionChecker.isViewer(),
  };
};

// Role descriptions for UI display
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  'Super Admin': 'Full access to all features including system settings and security controls',
  'Admin': 'Access to dashboard, users, transactions, and audit logs with management capabilities',
  'Viewer': 'Read-only access to dashboard and user information',
};

// Section access requirements
export const SECTION_REQUIREMENTS: Record<string, string[]> = {
  dashboard: [PERMISSIONS.DASHBOARD_VIEW],
  users: [PERMISSIONS.USERS_VIEW],
  transactions: [PERMISSIONS.TRANSACTIONS_VIEW],
  'audit-logs': [PERMISSIONS.AUDIT_LOGS_VIEW],
  system: [PERMISSIONS.SYSTEM_VIEW],
  settings: [PERMISSIONS.SETTINGS_VIEW],
};

// Action requirements for different operations
export const ACTION_REQUIREMENTS: Record<string, string[]> = {
  'user-edit': [PERMISSIONS.USERS_EDIT],
  'user-delete': [PERMISSIONS.USERS_DELETE],
  'user-role-change': [PERMISSIONS.USERS_CHANGE_ROLE],
  'user-activate': [PERMISSIONS.USERS_ACTIVATE],
  'user-deactivate': [PERMISSIONS.USERS_DEACTIVATE],
  'transaction-edit': [PERMISSIONS.TRANSACTIONS_EDIT],
  'transaction-delete': [PERMISSIONS.TRANSACTIONS_DELETE],
  'settings-edit': [PERMISSIONS.SETTINGS_EDIT],
  'settings-security': [PERMISSIONS.SETTINGS_SECURITY],
};

export default PermissionChecker;

