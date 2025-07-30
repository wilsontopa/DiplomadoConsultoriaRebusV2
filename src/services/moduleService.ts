const BASE_URL = '/modulos';

export interface ModuleItemContent {
  type: 'html' | 'video' | 'activity' | 'resources' | 'error';
  data: any;
}

/**
 * Carga el contenido de un ítem específico de un módulo según su tipo (itemId).
 * Esta versión es más flexible y comprueba con qué cadena comienza el itemId.
 * @param moduleId - El ID del módulo (ej: '1')
 * @param itemId - El ID del ítem (ej: 'contenido-0', 'intro-1', 'actividad')
 * @returns Una promesa que se resuelve con el tipo de contenido y los datos.
 */
export const getModuleContent = async (moduleId: string, itemId: string): Promise<ModuleItemContent> => {
  const modulePath = `${BASE_URL}/${moduleId}`;
  let resourceUrl = '';
  let type: ModuleItemContent['type'] = 'error';

  // Hacemos la lógica más flexible usando startsWith
  if (itemId.startsWith('intro')) {
    resourceUrl = `${modulePath}/intro.mp4`;
    type = 'video';
    // Para videos, no hacemos fetch, solo devolvemos la URL.
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
  } else {
    // Si el itemId no coincide con ningún patrón, devolvemos un error.
    return Promise.resolve({ type: 'error', data: 'Tipo de contenido no reconocido.' });
  }

  try {
    const response = await fetch(resourceUrl);
    if (!response.ok) {
      throw new Error(`Error al cargar ${resourceUrl}: ${response.statusText}`);
    }

    // Parseamos la respuesta según el tipo de contenido
    const data = type === 'html' ? await response.text() : await response.json();
    
    return { type, data };

  } catch (error) {
    console.error(`Error al cargar el contenido para el ítem ${itemId}:`, error);
    return { type: 'error', data: `No se pudo cargar el contenido para ${itemId}.` };
  }
};
