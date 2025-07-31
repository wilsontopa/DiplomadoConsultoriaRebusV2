const BASE_URL = '/modulos';

// --- Nuevas interfaces para Evaluación ---
export interface EvaluationQuestion {
  id: string;
  question: string;
  type: 'single-choice' | 'multiple-choice' | 'text';
  options?: string[]; // Opcional para preguntas de texto
  correctAnswer: string | string[]; // Puede ser un string o un array de strings para multiple-choice
}

export interface EvaluationContent {
  title: string;
  questions: EvaluationQuestion[];
}
// --- Fin Nuevas interfaces para Evaluación ---

export interface ModuleItemContent {
  type: 'html' | 'video' | 'activity' | 'resources' | 'evaluation' | 'error'; // Añadimos 'evaluation'
  data: any;
}

/**
 * Carga el contenido de un ítem específico de un módulo según su tipo (itemId).
 * @param moduleId - El ID del módulo (ej: '1')
 * @param itemId - El ID del ítem (ej: 'contenido-0', 'intro-1', 'actividad', 'evaluacion-0')
 * @returns Una promesa que se resuelve con el tipo de contenido y los datos.
 */
export const getModuleContent = async (moduleId: string, itemId: string): Promise<ModuleItemContent> => {
  const modulePath = `${BASE_URL}/${moduleId}`;
  let resourceUrl = '';
  let type: ModuleItemContent['type'] = 'error';

  if (itemId.startsWith('intro')) {
    resourceUrl = `${modulePath}/intro.mp4`;
    type = 'video';
    return Promise.resolve({ type, data: resourceUrl });
  } else if (itemId.startsWith('contenido')) {
    resourceUrl = `${modulePath}/contenido.html`;
    type = 'html';
  } else if (itemId.startsWith('actividad')) {
    resourceUrl = `${modulePath}/actividad.json`;
    type = 'activity';
  } else if (itemId.startsWith('recursos')) {
    resourceUrl = `${modulePath}/recursos.json`;
    type = 'resources';
  } else if (itemId.startsWith('evaluacion')) { // Nueva condición para evaluaciones
    resourceUrl = `${modulePath}/evaluacion.json`;
    type = 'evaluation';
  } else {
    return Promise.resolve({ type: 'error', data: 'Tipo de contenido no reconocido.' });
  }

  try {
    const response = await fetch(resourceUrl);
    if (!response.ok) {
      throw new Error(`Error al cargar ${resourceUrl}: ${response.statusText}`);
    }

    const data = type === 'html' ? await response.text() : await response.json();
    
    return { type, data };

  } catch (error) {
    console.error(`Error al cargar el contenido para el ítem ${itemId}:`, error);
    return { type: 'error', data: `No se pudo cargar el contenido para ${itemId}.` };
  }
};