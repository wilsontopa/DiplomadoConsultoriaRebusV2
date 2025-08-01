import React, { useState } from 'react';
import { generateDilemma } from '../services/aiService';
import HtmlContent from '../components/HtmlContent';

const FinalEvaluationPage: React.FC = () => {
  const [dilemma, setDilemma] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const handleStartEvaluation = async () => {
    setIsStarted(true);
    setIsLoading(true);
    setError(null);

    try {
      const generatedDilemma = await generateDilemma();
      console.log("Dilema generado recibido:", generatedDilemma);
      setDilemma(generatedDilemma);
    } catch (err) {
      setError('Hubo un error al generar el dilema. Por favor, inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Evaluación Final del Diplomado</h2>
      
      {!isStarted ? (
        <div className="text-center">
          <p>Aquí aplicará sus conocimientos a un dilema de consultoría real. Su respuesta será analizada por nuestra IA.</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleStartEvaluation}
          >
            Iniciar Evaluación y Generar Dilema
          </button>
        </div>
      ) : isLoading ? (
        <div className="text-center">
          <p>Generando su dilema personalizado...</p>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => setIsStarted(false)}>
            Volver a intentar
          </button>
        </div>
      ) : dilemma && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Dilema del Consultor</h5>
            <HtmlContent html={dilemma} className="card-text text-justify" />
            <hr />
            <div className="mt-4">
              <h5>Su Respuesta</h5>
              <textarea
                className="form-control"
                rows={12}
                placeholder="Escriba aquí su análisis y propuesta estratégica..."
              ></textarea>
              <button className="btn btn-success mt-3">
                Enviar Análisis (Función no implementada)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalEvaluationPage;
