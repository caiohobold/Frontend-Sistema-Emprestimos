import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/userPage.css'
import NavBar from '../components/navBar';


const PerfilPage = () =>{

    return(
        <div className='main-content'>
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Configurações</h2>
                <NavBar />
            </div>
        </div>
    );
}

export default PerfilPage;