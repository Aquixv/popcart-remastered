import React from 'react';
import { Navigate } from 'react-router-dom';
type RouteProps = {
children: React.ReactNode
};

const ProtectedRoute = ({ children }: RouteProps) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />; 
  }
  return children;
};

export default ProtectedRoute;