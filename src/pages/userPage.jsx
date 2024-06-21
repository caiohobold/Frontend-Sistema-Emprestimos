import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/userPage.css'
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const PerfilPage = () =>{

    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    return(
        <div className='main-content'>
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Configurações</h2>
                <div className='geral-config'>
                    <h3>Geral</h3>
                    <button className='btn-account' onClick={() => navigate("/Usuarios/perfil/info")}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faUser}/>
                        </div>
                        <span>Conta</span>
                    </button>
                    <button className='btn-account'>
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
}

export default PerfilPage;