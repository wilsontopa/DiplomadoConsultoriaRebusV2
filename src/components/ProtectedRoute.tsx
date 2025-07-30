import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import type { MenuItem } from '../App'; // Importar MenuItem

interface ProtectedRouteProps {
  children: React.ReactElement; // Cambiado a React.ReactElement para poder clonar
  menu: MenuItem[]; // Añadir la prop menu
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, menu }) => {
  if (!isAuthenticated()) {
    // Si el usuario no está autenticado, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, clonar el elemento hijo y pasarle la prop menu
  return React.cloneElement(children, { menu });
};

export default ProtectedRoute;