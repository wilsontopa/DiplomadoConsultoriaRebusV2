import React from 'react';

interface Resource {
  name: string;
  url: string;
}

interface ResourcesViewerProps {
  resources: Resource[];
}

const ResourcesViewer: React.FC<ResourcesViewerProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="card border-secondary mt-4">
      <div className="card-header bg-secondary text-white">Recursos Adicionales</div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {resources.map((resource, index) => (
            <li key={index} className="list-group-item">
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResourcesViewer;
