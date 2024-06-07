import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthService from '../services/authServices';
import '../styles/login.css';
import CustomInput from '../components/customInput';
import WheelShareLogo from '../photos/WheelShareLogo.png';

const RegisterAssoc = () =>{

    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [razaoSocial, setRazaoSocial] = useState("");
    const [nomeFantasia, setNomeFantasia] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/')
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if (senha !== confirmaSenha) {
            setMessage("As senhas não coincidem.");
            return;
        }

        setMessage("");
        setLoading(true);

        AuthService.registerAssoc(email, cnpj, razaoSocial, nomeFantasia, telefone, endereco, senha).then(
            () => {
                navigate("/Associacoes/login");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response && 
                        error.response.data &&
                        error.response.data.message) || 
                    error.message || 
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return(

        <div className='main-content'>
            <div className='sub-content2'>
                <form className="login-form" onSubmit={handleRegister}>
                    <br></br>
                    <h2 className='register-title'>Cadastro de Associação</h2>
                    <div className='btns-form'>
                        <div className='form-email'>
                            <CustomInput
                                label="Email Profissional"
                                type="emailprofissional"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='form-cnpj'>
                            <CustomInput
                                label="CNPJ"
                                type="cnpj"
                                onChange={(e) => setCnpj(e.target.value)}
                                mask="99.999.999/9999-99"
                            />
                        </div>
                        <div className='form-razaosocial'>
                            <CustomInput
                                label="Razão Social"
                                type="razaosocial"
                                onChange={(e) => setRazaoSocial(e.target.value)}
                            />
                        </div>
                        <div className='form-nomefantasia'>
                            <CustomInput
                                label="Nome Fantasia"
                                type="nomefantasia"
                                onChange={(e) => setNomeFantasia(e.target.value)}
                            />
                        </div>
                        <div className='form-telefone'>
                            <CustomInput
                                label="Telefone"
                                type="numero_telefone"
                                onChange={(e) => setTelefone(e.target.value)}
                                mask="(99) 99999-9999"
                            />
                        </div>
                        <div className='form-endereco'>
                            <CustomInput
                                label="Endereço"
                                type="endereco"
                                onChange={(e) => setEndereco(e.target.value)}
                            />
                        </div>
                        <div className='form-senha'>
                            <CustomInput
                                label="Senha"
                                type="senha"
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        <div className='form-senha'>
                            <CustomInput
                                label="Confirmar Senha"
                                type="password"
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <span className='span-member' onClick={handleBackClick}>É membro? Voltar</span>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" id="btnEntrar" disabled={loading}>
                        {loading && (
                            <span className="spinner-border spinner-border-sm" id='loading-icon'></span>
                        )}
                        <span>Cadastrar</span>
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

export default RegisterAssoc;