interface UserProgress {
  [moduleId: string]: {
    [itemId: string]: 'completed';
  };
}

const PROGRESS_STORAGE_KEY = 'diplomadoProgress';

/**
 * Obtiene todo el progreso de un usuario específico.
 * @param userId El ID del usuario.
 * @returns Un objeto con el progreso del usuario.
 */
export const getUserProgress = (userId: string): UserProgress => {
  const allProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '{}');
  return allProgress[userId] || {};
};

/**
 * Marca un ítem específico como completado para un usuario.
 * @param userId El ID del usuario.
 * @param moduleId El ID del módulo.
 * @param itemId El ID del ítem.
 */
export const markItemCompleted = (userId: string, moduleId: string, itemId: string): void => {
  const allProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '{}');
  
  if (!allProgress[userId]) {
    allProgress[userId] = {};
  }
  if (!allProgress[userId][moduleId]) {
    allProgress[userId][moduleId] = {};
  }
  allProgress[userId][moduleId][itemId] = 'completed';
  
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
};

/**
 * Verifica si un ítem específico está completado para un usuario.
 * @param userId El ID del usuario.
 * @param moduleId El ID del módulo.
 * @param itemId El ID del ítem.
 * @returns True si el ítem está completado, false en caso contrario.
 */
export const isItemCompleted = (userId: string, moduleId: string, itemId: string): boolean => {
  const userProgress = getUserProgress(userId);
  return userProgress[moduleId]?.[itemId] === 'completed';
};
