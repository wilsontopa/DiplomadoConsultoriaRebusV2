import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { MenuItem } from '../App';
import './Sidebar.css';

interface SidebarProps {
  menu: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menu }) => {
  const [openModules, setOpenModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setOpenModules(prevOpenModules =>
      prevOpenModules.includes(moduleId)
        ? prevOpenModules.filter(id => id !== moduleId) // Si ya está, lo quito (cerrar)
        : [...prevOpenModules, moduleId] // Si no está, lo añado (abrir)
    );
  };

  const modules = menu.filter(item => item.type === 'module');

  return (
    <nav className="sidebar bg-light border-end">
      <div className="sidebar-header p-3 border-bottom">
        <h5 className="fw-bold">Diplomado REBUS</h5>
      </div>

      <div className="menu">
        {modules.map(module => {
          const isExpanded = openModules.includes(module.id);
          return (
            <div key={module.id}>
              <button 
                className={`module-toggle ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleModule(module.id)}
              >
                {module.label}
              </button>
              
              {isExpanded && (
                <div className="subtopic-container">
                  {menu
                    .filter(subtopic => subtopic.parentId === module.id)
                    .map(subtopic => (
                      <NavLink
                        key={subtopic.id}
                        to={`/modulos/${subtopic.moduleId}/item/${subtopic.id}`}
                        className={({ isActive }) => 
                          "subtopic" + (isActive ? " active" : "")
                        }
                      >
                        {subtopic.label}
                      </NavLink>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
