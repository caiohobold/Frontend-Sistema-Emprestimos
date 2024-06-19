import React, { useState, useEffect } from 'react';
import api from '../services/axiosConfig';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/homepage.css'
import CustonBtn from '../components/customBtn';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import { faPersonCane } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/navBar';


const HomePage = () =>{

    const [atrasados, setAtrasados] = useState([]);

    useEffect(() => {
        const fetchAtrasados = async () => {
            try {
                const response = await api.get('https://localhost:7000/api/Emprestimos/atrasados');
                setAtrasados(response.data);
            } catch (error) {
                console.error("Erro ao buscar empréstimos atrasados:", error);
            }
        };

        fetchAtrasados();
    }, []);

    const token = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);
    const userName = decodedToken.user;
    const assocName = decodedToken.nomefantasia;
    const navigate = useNavigate();

    return(
        <div className='main-content'>
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='container-div'>
                    <br></br>
                    <h2 className='welcome-title'>Olá, {userName}!</h2>
                    <h2 className='sub-welcome-title'>{assocName}</h2>
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
                            {atrasados.length === 0 ? (
                                <div className='no-emprestimos-2'>
                                <FontAwesomeIcon icon={faWheelchair} className='icon-chair-2' />
                                <div>Nenhum empréstimo encontrado.</div>
                                </div>
                            ) : (
                                <div className='atrasados'>
                                    {atrasados.map(emp => (
                                        <div key={emp.id} className='sub-box-atrasados'>
                                            <FontAwesomeIcon icon={faBell} className='icon-bell'/>
                                            <div>
                                                <p className='message-atrasado'>O empréstimo de <span className='nome-atrasado'>{emp.nomePessoa}</span> chegou ao prazo de validade hoje. </p>
                                                <p className='message-atrasado-2'>Telefone: <span className='nome-atrasado'>{emp.telefonePessoa}</span></p>
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