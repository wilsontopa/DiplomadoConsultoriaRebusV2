import type { EvaluationResult } from '../services/progressService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Usamos el modelo gemini-1.5-pro que es más reciente y compatible
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

const callGeminiApi = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("La clave de API de Gemini no está configurada. Por favor, añade VITE_GEMINI_API_KEY en tu archivo .env");
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de la API de Gemini:", errorData);
      throw new Error(`Error de la API de Gemini: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Respuesta inesperada de la API de Gemini:", data);
      throw new Error("Respuesta inesperada de la API de Gemini.");
    }
  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    throw error;
  }
};

/**
 * Genera un dilema de consultoría utilizando la API de Gemini.
 *
 * @param theme El tema o contexto para el dilema (ej. 'consultoría estratégica').
 * @returns Una promesa que resuelve con el texto del dilema generado.
 */
export const generateDilemma = async (theme: string): Promise<string> => {
  const prompt = `Genera un dilema de consultoría estratégica complejo y realista, adecuado para una evaluación final de un diplomado. El dilema debe presentar un conflicto de intereses o una situación ambigua que requiera un análisis profundo y una propuesta de solución estratégica. El tema principal es ${theme}.`;
  console.log("Prompt para generar dilema:", prompt);
  return callGeminiApi(prompt);
};

/**
 * Obtiene un análisis final del desempeño del estudiante utilizando la API de Gemini.
 *
 * @param userId El ID del usuario.
 * @param userModularResults Los resultados de las evaluaciones modulares del usuario.
 * @param generatedDilemma El dilema que fue generado por la IA.
 * @param dilemmaResponse La respuesta del usuario al dilema del consultor.
 * @returns Una promesa que resuelve con el análisis de la IA.
 */
export const getFinalAnalysis = async (
  userId: string,
  userModularResults: { [moduleId: string]: { [itemId: string]: EvaluationResult | 'completed' } },
  generatedDilemma: string,
  dilemmaResponse: string
): Promise<string> => {
  let prompt = `Eres un consultor estratégico experto y estás analizando el desempeño de un estudiante en un diplomado de consultoría. Aquí están sus resultados en las evaluaciones modulares:\n\n`;

  for (const moduleId in userModularResults) {
    if (Object.prototype.hasOwnProperty.call(userModularResults, moduleId)) {
      prompt += `Módulo ${moduleId}:\n`;
      for (const itemId in userModularResults[moduleId]) {
        if (Object.prototype.hasOwnProperty.call(userModularResults[moduleId], itemId)) {
          const itemData = userModularResults[moduleId][itemId];
          if (typeof itemData === 'object' && itemData !== null && 'score' in itemData && 'answers' in itemData) {
            const result = itemData as EvaluationResult;
            prompt += `  - Ítem ${itemId}: Puntuación ${result.score.toFixed(2)}%\n`;
            for (const questionId in result.answers) {
              if (Object.prototype.hasOwnProperty.call(result.answers, questionId)) {
                const answer = result.answers[questionId];
                if (typeof answer === 'string' && answer.length > 50) {
                  prompt += `    Respuesta a pregunta de texto libre (${questionId}): "${answer}"\n`;
                }
              }
            }
          }
        }
      }
      prompt += `\n`;
    }
  }

  prompt += `El dilema que se le presentó al estudiante fue:\n"${generatedDilemma}"\n\n`;
  prompt += `Y el estudiante respondió al dilema con:\n"${dilemmaResponse}"\n\n`;
  prompt += `Basado en todos estos datos, proporciona una retroalimentación constructiva y detallada sobre su desempeño general, sus fortalezas, áreas de mejora y cómo su respuesta al dilema se alinea con los principios de la consultoría estratégica. Sé conciso pero informativo.`;

  console.log("Prompt para análisis final:", prompt);
  return callGeminiApi(prompt);
};