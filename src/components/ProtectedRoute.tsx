import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // Si el usuario no está autenticado, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, renderizar los componentes hijos
  return <>{children}</>;
};

export default ProtectedRoute;
