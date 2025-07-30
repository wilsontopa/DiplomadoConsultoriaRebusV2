import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import HtmlContent from '../components/HtmlContent';
import ActivityViewer from '../components/ActivityViewer';
import ResourcesViewer from '../components/ResourcesViewer';
import { getModuleContent } from '../services/moduleService';
import type { ModuleItemContent } from '../services/moduleService';
import type { MenuItem } from '../App';
// Importar funciones del servicio de progreso
import { isItemCompleted, markItemCompleted } from '../services/progressService';

interface ModuleViewerProps {
  menu: MenuItem[];
}

const ModuleViewer: React.FC<ModuleViewerProps> = ({ menu }) => {
  const { moduleId, itemId } = useParams<{ moduleId: string; itemId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ModuleItemContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Estado para controlar si el ítem actual está completado
  const [completed, setCompleted] = useState(false);

  // Usaremos un ID de usuario fijo por ahora para las pruebas
  const userId = 'defaultUser'; 

  // Lógica para encontrar el ítem actual y los ítems anterior/siguiente
  const currentModuleSubtopics = menu.filter(
    (item) => item.type === 'subtopic' && item.moduleId === moduleId
  );
  const currentItemIndex = currentModuleSubtopics.findIndex(
    (item) => item.id === itemId
  );

  const prevItem = currentItemIndex > 0 ? currentModuleSubtopics[currentItemIndex - 1] : null;
  const nextItem = currentItemIndex < currentModuleSubtopics.length - 1 ? currentModuleSubtopics[currentItemIndex + 1] : null;

  useEffect(() => {
    if (moduleId && itemId) {
      setIsLoading(true);
      const fetchContent = async () => {
        const data = await getModuleContent(moduleId, itemId);
        setContent(data);
        setIsLoading(false);
        // Verificar el estado de completado del ítem al cargar
        setCompleted(isItemCompleted(userId, moduleId, itemId));
      };

      fetchContent();
    }
  }, [moduleId, itemId, userId]); // Añadir userId a las dependencias

  // Función para marcar el ítem como completado
  const handleMarkCompleted = () => {
    if (moduleId && itemId) {
      markItemCompleted(userId, moduleId, itemId);
      setCompleted(true);
    }
  };

  if (isLoading) {
    return <div>Cargando contenido...</div>;
  }

  if (!content || content.type === 'error') {
    const errorMessage = typeof content?.data === 'string' 
      ? content.data 
      : 'Error al cargar el contenido. Por favor, seleccione otro ítem o inténtelo de nuevo.';
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  const renderContent = () => {
    switch (content.type) {
      case 'html':
        return <HtmlContent html={content.data} />;
      case 'video':
        return <VideoPlayer src={content.data} title="Video Introductorio" />;
      case 'activity':
        return <ActivityViewer activity={content.data} />;
      case 'resources':
        return <ResourcesViewer resources={content.data} />;
      default:
        return <div className="alert alert-warning">Tipo de contenido no soportado.</div>;
    }
  };

  return (
    <div className="module-viewer-container">
      {renderContent()}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/modulos/${prevItem?.moduleId}/item/${prevItem?.id}`)}
          disabled={!prevItem}
        >
          Anterior
        </button>
        
        {completed ? (
          <span className="badge bg-success fs-5 p-2">
            <i className="bi bi-check-circle-fill me-2"></i>Completado
          </span>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleMarkCompleted}
          >
            Marcar como Completado
          </button>
        )}

        <button
          className="btn btn-primary"
          onClick={() => navigate(`/modulos/${nextItem?.moduleId}/item/${nextItem?.id}`)}
          disabled={!nextItem}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ModuleViewer;