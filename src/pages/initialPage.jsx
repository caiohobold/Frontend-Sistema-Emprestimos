import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import WheelShareLogo from '../photos/WheelShareLogo.png';
import '../styles/login.css';


const InitialPage = () =>{

    const navigate = useNavigate();

    const handleMemberClick = () => {
        navigate('/Usuarios/login'); 
    };

    const handleAssocClick = () => {
        navigate('/Associacoes')
    };

    return(
        <div className='main-content'>
            <div className='sub-content'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='sub-content1'>
                <form className="login-form">
                    <br></br>
                    <h2 className='login-title'>Login</h2>
                    <div className='btns-form'>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" id="btnEntrar" onClick={handleMemberClick}>
                            <span>Sou membro</span>
                            </button>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" id="btnAssoc" onClick={handleAssocClick}>
                            <span>Associação</span>
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default InitialPage;