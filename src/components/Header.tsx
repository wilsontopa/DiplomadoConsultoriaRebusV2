import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import type { User } from '../services/authService';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Forzamos un refresco para que App.tsx recargue el estado desde cero
    window.location.href = '/login';
  };

  return (
    <header className="navbar navbar-dark bg-rebus-dark flex-shrink-0">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/Logo_Rebus.png" alt="Rebus Insights Logo" style={{ height: '30px', marginRight: '10px' }} />
          <span className="text-rebus-gold">REBUS INSIGHTS - Plataforma de Formación</span>
        </Link>
        {
          user && (
            <div className="d-flex align-items-center">
              <span className="navbar-text text-white me-3">
                Bienvenido, {user.username} ({user.role})
              </span>
              <button 
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )
        }
      </div>
    </header>
  );
};

export default Header;