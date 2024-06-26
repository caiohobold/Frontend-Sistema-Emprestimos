import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png';
import '../styles/userPage.css';
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const PerfilPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token)
            setRole(decodedToken.role);
        }
    }, []);

    const handleLogout = () => {
        confirmAlert({
            title: 'Confirmação de Logout',
            message: 'Tem certeza que deseja sair da conta?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        localStorage.removeItem('userToken'); // Remover o token de autenticação
                        navigate('/'); // Redirecionar para a página de login
                    }
                },
                {
                    label: 'Não',
                    onClick: () => {}
                }
            ]
        });
    };

    return (
        <div className='main-content'>
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo' alt='WheelShare Logo' />
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Configurações</h2>
                <div className='geral-config'>
                    <h3>Geral</h3>
                    <button className='btn-account' onClick={() => navigate("/Usuarios/perfil/info")}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <span>Conta</span>
                    </button>
                    <button className='btn-account' onClick={handleLogout}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </div>
                        <span>Sair da conta</span>
                    </button>
                </div>
                {role === 'Associacao' && (
                    <div className='admin-config'>
                        <h3>Administrativo</h3>
                        <button className='btn-account' onClick={() => navigate("/Associacao/cadastros")}>
                            <div className='icon-account'>
                                <FontAwesomeIcon icon={faUserGroup} />
                            </div>
                            <span>Associação</span>
                        </button>
                        <button className='btn-account' onClick={() => navigate("/Associacao/relatorios")}>
                            <div className='icon-account'>
                                <FontAwesomeIcon icon={faChartPie} />
                            </div>
                            <span>Relatórios</span>
                        </button>
                    </div>
                )}
                <div className='feedback-config'>
                    <h3>Feedback</h3>
                    <button className='btn-account'>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                        <span>Reporte um erro</span>
                    </button>
                    <button className='btn-account'>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                        <span>Mande um feedback</span>
                    </button>
                </div>
                <NavBar />
            </div>
        </div>
    );
};

export default PerfilPage;
