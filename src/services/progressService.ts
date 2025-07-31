// Definimos la estructura para los resultados de una evaluación
export interface EvaluationResult {
  score: number;
  answers: { [questionId: string]: string | string[] };
}

// Definimos la estructura para el análisis final de la IA
export interface FinalAIAnalysisResult {
  analysis: string;
  generatedDilemma: string;
  submittedAt: number; // Timestamp de cuándo se generó el análisis
}

// La interfaz UserProgress ahora puede contener el resultado de una evaluación
interface UserProgress {
  [moduleId: string]: {
    [itemId: string]: 'completed' | EvaluationResult; // Un ítem puede ser 'completed' o un objeto EvaluationResult
  };
}

// La estructura principal del progreso del usuario, incluyendo el análisis final de la IA
interface AllUsersProgress {
  [userId: string]: {
    modularProgress: UserProgress;
    finalAIAnalysis?: FinalAIAnalysisResult; // Opcional, para el análisis final de la IA
  };
}

const PROGRESS_STORAGE_KEY = 'diplomadoProgress';

// --- FUNCIONES AUXILIARES INTERNAS ---

// Asegura que la estructura básica del usuario y su progreso modular existan
const ensureUserStructure = (allProgress: AllUsersProgress, userId: string) => {
  if (!allProgress[userId]) {
    allProgress[userId] = { modularProgress: {} };
    console.log(`ensureUserStructure: Creada estructura completa para userId: ${userId}`);
  } else if (!allProgress[userId].modularProgress || typeof allProgress[userId].modularProgress !== 'object') {
    // Si el usuario existe pero modularProgress es undefined o no es un objeto, lo inicializamos
    allProgress[userId].modularProgress = {};
    console.log(`ensureUserStructure: Inicializada modularProgress para userId: ${userId}`);
  }
};

// Asegura que la estructura del módulo exista dentro del progreso modular del usuario
const ensureModuleStructure = (userModularProgress: UserProgress, moduleId: string) => {
  if (!userModularProgress[moduleId]) {
    userModularProgress[moduleId] = {};
    console.log(`ensureModuleStructure: Creada estructura para moduleId: ${moduleId}`);
  }
};

// --- FUNCIONES DE LECTURA ---

export const getAllUsersProgress = (): AllUsersProgress => {
  try {
    const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '{}');
    console.log("getAllUsersProgress:", progress);
    return progress;
  } catch (error) {
    console.error("Error al parsear el progreso desde localStorage. Limpiando datos corruptos.", error);
    localStorage.removeItem(PROGRESS_STORAGE_KEY); // Limpiar datos corruptos
    return {}; // Devolver un objeto vacío
  }
};

export const getUserProgress = (userId: string): UserProgress => {
  const allProgress = getAllUsersProgress();
  const userProg = allProgress[userId]?.modularProgress || {};
  console.log(`getUserProgress(${userId}):`, userProg);
  return userProg;
};

export const isItemCompleted = (userId: string, moduleId: string, itemId: string): boolean => {
  const userProgress = getUserProgress(userId);
  const isComp = userProgress[moduleId]?.[itemId] === 'completed' || typeof userProgress[moduleId]?.[itemId] === 'object';
  console.log(`isItemCompleted(${userId}, ${moduleId}, ${itemId}): ${isComp}`);
  return isComp;
};

export const getEvaluationResult = (userId: string, moduleId: string, itemId: string): EvaluationResult | null => {
  const userProgress = getUserProgress(userId);
  const itemStatus = userProgress[moduleId]?.[itemId];
  const result = (typeof itemStatus === 'object' && itemStatus !== null) ? itemStatus as EvaluationResult : null;
  console.log(`getEvaluationResult(${userId}, ${moduleId}, ${itemId}):`, result);
  return result;
};

export const getFinalAIAnalysis = (userId: string): FinalAIAnalysisResult | null => {
  const allProgress = getAllUsersProgress();
  const analysis = allProgress[userId]?.finalAIAnalysis || null;
  console.log(`getFinalAIAnalysis(${userId}):`, analysis);
  return analysis;
};

// --- FUNCIONES DE ESCRITURA ---

const saveAllUsersProgress = (allProgress: AllUsersProgress): void => {
  console.log("saveAllUsersProgress: Guardando", allProgress);
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
};

export const markItemCompleted = (userId: string, moduleId: string, itemId: string): void => {
  console.log(`markItemCompleted: Llamada para userId: ${userId}, moduleId: ${moduleId}, itemId: ${itemId}`);
  const allProgress = getAllUsersProgress();
  ensureUserStructure(allProgress, userId);
  ensureModuleStructure(allProgress[userId].modularProgress, moduleId);
  allProgress[userId].modularProgress[moduleId][itemId] = 'completed';
  saveAllUsersProgress(allProgress);
  console.log("markItemCompleted: Guardado exitoso.");
};

export const saveEvaluationResult = (userId: string, moduleId: string, itemId: string, result: EvaluationResult): void => {
  console.log(`saveEvaluationResult: Llamada para userId: ${userId}, moduleId: ${moduleId}, itemId: ${itemId}, result:`, result);
  const allProgress = getAllUsersProgress();
  console.log("saveEvaluationResult: allProgress antes:", JSON.parse(JSON.stringify(allProgress))); // Clonar para ver el estado antes
  ensureUserStructure(allProgress, userId);
  ensureModuleStructure(allProgress[userId].modularProgress, moduleId);
  allProgress[userId].modularProgress[moduleId][itemId] = result; // Guardamos el objeto de resultado
  saveAllUsersProgress(allProgress);
  console.log("saveEvaluationResult: allProgress después:", JSON.parse(JSON.stringify(allProgress))); // Clonar para ver el estado después
  console.log("saveEvaluationResult: Guardado exitoso.");
};

export const saveFinalAIAnalysis = (userId: string, analysis: FinalAIAnalysisResult): void => {
  console.log(`saveFinalAIAnalysis: Llamada para userId: ${userId}`);
  const allProgress = getAllUsersProgress();
  ensureUserStructure(allProgress, userId);
  allProgress[userId].finalAIAnalysis = analysis;
  saveAllUsersProgress(allProgress);
  console.log("saveFinalAIAnalysis: Guardado exitoso.");
};

export const unmarkItemAsCompleted = (userId: string, moduleId: string, itemId: string): void => {
  console.log(`unmarkItemAsCompleted: Llamada para userId: ${userId}, moduleId: ${moduleId}, itemId: ${itemId}`);
  const allProgress = getAllUsersProgress();
  if (allProgress[userId]?.modularProgress?.[moduleId]?.[itemId]) {
    delete allProgress[userId].modularProgress[moduleId][itemId];
    // Limpieza: si el módulo queda vacío, lo eliminamos
    if (Object.keys(allProgress[userId].modularProgress[moduleId]).length === 0) {
      delete allProgress[userId].modularProgress[moduleId];
    }
    // Limpieza: si el progreso modular del usuario queda vacío, eliminamos el usuario
    if (Object.keys(allProgress[userId].modularProgress).length === 0 && !allProgress[userId].finalAIAnalysis) {
      delete allProgress[userId];
    }
  }
  saveAllUsersProgress(allProgress);
  console.log("unmarkItemAsCompleted: Guardado exitoso.");
};

export const toggleItemCompletion = (userId: string, moduleId: string, itemId: string): void => {
  console.log(`toggleItemCompletion: Llamada para userId: ${userId}, moduleId: ${moduleId}, itemId: ${itemId}`);
  // Obtenemos el tipo de ítem del menú para saber si es una evaluación
  // Esto requiere que el menú sea accesible aquí o que se pase el tipo.
  // Por simplicidad, asumiremos que los ítems de evaluación tienen 'evaluacion' en su itemId.
  const isEvaluationItem = itemId.startsWith('evaluacion');

  if (isItemCompleted(userId, moduleId, itemId)) {
    unmarkItemAsCompleted(userId, moduleId, itemId);
  } else {
    // Solo marcamos como 'completed' si NO es un ítem de evaluación.
    // Los ítems de evaluación se marcan al guardar sus resultados detallados.
    if (!isEvaluationItem) {
      markItemCompleted(userId, moduleId, itemId);
    } else {
      console.warn(`toggleItemCompletion: No se puede marcar el ítem de evaluación ${itemId} como 'completed' directamente. Use saveEvaluationResult.`);
    }
  }
};

export const resetUserProgress = (userId: string): void => {
  console.log(`resetUserProgress: Llamada para userId: ${userId}`);
  const allProgress = getAllUsersProgress();
  if (allProgress[userId]) {
    delete allProgress[userId];
  }
  saveAllUsersProgress(allProgress);
  console.log("resetUserProgress: Guardado exitoso.");
};

export const resetFinalAIAnalysis = (userId: string): void => {
  console.log(`resetFinalAIAnalysis: Llamada para userId: ${userId}`);
  const allProgress = getAllUsersProgress();
  if (allProgress[userId]?.finalAIAnalysis) {
    delete allProgress[userId].finalAIAnalysis;
    // Si el usuario no tiene progreso modular, eliminamos la entrada del usuario
    if (!allProgress[userId].modularProgress || Object.keys(allProgress[userId].modularProgress).length === 0) {
      delete allProgress[userId];
    }
  }
  saveAllUsersProgress(allProgress);
  console.log("resetFinalAIAnalysis: Guardado exitoso.");
};