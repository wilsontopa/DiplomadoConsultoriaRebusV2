const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Genera un dilema de consultoría utilizando la API de Gemini.
 */
export const generateDilemma = async (): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("La clave de API de Gemini no está configurada. Por favor, añade VITE_GEMINI_API_KEY en tu archivo .env");
  }

  const prompt = `Genera un dilema de consultoría estratégica complejo y realista, adecuado para una evaluación final de un diplomado. El dilema debe presentar un conflicto de intereses o una situación ambigua que requiera un análisis profundo y una propuesta de solución estratégica. Sé conciso y ve directo al grano, no excedas los 200 tokens. Formatea la respuesta usando etiquetas HTML básicas como <p> para los párrafos.`;

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
      throw new Error("Respuesta inesperada de la API de Gemini.");
    }
  } catch (error) {
    console.error("Error al generar el dilema:", error);
    throw error;
  }
};