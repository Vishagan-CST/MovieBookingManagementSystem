import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface RouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

interface RoleRouteProps extends RouteProps {
  allowedRoles: ('admin' | 'customer')[];
}

export const RoleBasedRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
