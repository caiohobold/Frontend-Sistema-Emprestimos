import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import '../styles/login.css';
import { faArrowLeft, faPenToSquare, faLayerGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import categoriasServices from '../services/categoriasServices';
import Modal from 'react-modal';
import { jwtDecode } from 'jwt-decode';
import api from '../services/axiosConfig';
import { Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Importação da biblioteca de confirmação
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importação do CSS da biblioteca de confirmação
import URL from '../services/URL';

const API_URL = URL.API_URL;

const CategPage = () => {

    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [idAssoc, setIdAssoc] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [newCategoria, setNewCategoria] = useState({
        idCategoria: null,
        nomeCategoria: '',
        idAssociacao: null
    });

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdAssoc(decodedToken.idAssoc);
            setNewCategoria(prevState => ({
              ...prevState,
              idAssociacao: decodedToken.idAssoc
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCategoria(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (newCategoria.idCategoria) {
                // Atualizar categoria existente
                await api.put(API_URL + `Categorias/${newCategoria.idCategoria}`, newCategoria);
                toast.success('Categoria atualizada com sucesso!');
            } else {
                // Criar nova categoria
                const categoriaParaSalvar = {
                    ...newCategoria,
                    idAssociacao: idAssoc
                };
                await api.post(API_URL + 'Categorias', categoriaParaSalvar);
                toast.success('Categoria cadastrada com sucesso!');
            }
            setLoading(false);
            setTimeout(() => {
                loadCategorias();
            }, 1500);
            setTimeout(() => {
                setIsModalOpen(false);
                setIsModalEditOpen(false);
                setNewCategoria({ idCategoria: null, nomeCategoria: '', idAssociacao: idAssoc });
            }, 1500);
        } catch (error) {
            console.error('Erro ao salvar a categoria:', error);
            toast.error('Erro ao salvar a categoria.');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(API_URL + `Categorias/${newCategoria.idCategoria}`);
            toast.success('Categoria deletada com sucesso!');
            setLoading(false);
            setTimeout(() => {
                setIsModalEditOpen(false);
                loadCategorias();
            }, 1800);
        } catch (error) {
            if (error.response && error.response.status === 500){
                toast.error('Não é possível remover uma categoria vinculada a um equipamento cadastrado.');
            }
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        confirmAlert({
            title: 'Confirmar Remoção',
            message: 'Você tem certeza que deseja remover esta categoria?',
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

    const loadCategorias = async () => {
        try {
            setLoading(true);
            const data = await categoriasServices.getCategorias(1, 500);
            console.log("Categorias carregadas: ", data);
            setCategorias(data);
            setLoading(false);
        } catch (error) {
            console.error("Falha ao carregar as categorias:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategorias();
    }, []);

    const openEditModal = (categoria) => {
        setNewCategoria(categoria);
        setIsModalEditOpen(true);
    };

    const openCreateModal = () => {
        setNewCategoria({ idCategoria: null, nomeCategoria: '', idAssociacao: idAssoc });
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
                <h2 className='perfil-title'>Categorias</h2>
                <Modal
                    style={customStyles}
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Filtros"
                    className="modal-filter"
                    closeTimeoutMS={300}
                >
                    <br />
                    <h2>Cadastrar categoria</h2>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" gap="10px">
                        <form className='form-edit' onSubmit={handleSave}>
                            <div className='form-input-categ'>
                                <CustomInput label="Nome da Categoria" type="text" name="nomeCategoria" value={newCategoria.nomeCategoria} onChange={handleChange} />
                            </div>
                            <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                        </form>
                    </Box>
                </Modal>
                <Modal
                    style={customStyles}
                    isOpen={isModalEditOpen}
                    onRequestClose={() => setIsModalEditOpen(false)}
                    contentLabel="Filtros"
                    className="modal-filter"
                    closeTimeoutMS={300}
                >
                    <br />
                    <div className='edit-register-local'>
                        <h2>Editar categoria</h2>
                        {newCategoria.idCategoria && (
                            <button className='btn-delete' onClick={confirmDelete} disabled={loading}><FontAwesomeIcon icon={faTrash} className='icon-delete-2' /></button>
                        )}
                    </div>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" gap="10px">
                        <form className='form-edit' onSubmit={handleSave}>
                            <div className='form-input-categ'>
                                <CustomInput label="Nome da Categoria" type="text" name="nomeCategoria" value={newCategoria.nomeCategoria} onChange={handleChange} />
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
                            categorias.length === 0 ? (
                                <div className='no-emprestimos-pessoa'>
                                    <FontAwesomeIcon icon={faLayerGroup} className='icon-chair' />
                                    <div>Nenhuma categoria encontrada.</div>
                                </div>
                            ) : (
                                categorias.map(categ =>
                                    <div key={categ.idCategoria} className='box-categ'>
                                        <div className='nome-categ'>{categ.nomeCategoria}</div>
                                        <button className='edit-categ-btn' onClick={() => openEditModal(categ)}><FontAwesomeIcon className='btn-edit-categ' icon={faPenToSquare} /></button>
                                    </div>
                                )
                            )
                        )}
                    </div>
                    <br />
                    <div className={`plus-categoria-div ${isModalOpen || isModalEditOpen ? 'hidden' : ''}`}>
                        <button className='plus-categoria' onClick={openCreateModal}>Cadastrar Categoria</button>
                    </div>
                </div>
                <br />
            </div>
        </div>
    );
}

export default CategPage;
