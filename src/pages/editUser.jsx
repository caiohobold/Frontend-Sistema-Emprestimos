import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import CustomInput from '../components/customInput';
import '../styles/userPage.css'
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faArrowLeft, faCircleUser, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const EditUser = () =>{

    const token = localStorage.getItem('userToken');

    const api2 = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    console.log(token)

    const [user, setUser] = useState({
        nomeCompleto: '',
        emailPessoal: '',
        numeroTelefone: '',
        cpf: '',
        endereco: '',
        dataNascimento: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            cpf: user.cpf,
            nomeCompleto: user.nomeCompleto,
            numeroTelefone: user.numeroTelefone,
            emailPessoal: user.emailPessoal,
            dataNascimento: user.dataNascimento,
            endereco: user.endereco
        };
        try {
            await api2.put('/Usuarios/me', payload);
            setLoading(false);
            toast.success('Usuário editado com sucesso!');
            setTimeout(() => {
                navigate('/Usuarios/perfil/info');
            }, 1500);
        } catch (error) {
            toast.error("Erro inesperado ao editar usuário.");
            console.error("Erro ao atualizar o perfil:", error);
            setLoading(false);
        }
    };

    return(
        <div className='main-content'>
            <ToastContainer/>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil/info")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <div className='edit-user-row-1'>
                    <h2 className='perfil-title'>Editar perfil</h2>
                    <button onClick={() => navigate("/Usuarios/perfil/edit/changepassword-user")} className='change-password-btn'>Alterar Senha</button>
                </div>
                <div className='perfil-container'>
                <form onSubmit={handleSubmit} className='form-edit'>
                    <div className='form-input'>
                        <CustomInput label="Nome Completo" type="text" name="nomeCompleto" value={user.nomeCompleto} onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="CPF" type="text" name="cpf" value={user.cpf} mask="999.999.999-99" onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="E-mail" type="email" name="emailPessoal" value={user.emailPessoal} onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Data de nascimento" type="date" name="dataNascimento" value={user.dataNascimento} onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Endereço" type="text" name="endereco" value={user.endereco} onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Telefone" type="text" name="numeroTelefone" mask="(99) 99999-9999" value={user.numeroTelefone} onChange={handleChange} />
                    </div>
                    <button type="submit" className='save-btn'>Salvar</button>
                </form>
                </div>
            </div>
        </div>
    );
}

export default EditUser;