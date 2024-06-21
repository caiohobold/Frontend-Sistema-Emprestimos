import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import WheelShareLogo from '../photos/WheelShareLogo.png';
import '../styles/login.css';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faArrowLeft, faCircleUser, faPenToSquare, faLayerGroup, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AdminConfig = () =>{

    const navigate = useNavigate();

    const handleAccessClick = () => {
        navigate('/Associacoes/login'); 
    };

    const handleRegisterClick = () => {
        navigate('/Associacoes/register')
    };

    const handleBackClick = () => {
        navigate('/')
    };

    return(
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Administrativo</h2>
                <div className='geral-config'>
                    <h3>Associação</h3>
                    <button className='btn-account' onClick={() => navigate("/Associacao/cadastros/categorias")}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </div>
                        <span>Categorias</span>
                    </button>
                    <button className='btn-account' onClick={() => navigate("/Associacao/cadastros/locais")}>
                        <div className='icon-account-local'>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <span>Locais</span>
                    </button>          
                </div>
                <br />
            </div>
        </div>
    );
}

export default AdminConfig;