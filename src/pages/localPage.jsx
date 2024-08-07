import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import '../styles/login.css';
import { faArrowLeft, faPenToSquare, faLayerGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import locaisServices from '../services/locaisServices';
import Modal from 'react-modal';
import api from '../services/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const LocalPage = () => {

    const navigate = useNavigate();
    const [locais, setLocais] = useState([]);
    const [idAssoc, setIdAssoc] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLocal, setNewLocal] = useState({
        idLocal: null,
        nomeLocal: '',
        idAssociacao: null
    });

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdAssoc(decodedToken.idAssoc);
            setNewLocal(prevState => ({
              ...prevState,
              idAssociacao: decodedToken.idAssoc
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLocal(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (newLocal.idLocal) {
                // Atualizar local existente
                await api.put(API_URL + `Locais/${newLocal.idLocal}`, newLocal);
                toast.success('Local atualizado com sucesso!');
            } else {
                // Criar novo local

                const localParaSalvar = {
                    ...newLocal,
                    idAssociacao: idAssoc
                }
                await api.post(API_URL + 'Locais', localParaSalvar);
                toast.success('Local cadastrado com sucesso!');
            }
            setLoading(false);
            setTimeout(() => {
                loadLocais();
            }, 1500);
            setTimeout(() => {
                setIsModalOpen(false);
                setNewLocal({ idLocal: null, nomeLocal: '', idAssociacao: idAssoc });
            }, 1500);
        } catch (error) {
            console.error('Erro ao salvar o local:', error);
            toast.error('Erro ao salvar o local.');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(API_URL + `Locais/${newLocal.idLocal}`);
            toast.success('Local deletado com sucesso!');
            setLoading(false);
            setTimeout(() => {
                setIsModalOpen(false);
                loadLocais();
            }, 1800);
        } catch (error) {
            console.error('Erro ao deletar o local:', error);
            if (error.response && error.response.status === 500){
                toast.error('Não é possível remover locais que tenham equipamentos vinculados.');
            }
            else{
                toast.error('Não é possível remover locais que tenham equipamentos vinculados.');
            }
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        confirmAlert({
            title: 'Confirmar Remoção',
            message: 'Você tem certeza que deseja remover este local?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: handleDelete
                },
                {
                    label: 'Não'
                }
            ]
        });
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(89, 89, 89, 0.75)', // Cor de fundo do overlay
        },
    };

    const handleBackClick = () => {
        navigate('/')
    };

    const loadLocais = async () => {
        try {
            setLoading(true);
            const data = await locaisServices.getLocais(1, 500);
            console.log("Locais carregados: ", data);
            setLocais(data);
            setLoading(false);
        } catch (error) {
            console.error("Falha ao carregar os locais:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLocais();
    }, []);

    const openEditModal = (local) => {
        setNewLocal(local);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setNewLocal({ idLocal: null, nomeLocal: '', idAssociacao: idAssoc });
        setIsModalOpen(true);
    };

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Associacao/cadastros")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Locais de armazenamento</h2>
                <Modal
                    style={customStyles}
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Filtros"
                    className="modal-filter"
                    closeTimeoutMS={300}
                >
                    <br />
                    <div className='edit-register-local'>
                        <h2>{newLocal.idLocal ? 'Editar Local' : 'Cadastrar Local'}</h2>
                        {newLocal.idLocal && (
                            <button className='btn-delete' onClick={confirmDelete} disabled={loading}><FontAwesomeIcon icon={faTrash} className='icon-delete-2' /></button>
                        )}
                    </div>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" gap="10px">
                        <form className='form-edit' onSubmit={handleSave}>
                            <div className='form-input-categ'>
                                <CustomInput label="Nome do Local" type="text" name="nomeLocal" value={newLocal.nomeLocal} onChange={handleChange} />
                            </div>
                            <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                        </form>
                    </Box>
                </Modal>
                <div className='geral-config'>
                    <div className="categorias">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            locais.length === 0 ? (
                                <div className='no-emprestimos-pessoa'>
                                    <FontAwesomeIcon icon={faLayerGroup} className='icon-chair' />
                                    <div>Nenhum local encontrado.</div>
                                </div>
                            ) : (
                                locais.map(local =>
                                    <div key={local.idLocal} className='box-categ'>
                                        <div className='nome-categ'>{local.nomeLocal}</div>
                                        <button className='edit-categ-btn' onClick={() => openEditModal(local)}><FontAwesomeIcon className='btn-edit-categ' icon={faPenToSquare} /></button>
                                    </div>
                                )
                            )
                        )}
                    </div>
                    <br />
                    <div className={`plus-categoria-div ${isModalOpen ? 'hidden' : ''}`}>
                        <button className='plus-categoria' onClick={openCreateModal}>Cadastrar Local</button>
                    </div>
                </div>
                <br />
            </div>
        </div>
    );
}

export default LocalPage;
