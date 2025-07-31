
import React, { useState, useEffect, useCallback } from 'react';
import CreateUserForm from '../components/CreateUserForm';
import { getUsers, archiveUser, reactivateUser } from '../services/authService';
import type { User } from '../services/authService';

const UserManagementTab: React.FC = () => {
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<User[]>([]);

  const loadAllUsers = useCallback(() => {
    setAllRegisteredUsers(getUsers());
  }, []);

  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  const handleArchiveUser = (userId: string) => {
    if (window.confirm(`¿Estás seguro de que quieres ARCHIVAR al usuario "${allRegisteredUsers.find(u => u.id === userId)?.credentials.username}"?`)) {
      archiveUser(userId);
      loadAllUsers();
    }
  };

  const handleReactivateUser = (userId: string) => {
    if (window.confirm(`¿Estás seguro de que quieres REACTIVAR al usuario "${allRegisteredUsers.find(u => u.id === userId)?.credentials.username}"?`)) {
      reactivateUser(userId);
      loadAllUsers();
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h4>Crear Nuevo Usuario</h4>
        <CreateUserForm onUserCreated={loadAllUsers} />
      </div>

      <div className="mb-5">
        <h4>Usuarios Registrados</h4>
        {allRegisteredUsers.length === 0 ? (
          <p>No hay usuarios registrados aún.</p>
        ) : (
          <ul className="list-group">
            {allRegisteredUsers.map(user => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user.personalData.fullName}</strong> ({user.credentials.username}) - {user.role} - Estado: {user.status === 'active' ? <span className="badge bg-success">Activo</span> : <span className="badge bg-secondary">Archivado</span>}
                </div>
                <div>
                  {user.status === 'active' ? (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleArchiveUser(user.id)}>Archivar</button>
                  ) : (
                    <button className="btn btn-sm btn-info me-2" onClick={() => handleReactivateUser(user.id)}>Reactivar</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserManagementTab;
