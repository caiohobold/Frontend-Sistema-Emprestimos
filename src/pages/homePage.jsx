import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/homepage.css'
import CustonBtn from '../components/customBtn';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import { faPersonCane } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/navBar';


const HomePage = () =>{

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
                    <NavBar />
            </div>
        </div>
    );
}

export default HomePage;