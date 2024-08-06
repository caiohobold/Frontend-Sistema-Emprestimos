import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import { jwtDecode } from 'jwt-decode';
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

const ChangePasswordMembro = () => {
    const token = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);
    const idUser = decodedToken.id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [user, setUser] = useState({
        idUsuario: '',
        razaoSocial: '',
        nomeFantasia: '',
        emailProfissional: '',
        numero_Telefone: '',
        endereco: '',
    });

    const api2 = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

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

    const handleChangePassword = async (e) => {
        console.log("Clicou")
        e.preventDefault();
        setLoading(true);
        try {
            await api2.put(`/Usuarios/${user.idUsuario}/change-password`, { novaSenha: newPassword });
            toast.success('Senha atualizada com sucesso!');
            setLoading(false);
            setTimeout(() => {
                navigate('/Usuarios/perfil/edit/membro');
            }, 1800);
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            toast.error('Erro ao atualizar a senha.');
            setLoading(false);
        }
    };


    return(
        <div className='main-content'>
            <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil/edit/assoc")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Redefinir senha</h2>
                <form className='form-edit'>
                    <div className='form-input-categ'>
                        <CustomInput label="Nova Senha" type="password" name="novaSenha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <br />
                </form>
                <button className='save-pessoa' onClick={handleChangePassword}>Salvar</button>
            </div>
        </div>
    )
}


export default ChangePasswordMembro;