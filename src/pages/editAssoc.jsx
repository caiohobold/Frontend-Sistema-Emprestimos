import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import CustomInput from '../components/customInput';
import '../styles/userPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/material';
import Modal from 'react-modal';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const EditAssoc = () => {
    const token = localStorage.getItem('userToken');

    const api2 = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [user, setUser] = useState({
        idAssociacao: null,
        razaoSocial: '',
        nomeFantasia: '',
        emailProfissional: '',
        numero_Telefone: '',
        endereco: '',
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api2.get('/Associacoes/me');
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao carregar a associação:", error);
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

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(89, 89, 89, 0.75)',
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            emailProfissional: user.emailProfissional,
            nomeFantasia: user.nomeFantasia,
            numero_Telefone: user.numero_Telefone,
            endereco: user.endereco,
            razaoSocial: user.razaoSocial
        };

        try {
            await api2.put('/Associacoes/me', payload);
            setLoading(false);
            toast.success('Associação atualizada com sucesso!');
            setTimeout(() => {
                navigate('/Usuarios/perfil/info');
            }, 1800);
        } catch (error) {
            toast.error('Erro inesperado ao atualizar associação.');
            console.error("Erro ao atualizar o perfil:", error);
            setLoading(false);
        }
    };

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil/info")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <div className='edit-user-row-1'>
                    <h2 className='perfil-title'>Editar perfil</h2>
                    <button onClick={() => navigate("/Usuarios/perfil/edit/changepassword")} className='change-password-btn'>Alterar Senha</button>
                </div>
                <div className='perfil-container'>
                    <form onSubmit={handleSubmit} className='form-edit'>
                        <div className='form-input'>
                            <CustomInput label="Nome Fantasia" type="text" name="nomeFantasia" value={user.nomeFantasia} onChange={handleChange} />
                        </div>
                        <div className='form-input'>
                            <CustomInput label="E-mail" type="email" name="emailProfissional" value={user.emailProfissional} onChange={handleChange} />
                        </div>
                        <div className='form-input'>
                            <CustomInput label="Telefone" type="text" name="numero_Telefone" mask="(99) 99999-9999" value={user.numero_Telefone} onChange={handleChange} />
                        </div>
                        <div className='form-input'>
                            <CustomInput label="Endereço" type="text" name="endereco" value={user.endereco} onChange={handleChange} />
                        </div>
                        <div className='form-input'>
                            <CustomInput label="Razão Social" type="text" name="razaoSocial" value={user.razaoSocial} onChange={handleChange} />
                        </div>
                        <input type="hidden" name="senha" value={user.senhaHash} />
                        <button type="submit" className='save-btn'>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAssoc;
