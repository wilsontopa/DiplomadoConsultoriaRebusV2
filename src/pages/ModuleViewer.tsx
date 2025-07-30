import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import HtmlContent from '../components/HtmlContent';
import ActivityViewer from '../components/ActivityViewer';
import ResourcesViewer from '../components/ResourcesViewer';
// Importamos tanto la función como el tipo de dato que devuelve.
// Usamos "import type" para la interfaz para asegurar que no se incluya en el build final.
import { getModuleContent } from '../services/moduleService';
import type { ModuleItemContent } from '../services/moduleService';

const ModuleViewer: React.FC = () => {
  const { moduleId, itemId } = useParams<{ moduleId: string; itemId: string }>();
  const [content, setContent] = useState<ModuleItemContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Aseguramos que tenemos los IDs antes de hacer la llamada.
    if (moduleId && itemId) {
      setIsLoading(true);
      const fetchContent = async () => {
        const data = await getModuleContent(moduleId, itemId);
        setContent(data);
        setIsLoading(false);
      };

      fetchContent();
    }
  }, [moduleId, itemId]); // El efecto se ejecuta cada vez que cambia el módulo o el ítem.

  // Renderizado condicional basado en el estado de carga.
  if (isLoading) {
    return <div>Cargando contenido...</div>;
  }

  // Si no hay contenido o el tipo es 'error', mostramos un mensaje.
  if (!content || content.type === 'error') {
    const errorMessage = typeof content?.data === 'string' 
      ? content.data 
      : 'Error al cargar el contenido. Por favor, seleccione otro ítem o inténtelo de nuevo.';
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  // Función para renderizar el componente correcto según el tipo de contenido.
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
        // Esto no debería ocurrir si manejamos todos los casos, pero es una buena práctica tenerlo.
        return <div className="alert alert-warning">Tipo de contenido no soportado.</div>;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default ModuleViewer;