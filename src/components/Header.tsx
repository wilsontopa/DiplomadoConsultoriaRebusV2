import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/authService';

interface HeaderProps {
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuthenticated(false); // Actualizar el estado de autenticación en App.tsx
    navigate('/login');
  };

  return (
    <header className="navbar navbar-dark bg-rebus-dark flex-shrink-0">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/Logo_Rebus.png" alt="Rebus Insights Logo" style={{ height: '30px', marginRight: '10px' }} />
          <span className="text-rebus-gold">REBUS INSIGHTS - Plataforma de Formación</span>
        </Link>
        {
          isAuthenticated() && (
            <button 
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          )
        }
      </div>
    </header>
  );
};

export default Header;
