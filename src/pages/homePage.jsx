import React, { useState, useEffect } from 'react';
import api from '../services/axiosConfig';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/homepage.css'
import CustonBtn from '../components/customBtn';
import { faUsers, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import { faPersonCane } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/navBar';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const HomePage = () =>{

    const [atrasados, setAtrasados] = useState([]);
    const [agendados, setAgendados] = useState([]);
    const [role, setRole] = useState('');

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    useEffect(() => {
        const fetchAtrasados = async () => {
            try {
                const response = await api.get(API_URL + 'Emprestimos/atrasados');
                
                setAtrasados(response.data);
            } catch (error) {
                console.error("Erro ao buscar empréstimos atrasados:", error);
            }
        };

        fetchAtrasados();
    }, []);

    useEffect(() => {
        const fetchAgendados = async () => {
            try {
                const response = await api.get(API_URL + 'Emprestimos/agendados');
                
                setAgendados(response.data);
            } catch (error) {
                console.error("Erro ao buscar empréstimos agendados:", error);
            }
        };

        fetchAgendados();
    }, []);

    const token = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);
    const userName = decodedToken.user;
    const assocName = decodedToken.nomeFantasiaAssoc;
    const navigate = useNavigate();

    return(
        <div className='main-content'>
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='container-div'>
                    <br></br>
                    {role === "Associacao" && (
                        <h2 className='welcome-title'>{userName}</h2>
                    )}
                    {role === "Usuario" && (
                        <div>
                            <h2 className='welcome-title'>Olá, {userName}!</h2>
                            <h2 className='sub-welcome-title'>{assocName}</h2>
                        </div>
                    )}
                    <div className='btns-div'>
                         <CustonBtn label="Pessoas" icon={faUsers} iconColor='#71C7E8' textColor='#71C7E8' onClick={() => navigate("/Usuarios/pessoas")}/>
                         <CustonBtn label="Equipamentos" icon={faWheelchair} iconColor="#7B7B7B" textColor="#7B7B7B" onClick={() => navigate("/Usuarios/equipamentos")}/>
                    </div>
                    <div className='btns-div'>
                        <CustonBtn label="Realizar Empréstimo" icon={faPersonCane} iconColor="#319900" textColor="#319900" onClick={() => navigate("/Emprestimos/add")}/>
                    </div>
                    <div className='notifications-box'>
                        <h2 className='notification-title'>Notificações</h2>
                        <div className='notifications'>
                            {atrasados.length === 0 && agendados.length === 0 ? (
                                <div className='no-emprestimos-2'>
                                <FontAwesomeIcon icon={faWheelchair} className='icon-chair-2' />
                                <div>Nenhuma notificação encontrada.</div>
                                </div>
                            ) : (
                                <div className='atrasados'>
                                    {atrasados.map(emp => (
                                        <div key={emp.id} className='sub-box-atrasados'>
                                            <FontAwesomeIcon icon={faBell} className='icon-bell-atrasado'/>
                                            <div>
                                                <p className='message-atrasado'>O empréstimo de <span className='nome-atrasado'>{emp.nomePessoa}</span> venceu em {formatDate(emp.dataDevolucao.split('T')[0])}. </p>
                                                <p className='message-atrasado-2'>Telefone: <span className='nome-atrasado'>{emp.telefonePessoa}</span></p>
                                            </div>
                                            <div>
                                                <Link to={`/pessoa/${emp.idPessoa}`}>
                                                    <button className='profile-btn-atrasado'><FontAwesomeIcon icon={faUpRightFromSquare} className='icon-btn-atrasado'/></button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                    {agendados.map(emp => (
                                        <div key={emp.id} className='sub-box-agendados'>
                                            <FontAwesomeIcon icon={faBell} className='icon-bell-agendado'/>
                                            <div>
                                                <p className='message-agendado'>O empréstimo de <span className='nome-agendado'>{emp.nomePessoa}</span> está agendado para <span className='nome-agendado'>{formatDate(emp.dataEmprestimo.split('T')[0])}.</span> </p>
                                                <p className='message-agendado-2'>Telefone: <span className='nome-agendado'>{emp.telefonePessoa}</span></p>
                                            </div>
                                            <div>
                                                <Link to={`/pessoa/${emp.idPessoa}`}>
                                                    <button className='profile-btn-agendado'><FontAwesomeIcon icon={faUpRightFromSquare} className='icon-btn-atrasado'/></button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                    </div>
                    <NavBar />
                    
            </div>
        </div>
    );
}

export default HomePage;