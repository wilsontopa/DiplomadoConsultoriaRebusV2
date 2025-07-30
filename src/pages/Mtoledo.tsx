import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { moduleService, ModuleContent } from '../services/moduleService';

const ModuleViewer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (moduleId) {
      setIsLoading(true);
      moduleService.fetchModuleContent(moduleId)
        .then(data => {
          setContent(data);
        })
        .catch(error => {
          console.error("Failed to load module content", error);
          setContent(null); // Asegurarse de limpiar en caso de error
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [moduleId]);

  if (isLoading) {
    return <div>Cargando módulo...</div>;
  }

  if (!content) {
    return <div>No se pudo cargar el contenido del módulo.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Módulo {moduleId}</h2>
      <hr />

      {/* Renderiza el contenido HTML */}
      <div className="card mb-4">
        <div className="card-body">
          <div dangerouslySetInnerHTML={{ __html: content.htmlContent }} />
        </div>
      </div>

      {/* Renderiza la actividad si existe */}
      {content.activity && (
        <div className="card border-info">
          <div className="card-header bg-info text-white">{content.activity.title}</div>
          <div className="card-body">
            <p className="card-text">{content.activity.instructions}</p>
            <p className="card-text"><small className="text-muted">Entregable: {content.activity.deliverable}</small></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleViewer;
