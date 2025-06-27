import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = ['admin', 'superadmin'] 
}) => {
  const { isAuthenticated, user, checkTokenValidity } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateAccess();
  }, [isAuthenticated, user]);

  const validateAccess = async () => {
    try {
      if (!isAuthenticated || !user) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Check if user has required role (normalize role names)
      const normalizeRole = (role: string) => role.toLowerCase().replace(/\s+/g, '');
      const userRoleNormalized = normalizeRole(user.role);
      const requiredRolesNormalized = requiredRole.map(role => normalizeRole(role));
      
      if (!requiredRolesNormalized.includes(userRoleNormalized)) {
        console.warn('Access denied: User does not have required role', {
          userRole: user.role,
          requiredRoles: requiredRole
        });
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Validate token with backend
      const tokenValid = await checkTokenValidity();
      if (!tokenValid) {
        console.warn('Access denied: Invalid or expired token');
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      setIsValid(true);
    } catch (error) {
      console.error('Error validating access:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  if (isValidating) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Validating access...</p>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

