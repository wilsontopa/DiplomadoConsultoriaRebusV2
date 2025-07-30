import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ModuleViewer from './pages/ModuleViewer';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { isAuthenticated } from './services/authService'; // Importar isAuthenticated

// Definimos el tipo de dato para cada item del menú, como especificaste.
export type MenuItem = {
  id: string;
  label: string;
  type: 'module' | 'subtopic';
  // El ID del módulo al que pertenece el subtema.
  // Para los módulos, este será su propio ID para simplificar la navegación.
  moduleId: string; 
  parentId?: string;
};

// Creamos el menú con la nueva estructura jerárquica.
const menu: MenuItem[] = [
  {
    id: 'mod-0', 
    label: 'Módulo 0: Introducción', 
    type: 'module',
    moduleId: '0'
  },
  {
    id: 'intro', 
    label: 'Bienvenida', 
    type: 'subtopic', 
    parentId: 'mod-0',
    moduleId: '0'
  },
  {
    id: 'contenido-0', // ID único para el contenido del módulo 0
    label: 'Fundamentos de Consultoría', 
    type: 'subtopic', 
    parentId: 'mod-0',
    moduleId: '0'
  },
  {
    id: 'mod-1', 
    label: 'Módulo 1: Estrategia', 
    type: 'module',
    moduleId: '1'
  },
  {
    id: 'intro-1', // ID único para la intro del módulo 1
    label: '¿Qué es la Estrategia?', 
    type: 'subtopic', 
    parentId: 'mod-1',
    moduleId: '1'
  },
  {
    id: 'contenido', 
    label: 'Análisis Competitivo', 
    type: 'subtopic', 
    parentId: 'mod-1',
    moduleId: '1'
  },
  {
    id: 'actividad', 
    label: 'Caso Práctico: FODA', 
    type: 'subtopic', 
    parentId: 'mod-1',
    moduleId: '1'
  },
  {
    id: 'recursos', 
    label: 'Lecturas Recomendadas', 
    type: 'subtopic', 
    parentId: 'mod-1',
    moduleId: '1'
  },
];

function App() {
  // Estado para controlar si el usuario está autenticado
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  // useEffect para escuchar cambios en localStorage (por si se abre en otra pestaña, etc.)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="wrapper">
        {/* Pasamos el nuevo menú al Sidebar solo si el usuario está autenticado */}
        {authenticated && <Sidebar menu={menu} />}
        <div id="content" className={authenticated ? "" : "full-width"}>
          {/* Pasamos setAuthenticated a Header para que pueda actualizar el estado al cerrar sesión */}
          <Header setAuthenticated={setAuthenticated} />
          <main className="main-content">
            <Routes>
              {/* Pasamos setAuthenticated a LoginPage para que pueda actualizar el estado al iniciar sesión */}
              <Route path="/" element={<Home authenticated={authenticated} />} />
              <Route path="/login" element={<LoginPage setAuthenticated={setAuthenticated} />} />
              <Route 
                path="/modulos/:moduleId/item/:itemId" 
                element={
                  <ProtectedRoute menu={menu}>
                    <ModuleViewer />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;