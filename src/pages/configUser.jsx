import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/userPage.css'
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faArrowLeft, faCircleUser, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ConfigUserPage = () =>{

    const token = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);
    const userName = decodedToken.user;
    const userEmail = decodedToken.email;
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    const navigate = useNavigate();

    return(
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Conta</h2>
                <div className='perfil-container'>
                    <div className='row-1-usuario'>
                        <div className='foto-usuario'>
                            <FontAwesomeIcon  className='icon-usuario' icon={faCircleUser} />
                        </div>
                        <div>
                            <div className='nome-usuario'>{userName}</div>
                            <div className='email-usuario'>{userEmail}</div>
                            {role === 'Usuario' && (
                            <button className='btn-edit-usuario' onClick={() => navigate("/Usuarios/perfil/edit/membro")}><span>Editar perfil</span><FontAwesomeIcon className='icon-edit-usuario' icon={faPenToSquare} /></button>
                            )}
                            {role === 'Associacao' && (
                            <button className='btn-edit-usuario' onClick={() => navigate("/Usuarios/perfil/edit/assoc")}><span>Editar perfil</span><FontAwesomeIcon className='icon-edit-usuario' icon={faPenToSquare} /></button>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default ConfigUserPage;