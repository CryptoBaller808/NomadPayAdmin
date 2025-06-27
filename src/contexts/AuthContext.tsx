import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  checkTokenValidity: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'https://nomadpay-api.onrender.com';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('nomadpay_admin_token');
      const userData = localStorage.getItem('nomadpay_admin_user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        
        // Verify user has admin role
        if (parsedUser.role === 'Admin' || parsedUser.role === 'Super Admin') {
          // Optionally validate token with backend
          const isValid = await validateToken(token);
          
          if (isValid) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            clearAuthData();
          }
        } else {
          // User doesn't have admin role, clear session
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // For now, we'll assume the token is valid if it exists
      // In a real implementation, you would validate with the backend
      return true;
      
      // Example backend validation:
      // const response = await fetch(`${API_BASE}/api/auth/validate`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Admin login attempt:', { email, apiBase: API_BASE });
      
      // First try the real API
      try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);

        if (data.success && data.user) {
          // Check if user has admin role
          if (data.user.role === 'Admin' || data.user.role === 'Super Admin') {
            // Store authentication data
            localStorage.setItem('nomadpay_admin_token', data.access_token);
            localStorage.setItem('nomadpay_admin_refresh_token', data.refresh_token);
            localStorage.setItem('nomadpay_admin_user', JSON.stringify(data.user));
            
            setUser(data.user);
            setIsAuthenticated(true);
            
            // Log admin access for audit trail
            logAdminAccess(data.user.email, 'Admin Login', 'Success');
            
            return { success: true, message: 'Admin login successful!' };
          } else {
            // Log unauthorized access attempt
            logAdminAccess(email, 'Unauthorized Admin Access', 'Denied');
            return { success: false, message: 'Access denied. Admin privileges required.' };
          }
        } else {
          // API returned error, try mock authentication
          console.log('API login failed, trying mock authentication');
          
          // Fallback to mock authentication for testing
          const mockUsers = [
            { email: 'admin@nomadpay.com', password: 'admin123', role: 'Admin' },
            { email: 'superadmin@nomadpay.com', password: 'super123', role: 'Super Admin' }
          ];
          
          const mockUser = mockUsers.find(u => u.email === email && u.password === password);
          
          if (mockUser) {
            const userData = {
              id: '1',
              email: mockUser.email,
              name: mockUser.email.split('@')[0],
              role: mockUser.role,
              created_at: new Date().toISOString()
            };
            
            // Store mock authentication data
            localStorage.setItem('nomadpay_admin_token', 'mock_token_' + Date.now());
            localStorage.setItem('nomadpay_admin_user', JSON.stringify(userData));
            
            setUser(userData);
            setIsAuthenticated(true);
            
            // Log admin access for audit trail
            logAdminAccess(userData.email, 'Mock Admin Login', 'Success');
            
            return { success: true, message: 'Admin login successful! (Mock Mode)' };
          } else {
            // Log failed login attempt
            logAdminAccess(email, 'Failed Admin Login', 'Failed');
            return { success: false, message: data.message || 'Invalid credentials' };
          }
        }
      } catch (apiError) {
        console.log('API login failed, trying mock authentication:', apiError);
        
        // Fallback to mock authentication for testing
        const mockUsers = [
          { email: 'admin@nomadpay.com', password: 'admin123', role: 'Admin' },
          { email: 'superadmin@nomadpay.com', password: 'super123', role: 'Super Admin' }
        ];
        
        const mockUser = mockUsers.find(u => u.email === email && u.password === password);
        
        if (mockUser) {
          const userData = {
            id: '1',
            email: mockUser.email,
            name: mockUser.email.split('@')[0],
            role: mockUser.role,
            created_at: new Date().toISOString()
          };
          
          // Store mock authentication data
          localStorage.setItem('nomadpay_admin_token', 'mock_token_' + Date.now());
          localStorage.setItem('nomadpay_admin_user', JSON.stringify(userData));
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Log admin access for audit trail
          logAdminAccess(userData.email, 'Mock Admin Login', 'Success');
          
          return { success: true, message: 'Admin login successful! (Mock Mode)' };
        } else {
          logAdminAccess(email, 'Failed Mock Admin Login', 'Failed');
          return { success: false, message: 'Invalid credentials' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      logAdminAccess(email, 'Admin Login Error', 'Error');
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const logout = () => {
    // Log logout for audit trail
    if (user) {
      logAdminAccess(user.email, 'Admin Logout', 'Success');
    }
    
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('nomadpay_admin_token');
    localStorage.removeItem('nomadpay_admin_refresh_token');
    localStorage.removeItem('nomadpay_admin_user');
  };

  const checkTokenValidity = async (): Promise<boolean> => {
    const token = localStorage.getItem('nomadpay_admin_token');
    if (!token) return false;
    
    return await validateToken(token);
  };

  const logAdminAccess = (email: string, action: string, status: string) => {
    // In a real implementation, this would send to the backend
    console.log('Admin Access Log:', {
      timestamp: new Date().toISOString(),
      email,
      action,
      status,
      ip: 'Admin Panel',
      userAgent: navigator.userAgent
    });
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    checkTokenValidity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export { AuthContext };

