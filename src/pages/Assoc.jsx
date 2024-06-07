import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import WheelShareLogo from '../photos/WheelShareLogo.png';
import '../styles/login.css';


const AssocPage = () =>{

    const navigate = useNavigate();

    const handleAccessClick = () => {
        navigate('/Associacoes/login'); 
    };

    const handleRegisterClick = () => {
        navigate('/Associacoes/register')
    };

    const handleBackClick = () => {
        navigate('/')
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
                            <button className="btn btn-primary btn-block" id="btnEntrar" onClick={handleAccessClick}>
                            <span>Acessar associação</span>
                            </button>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" id="btnEntrar" onClick={handleRegisterClick}>
                            <span>Cadastrar associação</span>
                            </button>
                        </div>
                        <span className='span-member' onClick={handleBackClick}>É membro? Voltar</span>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AssocPage;