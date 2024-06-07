import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthService from '../services/authServices';
import '../styles/login.css';
import CustomInput from '../components/customInput';
import WheelShareLogo from '../photos/WheelShareLogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginAssoc = () =>{

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/')
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        AuthService.loginAssoc(email, senha).then(
            () => {
                navigate("/Associacoes/Inicio")
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response && 
                        error.response.data &&
                        error.response.data.message) || 
                    error.message || 
                    error.toString();

                if (error.response && error.response.status === 401) {
                    toast.error("E-mail ou senha inválidos");
                } else {
                    toast.error(resMessage);
                }

                setLoading(false);  
            }
        );
    };

    return(

        <div className='main-content'>
            <div className='sub-content'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='sub-content1'>
                <form className="login-form" onSubmit={handleLogin}>
                    <br></br>
                    <h2 className='login-title'>Login de Associação</h2>
                    <div className='btns-form'>
                        <div className='form-email'>
                            <CustomInput
                                label="Email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='form-senha'>
                            <CustomInput
                                label="Senha"
                                type="password"
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <span className='span-member' onClick={handleBackClick}>Não possui cadastro? Voltar</span>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" id="btnEntrar" disabled={loading}>
                        {loading && (
                            <span className="spinner-border spinner-border-sm" id='loading-icon'></span>
                        )}
                        <span>Entrar</span>
                        </button>
                    </div>


                    {message && (
                        <div role="alert" className='alert'>
                            {message}
                        </div>
                    )}

                </form>
            </div>
        </div>

    );
}

export default LoginAssoc;