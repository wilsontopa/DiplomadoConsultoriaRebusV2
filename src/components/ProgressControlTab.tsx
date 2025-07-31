
import React, { useState, useEffect, useCallback } from 'react';
import {
  getAllUsersProgress,
  isItemCompleted,
  toggleItemCompletion,
  resetUserProgress,
  resetFinalAIAnalysis // Importar la nueva función
} from '../services/progressService';
import { baseMenu } from '../App';
import type { MenuItem } from '../App';

const ProgressControlTab: React.FC = () => {
  const courseModules = baseMenu.filter(item => item.type === 'module' && baseMenu.some(sub => sub.parentId === item.id));

  const [usersProgress, setUsersProgress] = useState<{ [userId: string]: any }>({});
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const loadProgressData = useCallback(() => {
    const allProgress = getAllUsersProgress();
    setUsersProgress(allProgress);
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const handleToggleItem = (userId: string, moduleId: string, itemId: string) => {
    toggleItemCompletion(userId, moduleId, itemId);
    loadProgressData();
  };

  const handleResetProgress = (userId: string) => {
    if (window.confirm(`¿Estás seguro de que quieres reiniciar todo el progreso del usuario "${userId}"?`)) {
      resetUserProgress(userId);
      loadProgressData();
    }
  };

  const handleResetAIAnalysis = (userId: string) => {
    if (window.confirm(`¿Estás seguro de que quieres reiniciar el análisis de IA para el usuario "${userId}"?`)) {
      resetFinalAIAnalysis(userId);
      loadProgressData();
    }
  };

  return (
    <div>
      <h4>Progreso de Usuarios</h4>
      {Object.keys(usersProgress).length === 0 ? (
        <p>No hay progreso de usuarios registrado aún.</p>
      ) : (
        Object.keys(usersProgress).map(userId => (
          <div key={userId} className="card mb-2">
            <div 
              className="card-header d-flex justify-content-between align-items-center"
              onClick={() => setExpandedUserId(prevId => (prevId === userId ? null : userId))}
              style={{ cursor: 'pointer' }}
            >
              <h5 className="mb-0">Usuario: {userId}</h5>
              <span>{expandedUserId === userId ? '▲' : '▼'}</span>
            </div>
            
            {expandedUserId === userId && (
              <div className="card-body">
                {courseModules.map(module => (
                  <div key={module.id} className="mb-3">
                    <h6>{module.label}</h6>
                    <ul className="list-group">
                      {baseMenu
                        .filter(item => item.parentId === module.id)
                        .map(item => {
                          const completed = isItemCompleted(userId, item.moduleId, item.id);
                          return (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                              {item.label}
                              <div>
                                <span className={`badge me-2 ${completed ? 'bg-success' : 'bg-secondary'}`}>
                                  {completed ? 'Completado' : 'Pendiente'}
                                </span>
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleToggleItem(userId, item.moduleId, item.id)}
                                >
                                  {completed ? 'Anular' : 'Completar'}
                                </button>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-danger mt-2" 
                    onClick={() => handleResetProgress(userId)}
                  >
                    Reiniciar Progreso Total
                  </button>
                  <button 
                    className="btn btn-warning mt-2" 
                    onClick={() => handleResetAIAnalysis(userId)}
                  >
                    Reiniciar Análisis IA
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ProgressControlTab;
