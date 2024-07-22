import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/userPage.css';
import { faArrowLeft, faPenToSquare, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../services/axiosConfig';
import { Box } from '@mui/material';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CustomInput from '../components/customInput';
import usuariosServices from '../services/usuariosServices';
import URL from '../services/URL';

const API_URL = URL.API_URL;

const ViewUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        idUsuario: null,
        cpf: '',
        endereco: '',
        nomeCompleto: '',
        numeroTelefone: '',
        emailPessoal: '',
        dataNascimento: ''
    });
    const [newPassword, setNewPassword] = useState('');

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const data = await usuariosServices.getUsuarios(1, 500);
            console.log("Usuários carregados: ", data);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error("Falha ao carregar os usuários:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser({
            idUsuario: user.idUsuario,
            cpf: user.cpf,
            endereco: user.endereco,
            nomeCompleto: user.nomeCompleto,
            numeroTelefone: user.numeroTelefone,
            emailPessoal: user.emailPessoal,
            dataNascimento: user.dataNascimento.split('T')[0]
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        confirmAlert({
            title: 'Confirmar Remoção',
            message: 'Você tem certeza que deseja remover este usuário?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        try {
                            setLoading(true);
                            await api.delete(API_URL + `Usuarios/${id}`);
                            toast.success('Usuário deletado com sucesso!');
                            loadUsuarios();
                            setLoading(false);
                        } catch (error) {
                            if (error.response && error.response.status === 500){
                                toast.error('Não é possível remover um usuário vinculado a um empréstimo ativo.');
                            }
                            else{
                                toast.error('Erro ao deletar o usuário.');
                            }
                            setLoading(false);
                        }
                    }
                },
                {
                    label: 'Não'
                }
            ]
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = {
                cpf: selectedUser.cpf,
                nomeCompleto: selectedUser.nomeCompleto,
                numeroTelefone: selectedUser.numeroTelefone,
                emailPessoal: selectedUser.emailPessoal,
                dataNascimento: selectedUser.dataNascimento,
                endereco: selectedUser.endereco
            };
            await api.put(API_URL + `Usuarios/${selectedUser.idUsuario}`, updatedUser);
            toast.success('Usuário atualizado com sucesso!');
            loadUsuarios();
            setIsEditModalOpen(false);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao atualizar o usuário:', error);
            toast.error('Erro ao atualizar o usuário.');
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(API_URL + `Usuarios/${selectedUser.idUsuario}/change-password`, { NovaSenha: newPassword });
            toast.success('Senha atualizada com sucesso!');
            setIsPasswordModalOpen(false);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            toast.error('Erro ao atualizar a senha.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(89, 89, 89, 0.75)',
        },
    };

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Associacao/cadastros")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='perfil-title'>Usuários</h2>
                <Modal
                    style={customStyles}
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    contentLabel="Editar Usuário"
                    className="modal-filter modal-scrollable"
                    closeTimeoutMS={300}
                >
                    <br />
                    <div className='edit-user-row-1'>
                        <h2>Editar Usuário</h2>
                        <button onClick={() => setIsPasswordModalOpen(true)} className='change-password-btn'>Alterar Senha</button>
                    </div>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="10px" marginTop="-20px">
                        <form className='form-edit' onSubmit={handleSave}>
                            <div className='form-input-categ'>
                                <CustomInput label="Nome Completo" type="text" name="nomeCompleto" value={selectedUser.nomeCompleto} onChange={handleChange} />
                                <CustomInput label="CPF" type="text" name="cpf" value={selectedUser.cpf} mask="999.999.999-99" onChange={handleChange} />
                                <CustomInput label="Telefone" type="text" name="numeroTelefone" mask="(99) 99999-9999" value={selectedUser.numeroTelefone} onChange={handleChange} />
                                <CustomInput label="E-mail" type="email" name="emailPessoal" value={selectedUser.emailPessoal} onChange={handleChange} />
                                <CustomInput label="Endereço" type="text" name="endereco" value={selectedUser.endereco} onChange={handleChange} />
                                <CustomInput label="Data de Nascimento" type="date" name="dataNascimento" value={selectedUser.dataNascimento} onChange={handleChange} />
                            </div>
                            <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                        </form>

                    </Box>
                </Modal>

                <Modal
                    style={customStyles}
                    isOpen={isPasswordModalOpen}
                    onRequestClose={() => setIsPasswordModalOpen(false)}
                    contentLabel="Alterar Senha"
                    className="modal-filter modal-scrollable"
                    closeTimeoutMS={300}
                >
                    <br />
                    <h2>Alterar Senha</h2>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="10px">
                        <form className='form-edit' onSubmit={handleChangePassword}>
                            <div className='form-input-categ'>
                                <CustomInput label="Nova Senha" type="password" name="newSenha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                        </form>
                    </Box>
                </Modal>

                <div className='geral-config'>
                    <div className="usuarios">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            users.length === 0 ? (
                                <div className='no-emprestimos-pessoa'>
                                    <FontAwesomeIcon icon={faUserGroup} className='icon-chair' />
                                    <div>Nenhum usuário encontrado.</div>
                                </div>
                            ) : (
                                users.map(user => 
                                    <div key={user.idUsuario} className='box-user'>
                                        <div className='nome-categ'>{user.nomeCompleto}</div>
                                        <div className='row-1-usuarios'>
                                            <button className='edit-user-btn' onClick={() => handleEditClick(user)}><FontAwesomeIcon className='btn-edit-categ' icon={faPenToSquare} /></button>
                                            <button className='delete-user-btn' onClick={() => handleDeleteClick(user.idUsuario)}><FontAwesomeIcon className='btn-edit-categ' icon={faTrash} /></button>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
                <br />
            </div>
        </div>
    );
};

export default ViewUsersPage;
