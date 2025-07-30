import React from 'react';
import type { ModuleActivity } from '../services/moduleService';

interface ActivityViewerProps {
  activity: ModuleActivity;
}

const ActivityViewer: React.FC<ActivityViewerProps> = ({ activity }) => {
  return (
    <div className="card border-info">
      <div className="card-header bg-info text-white">{activity.title}</div>
      <div className="card-body">
        <p className="card-text">{activity.instructions}</p>
        <p className="card-text"><small className="text-muted">Entregable: {activity.deliverable}</small></p>
      </div>
    </div>
  );
};

export default ActivityViewer;
