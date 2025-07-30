import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-3 mt-auto text-center text-white bg-rebus-dark">
      <div className="container">
        <p className="mb-1">
          © Perspectivas de Rebus 2025. Todos los derechos reservados. | Creado por Wilson Toledo, Director y Fundador de Rebus Insights.
        </p>
        <p className="mb-0">
          Desarrollado con la asistencia de Gemini, un modelo de lenguaje grande de Google. | Contacto: <a href="mailto:contacto@rebusinsights.net" className="text-rebus-gold">contacto@rebusinsights.net</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
