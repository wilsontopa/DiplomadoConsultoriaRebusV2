// --- DEFINICIÓN DE TIPOS ---
export interface User {
  id: string; // ID único para cada usuario
  personalData: {
    identificationType: string;
    identificationNumber: string;
    fullName: string;
    city: string;
    country: string;
    profession: string;
  };
  credentials: {
    username: string;
    password?: string;
  };
  role: 'administrator' | 'student';
  status: 'active' | 'archived';
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    role: 'administrator' | 'student';
  };
}

const USERS_STORAGE_KEY = 'diplomadoUsers';

// --- FUNCIONES DE GESTIÓN DE USUARIOS ---

// Función para migrar datos antiguos al nuevo formato
const migrateOldUsers = (oldUsers: any[]): User[] => {
  return oldUsers.map((u, index) => ({
    id: `user-${Date.now()}-${index}`,
    personalData: {
      identificationType: 'N/A',
      identificationNumber: 'N/A',
      fullName: u.username || 'Usuario Migrado',
      city: 'N/A',
      country: 'N/A',
      profession: 'N/A',
    },
    credentials: {
      username: u.username,
      password: u.password,
    },
    role: u.role,
    status: 'active',
  }));
};

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersJson) {
    // Si no hay usuarios, creamos el admin por defecto
    const defaultUsers: User[] = [
      {
        id: `user-${Date.now()}-0`,
        personalData: { fullName: 'Administrador Principal', identificationType: 'N/A', identificationNumber: 'N/A', city: 'N/A', country: 'N/A', profession: 'N/A' },
        credentials: { username: 'admin', password: 'adminpassword' },
        role: 'administrator',
        status: 'active',
      },
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  const users = JSON.parse(usersJson);
  // Comprobamos si el primer usuario tiene la nueva estructura
  if (users.length > 0 && users[0].credentials) {
    return users; // Ya están en el nuevo formato
  }
  
  // Si no, migramos los datos
  console.log("Migrando usuarios al nuevo formato de datos...");
  const migratedUsers = migrateOldUsers(users);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(migratedUsers));
  return migratedUsers;
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const createUser = async (newUser: Omit<User, 'id' | 'status'>): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    const users = getUsers();
    const userExists = users.some(u => u.credentials.username === newUser.credentials.username);

    if (userExists) {
      resolve({ success: false, message: 'El nombre de usuario ya existe.' });
    } else {
      const userWithId: User = {
        ...newUser,
        id: `user-${Date.now()}`,
        status: 'active',
      };
      users.push(userWithId);
      saveUsers(users);
      resolve({ success: true });
    }
  });
};

export const archiveUser = (userId: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].status = 'archived';
    saveUsers(users);
  }
};

export const reactivateUser = (userId: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].status = 'active';
    saveUsers(users);
  }
};

// --- FUNCIONES DE AUTENTICACIÓN ---

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getUsers();
      const foundUser = users.find(u => u.credentials.username === username && u.credentials.password === password && u.status === 'active');

      if (foundUser) {
        const userData = { id: foundUser.id, username: foundUser.credentials.username, role: foundUser.role };
        localStorage.setItem('user', JSON.stringify(userData));
        resolve({ success: true, user: userData });
      } else {
        resolve({ success: false, message: 'Usuario o contraseña incorrectos, o el usuario está inactivo.' });
      }
    }, 500);
  });
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): { id: string; username: string; role: 'administrator' | 'student' } | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  try {
    const userData = JSON.parse(userJson);
    if (userData && userData.username && userData.role) {
      return userData;
    }
    localStorage.removeItem('user');
    return null;
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};