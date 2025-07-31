
import React from 'react';

// El componente Home ya no necesita saber si el usuario está autenticado,
// porque solo se renderizará si el usuario ya ha pasado un ProtectedRoute.
const Home: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3">
        <h1 className="text-body-emphasis">Diplomado en Consultoría Estratégica</h1>
        <p className="col-lg-8 mx-auto fs-5 text-muted">
          ¡Bienvenido de nuevo! Has iniciado sesión correctamente.
          <br />
          Selecciona un módulo en la barra lateral para comenzar o continuar tu viaje de aprendizaje.
        </p>
      </div>
    </div>
  );
};

export default Home;
