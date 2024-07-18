import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/axiosConfig';
import WheelShareLogo from '../photos/WheelShareWithoutName.png';
import '../styles/userPage.css';
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { TextField, Button, Box } from '@mui/material';

const PerfilPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [userName, setUserName] = useState('');
    const [idAssoc, setIdAssoc] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorReport, setIsErrorReport] = useState(false);
    const token = localStorage.getItem('userToken');
    const decodedToken = token ? jwtDecode(token) : null;

    useEffect(() => {
        if (decodedToken) {
            setRole(decodedToken.role);
            console.log(role)
        }
    }, [decodedToken]);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdAssoc(decodedToken.idAssoc);
        }
    }, []);

    useEffect(() => {
        if (role) {
            if (role === "Usuario") {
                api.get(`https://backend-wheelshare.up.railway.app/api/Usuarios/${decodedToken.id}`)
                    .then(response => {
                        setUserName(response.data.nomeCompleto);
                    })
                    .catch(error => {
                        console.error("Erro ao fazer fetch:", error);
                    });
            } else if (role === "Associacao") {
                api.get(`https://backend-wheelshare.up.railway.app/api/Associacoes/${decodedToken.id}`)
                    .then(response => {
                        setUserName(response.data.nomeFantasia);
                    })
                    .catch(error => {
                        console.error("Erro ao fazer fetch:", error);
                    });
            } else {
                console.error("Erro encontrado.")
            }
        }
    }, [role, decodedToken]);

    useEffect(() => {
        console.log("Nome de usuário definido:", userName); // Adiciona log de depuração
    }, [userName]);

    const openModal = (isError) => {
        setIsModalOpen(true);
        setIsErrorReport(isError);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        console.log("Clicou")
        e.preventDefault();
        const url = isErrorReport ? 'https://backend-wheelshare.up.railway.app/api/Feedback/report-error' : 'https://backend-wheelshare.up.railway.app/api/Feedback/send-feedback';
        try {
            await api.post(url, { UserName: userName, Message: message, idAssociacao: idAssoc});
            toast.success("Mensagem enviada com sucesso!")
            closeModal();
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
            toast.error("Erro ao enviar mensagem.")
        }
    };


    const handleLogout = () => {
        confirmAlert({
            title: 'Confirmação de Logout',
            message: 'Tem certeza que deseja sair da conta?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        localStorage.removeItem('userToken'); 
                        navigate('/');
                    }
                },
                {
                    label: 'Não',
                    onClick: () => {}
                }
            ]
        });
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(89, 89, 89, 0.75)',
        },
    };

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo' alt='WheelShare Logo' />
            </div>
            <div className='container-div'>
                <Modal
                    style={customStyles}
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Editar Usuário"
                    className="modal-filter modal-scrollable"
                    closeTimeoutMS={300}
                >
                    <br />
                    <h2>{isErrorReport ? 'Reporte um Erro' : 'Mande um Feedback'}</h2>
                    <p className='p-info-modal'>{isErrorReport ?  'Enfrentou algum erro inesperado? Descreva o erro com detalhes para nosso time de desenvolvimento.' : 'Deseja deixar uma sugestão ou feedback sobre o sistema? Encaminhe diretamente para nosso time de desenvolvimento!'}</p>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, ml: 3, mr: 3 }}>
                        <TextField
                            id="message"
                            label={isErrorReport ? 'Descreva o erro encontrado' : 'Deixe seu feedback'}
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Enviar
                        </Button>
                        <Button onClick={closeModal} fullWidth variant="outlined">
                            Fechar
                        </Button>
                    </Box>
                </Modal>
                <br />
                <h2 className='perfil-title'>Configurações</h2>
                <div className='geral-config'>
                    <h3>Geral</h3>
                    <button className='btn-account' onClick={() => navigate("/Usuarios/perfil/info")}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <span>Conta</span>
                    </button>
                    <button className='btn-account' onClick={handleLogout}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </div>
                        <span>Sair da conta</span>
                    </button>
                </div>
                {role === 'Associacao' && (
                    <div className='admin-config'>
                        <h3>Administrativo</h3>
                        <button className='btn-account' onClick={() => navigate("/Associacao/cadastros")}>
                            <div className='icon-account'>
                                <FontAwesomeIcon icon={faUserGroup} />
                            </div>
                            <span>Associação</span>
                        </button>
                        <button className='btn-account' onClick={() => navigate("/Associacao/relatorios")}>
                            <div className='icon-account'>
                                <FontAwesomeIcon icon={faChartPie} />
                            </div>
                            <span>Relatórios</span>
                        </button>
                    </div>
                )}
                <div className='feedback-config'>
                    <h3>Feedback</h3>
                    <button className='btn-account' onClick={() => openModal(true)}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                        <span>Reporte um erro</span>
                    </button>
                    <button className='btn-account' onClick={() => openModal(false)}>
                        <div className='icon-account'>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                        <span>Mande um feedback</span>
                    </button>
                </div>
                <NavBar />
            </div>
        </div>
    );
};

export default PerfilPage;
