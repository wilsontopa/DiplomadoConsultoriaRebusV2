
import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactElement;
  user: User | null;
  allowedRoles?: ('administrator' | 'student')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user, allowedRoles }) => {
  // 1. Si no hay usuario, no está autenticado.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se requiere un rol específico y el usuario no lo tiene, redirigir.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirigimos a la página de inicio porque no tiene permiso.
    return <Navigate to="/" replace />;
  }

  // 3. Si pasa todas las validaciones, renderizar el contenido protegido.
  return children;
};

export default ProtectedRoute;
