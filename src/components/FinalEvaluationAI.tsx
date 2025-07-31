import React, { useState, useEffect } from 'react';
import { generateDilemma, getFinalAnalysis } from '../services/aiService';
import { getAllUsersProgress, saveFinalAIAnalysis, getFinalAIAnalysis } from '../services/progressService';
import type { EvaluationResult, FinalAIAnalysisResult } from '../services/progressService';
import { getCurrentUser } from '../services/authService';

const FinalEvaluationAI: React.FC = () => {
  const [dilemma, setDilemma] = useState('');
  const [dilemmaResponse, setDilemmaResponse] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const currentUser = getCurrentUser();
  const userId = currentUser?.username;

  // Cargar análisis final existente o generar nuevo dilema
  useEffect(() => {
    if (!userId) {
      setError('Debe iniciar sesión para realizar la evaluación final.');
      return;
    }

    const existingAnalysis = getFinalAIAnalysis(userId);
    if (existingAnalysis) {
      setDilemma(existingAnalysis.generatedDilemma);
      setAiAnalysis(existingAnalysis.analysis);
      setIsCompleted(true);
    } else {
      const fetchDilemma = async () => {
        setIsLoading(true);
        try {
          const generated = await generateDilemma('consultoría estratégica'); // Tema fijo por ahora
          setDilemma(generated);
        } catch (err) {
          console.error("Error al generar dilema:", err);
          setError('No se pudo generar el dilema. Inténtelo de nuevo más tarde.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDilemma();
    }
  }, [userId]);

  const handleSubmit = async () => {
    if (!userId) {
      setError('Debe iniciar sesión para realizar la evaluación.');
      return;
    }
    if (!dilemmaResponse.trim()) {
      setError('Por favor, escriba su respuesta al dilema.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAiAnalysis('');

    try {
      // Recopilar resultados de evaluaciones modulares de forma más robusta
      const allProgress = getAllUsersProgress();
      const currentUserProgressData = allProgress[userId];
      const currentUserModularResults: { [moduleId: string]: { [itemId: string]: EvaluationResult } } = {};

      if (currentUserProgressData && currentUserProgressData.modularProgress) {
        for (const moduleId in currentUserProgressData.modularProgress) {
          if (Object.prototype.hasOwnProperty.call(currentUserProgressData.modularProgress, moduleId)) {
            for (const itemId in currentUserProgressData.modularProgress[moduleId]) {
              if (Object.prototype.hasOwnProperty.call(currentUserProgressData.modularProgress[moduleId], itemId)) {
                const itemData = currentUserProgressData.modularProgress[moduleId][itemId];
                if (typeof itemData === 'object' && itemData !== null && 'score' in itemData && 'answers' in itemData) {
                  if (!currentUserModularResults[moduleId]) {
                    currentUserModularResults[moduleId] = {};
                  }
                  currentUserModularResults[moduleId][itemId] = itemData as EvaluationResult;
                }
              }
            }
          }
        }
      }

      const finalAnalysis = await getFinalAnalysis(userId, currentUserModularResults, dilemma, dilemmaResponse);
      setAiAnalysis(finalAnalysis);

      // Guardar el análisis final
      const resultToSave: FinalAIAnalysisResult = {
        analysis: finalAnalysis,
        generatedDilemma: dilemma,
        submittedAt: Date.now(),
      };
      saveFinalAIAnalysis(userId, resultToSave);
      setIsCompleted(true);

    } catch (err) {
      console.error("Error al obtener análisis de IA:", err);
      setError('No se pudo obtener el análisis de la IA. Inténtelo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !dilemma) {
    return <div className="container py-5">Cargando dilema...</div>;
  }

  if (error) {
    return <div className="alert alert-danger container py-5">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Evaluación Final del Diplomado: El Dilema del Consultor</h2>
      <div className="card">
        <div className="card-body">
          {!isCompleted && (
            <p>En esta sección final, aplicará sus conocimientos a un dilema de consultoría real. Su respuesta, junto con el desempeño en las evaluaciones modulares, será analizada por nuestra Inteligencia Artificial para ofrecerle una retroalimentación personalizada.</p>
          )}
          
          <div className="mb-4">
            <h5>Dilema del Consultor:</h5>
            <p>{dilemma}</p>
            {!isCompleted && (
              <textarea
                className="form-control"
                rows={10}
                placeholder="Escriba aquí su análisis y propuesta estratégica..."
                value={dilemmaResponse}
                onChange={(e) => setDilemmaResponse(e.target.value)}
                disabled={isLoading}
              ></textarea>
            )}
          </div>

          {!isCompleted && (
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={isLoading || !dilemmaResponse.trim()}
            >
              {isLoading ? 'Analizando...' : 'Analizar'}
            </button>
          )}

          {aiAnalysis && (
            <div className="mt-4 p-3 border rounded bg-light">
              <h5>Retroalimentación de la IA:</h5>
              <p>{aiAnalysis}</p>
            </div>
          )}

          {isCompleted && (
            <div className="mt-4 alert alert-info">
              Ya has completado esta evaluación final. Puedes revisar tu análisis de la IA arriba.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalEvaluationAI;