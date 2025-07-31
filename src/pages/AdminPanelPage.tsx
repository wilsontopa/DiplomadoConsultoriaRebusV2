import React, { useState } from 'react';
import UserManagementTab from '../components/UserManagementTab';
import ProgressControlTab from '../components/ProgressControlTab';

const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' o 'progress'

  return (
    <div className="container py-5">
      <h2 className="mb-4">Panel de Administración</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Gestión de Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Control de Avance
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'users' && <UserManagementTab />}
        {activeTab === 'progress' && <ProgressControlTab />}
      </div>
    </div>
  );
};

export default AdminPanelPage;