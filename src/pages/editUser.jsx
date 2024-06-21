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


const EditUser = () =>{

    const token = localStorage.getItem('userToken');

    const api2 = axios.create({
        baseURL: "https://localhost:7000/api",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    console.log(token)

    const [user, setUser] = useState({
        nomeCompleto: '',
        emailPessoal: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api2.get('/Usuarios/me');
                setUser(response.data);
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
        try {
            await axios.put('/Usuarios/me', user);
            setLoading(false);
            navigate('/profile');
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error);
            setLoading(false);
        }
    };

    return(
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/perfil/info")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Edição de Usuário</h2>
                <div className='perfil-container'>
                <form onSubmit={handleSubmit} className='form-edit'>
                    <div className='form-input'>
                        <CustomInput label="Nome Completo" type="text" name="nomeCompleto" value={user.nomeCompleto} onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="E-mail" type="email" name="emailPessoal" value={user.emailPessoal} onChange={handleChange} />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Telefone" type="text" name="numeroTelefone" mask="(99) 99999-9999" value={user.numeroTelefone} onChange={handleChange} />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </form>
                </div>
            </div>
        </div>
    );
}

export default EditUser;