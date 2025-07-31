
import React, { useState } from 'react';
import { createUser } from '../services/authService';
import type { User } from '../services/authService';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

// Estado inicial para el formulario, reflejando la nueva estructura de User
const initialState = {
  personalData: {
    identificationType: 'C.C.',
    identificationNumber: '',
    fullName: '',
    city: '',
    country: 'Colombia',
    profession: '',
  },
  credentials: {
    username: '',
    password: '',
  },
  role: 'student' as 'student' | 'administrator',
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, dataset } = e.target;
    const section = dataset.section as keyof typeof initialState | undefined;

    if (section && (section === 'personalData' || section === 'credentials')) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value as any }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación básica de campos obligatorios
    if (
      !formData.personalData.fullName ||
      !formData.personalData.identificationNumber ||
      !formData.credentials.username ||
      !formData.credentials.password
    ) {
      setError('Por favor, complete todos los campos obligatorios (Nombre Completo, Identificación, Usuario, Contraseña).');
      return;
    }

    const newUser: Omit<User, 'id' | 'status'> = {
      personalData: formData.personalData,
      credentials: formData.credentials,
      role: formData.role,
    };

    const result = await createUser(newUser);

    if (result.success) {
      setSuccess(`¡Usuario "${formData.credentials.username}" creado exitosamente!`);
      setFormData(initialState); // Limpiar formulario
      onUserCreated();
    } else {
      setError(result.message || 'Ocurrió un error desconocido.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Crear Nuevo Usuario</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <fieldset className="mb-3 border p-3">
            <legend className="float-none w-auto px-2 h6">Datos Personales</legend>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="fullName">Nombre Completo</label>
                <input type="text" id="fullName" name="fullName" data-section="personalData" value={formData.personalData.fullName} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="profession">Profesión</label>
                <input type="text" id="profession" name="profession" data-section="personalData" value={formData.personalData.profession} onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="identificationType">Tipo de Identificación</label>
                <select id="identificationType" name="identificationType" data-section="personalData" value={formData.personalData.identificationType} onChange={handleChange} className="form-select">
                  <option value="C.C.">Cédula de Ciudadanía</option>
                  <option value="T.I.">Tarjeta de Identidad</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="C.E.">Cédula de Extranjería</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="identificationNumber">Número de Identificación</label>
                <input type="text" id="identificationNumber" name="identificationNumber" data-section="personalData" value={formData.personalData.identificationNumber} onChange={handleChange} className="form-control" required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="city">Ciudad de Residencia</label>
                <input type="text" id="city" name="city" data-section="personalData" value={formData.personalData.city} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="country">País</label>
                <input type="text" id="country" name="country" data-section="personalData" value={formData.personalData.country} onChange={handleChange} className="form-control" />
              </div>
            </div>
          </fieldset>

          <fieldset className="mb-3 border p-3">
            <legend className="float-none w-auto px-2 h6">Credenciales y Rol</legend>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="username">Nombre de Usuario</label>
                <input type="text" id="username" name="username" data-section="credentials" value={formData.credentials.username} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" data-section="credentials" value={formData.credentials.password} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="role">Rol</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                  <option value="student">Estudiante</option>
                  <option value="administrator">Administrador</option>
                </select>
              </div>
            </div>
          </fieldset>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary">Crear Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
