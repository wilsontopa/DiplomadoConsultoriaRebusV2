import React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  authenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ authenticated }) => {
  return (
    <div className="container py-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3">
        <h1 className="text-body-emphasis">Diplomado en Consultoría Estratégica</h1>
        <p className="col-lg-8 mx-auto fs-5 text-muted">
          Bienvenido a la plataforma de formación de REBUS INSIGHTS. Selecciona un módulo en la barra lateral para comenzar tu viaje de aprendizaje hacia la maestría en consultoría.
        </p>
        {!authenticated && (
          <div className="d-inline-flex gap-2 mb-5">
            <Link to="/login" className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;