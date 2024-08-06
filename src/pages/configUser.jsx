import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/userPage.css'
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faArrowLeft, faCircleUser, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const ConfigUserPage = () =>{

    const token = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);
    const userName = decodedToken.user;
    const userEmail = decodedToken.email;
    const [role, setRole] = useState('');

    const api2 = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    useEffect(() => {
        const token = localStorage.getItem('userToken'); 
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    const [user, setUser] = useState({
        nomeCompleto: '',
        emailPessoal: '',
        numeroTelefone: '',
        cpf: '',
        endereco: '',
        dataNascimento: ''
    });

    const [assoc, setAssoc] = useState({
        emailProfissional: '',
        nomeFantasia: '',
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api2.get('/Usuarios/me');
                const data = response.data;
                const formattedDataNascimento = data.dataNascimento.split('T')[0];
                setUser({
                    ...data,
                    dataNascimento: formattedDataNascimento
                  });
                console.log(user)
            } catch (error) {
                console.error("Erro ao carregar o usuário:", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchAssoc = async () => {
            try {
                const response = await api2.get('/Associacoes/me');
                setAssoc(response.data);
            } catch (error) {
                console.error("Erro ao carregar a associação:", error);
            }
        };

        fetchAssoc();
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
                        {role === 'Usuario' && (
                            <>
                            <div className='nome-usuario'>{user.nomeCompleto}</div>
                            <div className='email-usuario'>{user.emailPessoal}</div>
                            </>
                        )}
                        {role === 'Associacao' && (
                            <>
                            <div className='nome-usuario'>{assoc.nomeFantasia}</div>
                            <div className='email-usuario'>{assoc.emailProfissional}</div>
                            </>
                        )}
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