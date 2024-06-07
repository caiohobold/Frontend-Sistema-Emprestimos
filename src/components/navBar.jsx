import React, { useState, useEffect } from 'react';
import '../styles/NavBar.css'; // Certifique-se de criar este arquivo CSS
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
    const [activeModule, setActiveModule] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      // Update the active module based on the current path
      if (location.pathname === '/Usuarios/Inicio') {
        setActiveModule('inicio');
      } else if (location.pathname === '/Usuarios/emprestimos') {
        setActiveModule('emprestimos');
      } else if (location.pathname === '/Usuarios/perfil') {
        setActiveModule('perfil');
      }
    }, [location]);
  
    const handleNavigation = (module, path) => {
      setActiveModule(module);
      navigate(path);
    };

  return (
    <div className="nav-bar">
      <button 
        className={`nav-button ${activeModule === 'inicio' ? 'active' : ''}`} 
        onClick={() => handleNavigation('inicio', '/Usuarios/Inicio')}
      >
        <div>
            <FontAwesomeIcon icon={faHouse} />
        </div>
        Início
      </button>
      <button 
        className={`nav-button ${activeModule === 'emprestimos' ? 'active' : ''}`} 
        onClick={() => handleNavigation('emprestimos', '/Usuarios/emprestimos')}
      >
        <div>
            <FontAwesomeIcon icon={faList} />
        </div>
        Empréstimos
      </button>
      <button 
        className={`nav-button ${activeModule === 'perfil' ? 'active' : ''}`} 
        onClick={() => handleNavigation('perfil', '/Usuarios/perfil')}
      >
         <div>
            <FontAwesomeIcon icon={faUser} />
        </div>
        Perfil
      </button>
    </div>
  );
};

export default NavBar;
