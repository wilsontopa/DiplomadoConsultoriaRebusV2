
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ModuleViewer from './pages/ModuleViewer';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import EvaluationPage from './pages/EvaluationPage';
import AdminPanelPage from './pages/AdminPanelPage';
import './App.css';
import { getCurrentUser } from './services/authService';
import type { User } from './services/authService';

export type MenuItem = {
  id: string;
  label: string;
  type: 'module' | 'subtopic';
  moduleId: string;
  parentId?: string;
  path?: string;
  allowedRoles?: ('administrator' | 'student')[];
};

export const baseMenu: MenuItem[] = [
    { id: 'mod-0', label: 'Módulo 0: Introducción', type: 'module', moduleId: '0' },
    { id: 'intro-0', label: 'Bienvenida', type: 'subtopic', parentId: 'mod-0', moduleId: '0' },
    { id: 'contenido-0', label: 'Fundamentos de Consultoría', type: 'subtopic', parentId: 'mod-0', moduleId: '0' },
    { id: 'evaluacion-0', label: 'Evaluación del Módulo 0', type: 'subtopic', parentId: 'mod-0', moduleId: '0' },
    { id: 'mod-1', label: 'Módulo 1: Estrategia', type: 'module', moduleId: '1' },
    { id: 'intro-1', label: '¿Qué es la Estrategia?', type: 'subtopic', parentId: 'mod-1', moduleId: '1' },
    { id: 'contenido-1', label: 'Análisis Competitivo', type: 'subtopic', parentId: 'mod-1', moduleId: '1' },
    { id: 'actividad-1', label: 'Caso Práctico: FODA', type: 'subtopic', parentId: 'mod-1', moduleId: '1' },
    { id: 'recursos-1', label: 'Lecturas Recomendadas', type: 'subtopic', parentId: 'mod-1', moduleId: '1' },
    { id: 'evaluacion', label: 'Evaluación Final', type: 'module', moduleId: 'evaluacion', path: '/evaluacion' },
];

const adminMenuItem: MenuItem = {
  id: 'admin-panel',
  label: 'Panel de Administración',
  type: 'module',
  moduleId: 'admin',
  path: '/admin',
  allowedRoles: ['administrator'],
};

// Componente Wrapper para aplicar la key y forzar el re-renderizado
const ModuleViewerWrapper: React.FC<{ menu: MenuItem[] }> = ({ menu }) => {
  const { moduleId, itemId } = useParams<{ moduleId: string; itemId: string }>();
  return <ModuleViewer key={`${moduleId}-${itemId}`} menu={menu} />;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>(baseMenu);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("App.tsx: localStorage.getItem('diplomadoProgress') al inicio:", localStorage.getItem('diplomadoProgress'));
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.role === 'administrator') {
        setMenu([...baseMenu, adminMenuItem]);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="wrapper">
        {user && <Sidebar menu={menu} />}
        <div id="content" className={user ? "" : "full-width"}>
          <Header user={user} />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
              <Route 
                path="/modulos/:moduleId/item/:itemId" 
                element={<ProtectedRoute user={user}><ModuleViewerWrapper menu={menu} /></ProtectedRoute>}
              />
              <Route 
                path="/evaluacion" 
                element={<ProtectedRoute user={user}><EvaluationPage /></ProtectedRoute>}
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute user={user} allowedRoles={['administrator']}>
                    <AdminPanelPage />
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
