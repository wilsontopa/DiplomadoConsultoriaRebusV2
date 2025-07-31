import React, { useState, useEffect } from 'react';
import type { EvaluationContent, EvaluationQuestion } from '../services/moduleService';
import { saveEvaluationResult, getEvaluationResult } from '../services/progressService'; // Importar nuevas funciones
import type { EvaluationResult } from '../services/progressService'; // Importar la interfaz
import { getCurrentUser } from '../services/authService';

interface ModuleEvaluationProps {
  evaluation: EvaluationContent;
  moduleId: string;
  itemId: string;
}

const ModuleEvaluation: React.FC<ModuleEvaluationProps> = ({ evaluation, moduleId, itemId }) => {
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isCompletedAndApproved, setIsCompletedAndApproved] = useState(false); // Nuevo estado

  const currentUser = getCurrentUser();
  const userId = currentUser?.username || 'anonymous';

  // Cargar resultados existentes al montar el componente
  useEffect(() => {
    if (userId !== 'anonymous') {
      const existingResult = getEvaluationResult(userId, moduleId, itemId);
      if (existingResult) {
        setAnswers(existingResult.answers);
        setScore(existingResult.score);
        setSubmitted(true);
        if (existingResult.score >= 70) { // Asumimos 70% para aprobar
          setIsCompletedAndApproved(true);
        }
      }
    }
  }, [userId, moduleId, itemId]);

  const handleAnswerChange = (questionId: string, value: string | string[], type: EvaluationQuestion['type']) => {
    if (submitted) return; // No permitir cambios si ya fue enviado
    setAnswers(prev => {
      if (type === 'multiple-choice') {
        const currentAnswers = (prev[questionId] || []) as string[];
        if (currentAnswers.includes(value as string)) {
          return { ...prev, [questionId]: currentAnswers.filter(ans => ans !== value) };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, value as string] };
        }
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  const handleSubmit = () => {
    if (userId === 'anonymous') {
      console.error("No se pudo obtener el usuario para guardar el progreso.");
      return;
    }

    let correctCount = 0;
    evaluation.questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple-choice') {
        const sortedUserAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];
        const sortedCorrectAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer.sort() : [];
        if (JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedCorrectAnswers)) {
          correctCount++;
        }
      } else if (q.type === 'single-choice') { // Solo calificamos single-choice y multiple-choice
        if (userAnswer === q.correctAnswer) {
          correctCount++;
        }
      }
      // Las preguntas de tipo 'text' no se califican automáticamente aquí.
    });

    const calculatedScore = (correctCount / evaluation.questions.filter(q => q.type !== 'text').length) * 100; // Solo contamos preguntas calificables
    setScore(calculatedScore);
    setSubmitted(true);

    const resultToSave: EvaluationResult = {
      score: calculatedScore,
      answers: answers,
    };
    saveEvaluationResult(userId, moduleId, itemId, resultToSave);

    if (calculatedScore >= 70) {
      setIsCompletedAndApproved(true);
    }
  };

  const renderQuestion = (question: EvaluationQuestion) => {
    const isQuestionSubmitted = submitted || isCompletedAndApproved; // Deshabilitar si ya fue enviado o aprobado

    switch (question.type) {
      case 'single-choice':
        return (
          <div>
            {question.options?.map(option => (
              <div key={option} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={question.id}
                  id={`${question.id}-${option}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(question.id, option, question.type)}
                  disabled={isQuestionSubmitted}
                />
                <label className="form-check-label" htmlFor={`${question.id}-${option}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <div>
            {question.options?.map(option => (
              <div key={option} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name={question.id}
                  id={`${question.id}-${option}`}
                  value={option}
                  checked={(answers[question.id] as string[] || []).includes(option)}
                  onChange={() => handleAnswerChange(question.id, option, question.type)}
                  disabled={isQuestionSubmitted}
                />
                <label className="form-check-label" htmlFor={`${question.id}-${option}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'text':
        return (
          <textarea
            className="form-control"
            rows={3}
            value={answers[question.id] as string || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
            disabled={isQuestionSubmitted}
          ></textarea>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h4>{evaluation.title}</h4>
      </div>
      <div className="card-body">
        {evaluation.questions.map((question, index) => (
          <div key={question.id} className="mb-3">
            <p><strong>{index + 1}. {question.question}</strong></p>
            {renderQuestion(question)}
            {submitted && question.type !== 'text' && (
              <div className="mt-2">
                {question.type === 'multiple-choice' ? (
                  JSON.stringify((answers[question.id] as string[] || []).sort()) === JSON.stringify((question.correctAnswer as string[]).sort()) ? (
                    <span className="text-success">&#10003; Correcto</span>
                  ) : (
                    <span className="text-danger">&#10007; Incorrecto. Respuesta correcta: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}</span>
                  )
                ) : (
                  answers[question.id] === question.correctAnswer ? (
                    <span className="text-success">&#10003; Correcto</span>
                  ) : (
                    <span className="text-danger">&#10007; Incorrecto. Respuesta correcta: {question.correctAnswer}</span>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {!submitted && !isCompletedAndApproved && (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Enviar Evaluación
          </button>
        )}

        {submitted && score !== null && (
          <div className="mt-4 p-3 border rounded">
            <h5>Tu Puntuación: {score.toFixed(2)}%</h5>
            {score >= 70 ? (
              <p className="text-success">¡Felicidades! Has aprobado esta evaluación.</p>
            ) : (
              <p className="text-danger">Necesitas obtener al menos 70% para aprobar. Por favor, revisa tus respuestas.</p>
            )}
          </div>
        )}
        {isCompletedAndApproved && (
          <p className="text-success">Ya has completado y aprobado esta evaluación.</p>
        )}
      </div>
    </div>
  );
};

export default ModuleEvaluation;