
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import HtmlContent from '../components/HtmlContent';
import ActivityViewer from '../components/ActivityViewer';
import ResourcesViewer from '../components/ResourcesViewer';
import ModuleEvaluation from '../components/ModuleEvaluation'; // Importar el nuevo componente
import { getModuleContent } from '../services/moduleService';
import type { ModuleItemContent } from '../services/moduleService';
import type { MenuItem } from '../App';
// Importamos los servicios necesarios
import { isItemCompleted, markItemCompleted } from '../services/progressService';
import { getCurrentUser } from '../services/authService';

interface ModuleViewerProps {
  menu: MenuItem[];
}

const ModuleViewer: React.FC<ModuleViewerProps> = ({ menu }) => {
  const { moduleId, itemId } = useParams<{ moduleId: string; itemId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ModuleItemContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completed, setCompleted] = useState(false);

  const currentUser = getCurrentUser();
  const userId = currentUser?.username || 'anonymous'; 

  const currentModuleSubtopics = menu.filter(
    (item) => item.type === 'subtopic' && item.moduleId === moduleId
  );
  const currentItemIndex = currentModuleSubtopics.findIndex(
    (item) => item.id === itemId
  );

  const prevItem = currentItemIndex > 0 ? currentModuleSubtopics[currentItemIndex - 1] : null;
  const nextItem = currentItemIndex < currentModuleSubtopics.length - 1 ? currentModuleSubtopics[currentItemIndex + 1] : null;

  useEffect(() => {
    console.log("ModuleViewer useEffect: moduleId=", moduleId, ", itemId=", itemId, ", userId=", userId);
    if (moduleId && itemId && userId !== 'anonymous') {
      setIsLoading(true);
      const fetchContent = async () => {
        const data = await getModuleContent(moduleId, itemId);
        setContent(data);
        setIsLoading(false);
        const isItemComp = isItemCompleted(userId, moduleId, itemId);
        setCompleted(isItemComp);
        console.log(`ModuleViewer: isItemCompleted(${userId}, ${moduleId}, ${itemId}) = ${isItemComp}`);
      };

      fetchContent();
    } else if (userId === 'anonymous') {
        console.error("No se pudo obtener el usuario para registrar el progreso.");
        setIsLoading(false);
    }
  }, [moduleId, itemId, userId]);

  const handleMarkCompleted = () => {
    console.log("handleMarkCompleted: userId=", userId, ", moduleId=", moduleId, ", itemId=", itemId);
    if (moduleId && itemId && userId !== 'anonymous') {
      markItemCompleted(userId, moduleId, itemId);
      setCompleted(true);
      console.log("handleMarkCompleted: setCompleted(true) called.");
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
      case 'evaluation': // Nuevo caso para evaluaciones
        return <ModuleEvaluation evaluation={content.data} moduleId={moduleId!} itemId={itemId!} />;
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
