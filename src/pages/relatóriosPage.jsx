import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png';
import '../styles/userPage.css';
import CustonBtn from '../components/customBtn';
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faChartPie, faArrowLeft, faWheelchair, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const RelatoriosPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token)
            setRole(decodedToken.role);
        }
    }, []);


    return (
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Relatórios</h2>
                <div className='btns-div'>
                    <CustonBtn label="Empréstimos realizados" icon={faWheelchair} iconColor="#7B7B7B" textColor="#7B7B7B" onClick={() => navigate("/Associacao/relatorios/emprestimos")}/>
                    <CustonBtn label="Próximas devoluções" icon={faArrowRightArrowLeft} iconColor="#71C7E8" textColor="#71C7E8" onClick={() => navigate("/Associacao/relatorios/devolucoes")}/>
                </div>
            </div>
        </div>
    );
};

export default RelatoriosPage;
