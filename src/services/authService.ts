interface AuthResponse {
  success: boolean;
  message?: string;
}

const USERNAME = 'user';
const PASSWORD = 'password';

// Simula una llamada a una API de autenticación
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === USERNAME && password === PASSWORD) {
        // En una aplicación real, aquí se guardaría un token JWT o similar
        localStorage.setItem('isAuthenticated', 'true');
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Usuario o contraseña incorrectos.' });
      }
    }, 500); // Simula un retardo de red
  });
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};
