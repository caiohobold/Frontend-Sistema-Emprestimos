import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, TextField } from '@mui/material';
import axios from 'axios';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pessoasServices from '../services/pessoasService';
import equipamentosServices from '../services/equipamentosService';
import { jwtDecode } from 'jwt-decode';
import api from '../services/axiosConfig';
import { toDate } from 'date-fns-tz';
import { Autocomplete } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usuariosServices from '../services/usuariosServices';

const AddEmprestimo = () => {
    const [pessoas, setPessoas] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [role, setRole] = useState('');
    const [emprestimo, setEmprestimo] = useState({
        idPessoa: '',
        idEquipamento: '',
        dataEmprestimo: '',
        dataDevolucao: '',
        idUsuario: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    useEffect(() => {
        const fetchPessoas = async () => {
            try {
                const data = await pessoasServices.getPessoas(1, 500);
                setPessoas(data);
            } catch (error) {
                console.error("Erro ao carregar pessoas:", error);
            }
        };

        const fetchEquipamentos = async () => {
            try {
                const data = await equipamentosServices.getEquipamentosDisponiveis(1, 500);
                setEquipamentos(data);
            } catch (error) {
                console.error("Erro ao carregar equipamentos:", error);
            }
        };

        const fetchUsuarios = async () => {
            try {
                const response = await usuariosServices.getUsuarios(1, 500);
                console.log('Response de usuários:', response);
                console.log(response[0].idUsuario)
                if (response) {
                    setUsuarios(response.data);
                    setEmprestimo(prevState => ({
                        ...prevState,
                        idUsuario: response[0].idUsuario // Use o ID do primeiro usuário da lista
                    }));
                } else {
                    console.error("Nenhum usuário encontrado ou resposta inválida.");
                }
            } catch (error) {
                console.error("Erro ao carregar usuários: ", error);
            }
        };

        fetchPessoas();
        fetchEquipamentos();
        if (role === 'Associacao') {
            fetchUsuarios();
        }
    }, [role]);

    useEffect(() => {
        // Verifique se o idUsuario está sendo definido corretamente
        console.log('Emprestimo:', emprestimo);
    }, [emprestimo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmprestimo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const getCurrentUser = () => {
        const token = localStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);
        return decodedToken;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const timeZone = 'America/Sao_Paulo';
        const dataEmprestimoUtc = toDate(new Date(emprestimo.dataEmprestimo), { timeZone });
        const dataDevolucaoUtc = toDate(new Date(emprestimo.dataDevolucao), { timeZone });

        const currentUser = getCurrentUser();
        const idUsuario = role === 'Associacao' ? emprestimo.idUsuario : currentUser.id;

        // Verificar se o idUsuario está definido corretamente
        if (!idUsuario) {
            toast.error("Usuário não definido. Verifique suas permissões.");
            setLoading(false);
            return;
        }

        const emprestimoData = {
            ...emprestimo,
            dataEmprestimo: dataEmprestimoUtc.toISOString(),
            dataDevolucao: dataDevolucaoUtc.toISOString(),
            idUsuario: idUsuario
        };

        console.log('Payload enviado:', emprestimoData);

        try {
            await api.post('https://localhost:7000/api/Emprestimos', emprestimoData);
            toast.success("Empréstimo cadastrado com sucesso!");
            setLoading(false);
            setTimeout(() => {
                navigate('/Usuarios/emprestimos');
            }, 1500);
        } catch (error) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            if (error.response && error.response.status === 500) {
                toast.error("A data de devolução não pode ser anterior à data de início do empréstimo.");
            } else {
                toast.error(resMessage);
            }

            setLoading(false);
        }
    };

    const handleAutoCompleteChangePessoa = (event, value, name) => {
        setEmprestimo(prevState => ({
            ...prevState,
            [name]: value ? value.idPessoa : ''
        }));
    };

    const handleAutoCompleteChangeEquipamento = (event, value, name) => {
        setEmprestimo(prevState => ({
            ...prevState,
            [name]: value ? value.idEquipamento : ''
        }));
    };

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/Inicio")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <h2 className='pessoas-title'>Cadastro de Empréstimo</h2>
                {message && <p>{message}</p>}
                <form className='form-edit' onSubmit={handleSave}>
                    <div className='form-input'>
                        <FormControl fullWidth>
                            <Autocomplete
                                options={pessoas}
                                getOptionLabel={(option) => option.nomeCompleto}
                                onChange={(event, value) => handleAutoCompleteChangePessoa(event, value, 'idPessoa')}
                                renderInput={(params) => <TextField {...params} label="Pessoa" />}
                            />
                        </FormControl>
                    </div>
                    <br />
                    <div className='form-input'>
                        <FormControl fullWidth>
                            <Autocomplete
                                options={equipamentos}
                                getOptionLabel={(option) => option.nomeEquipamento}
                                onChange={(event, value) => handleAutoCompleteChangeEquipamento(event, value, 'idEquipamento')}
                                renderInput={(params) => <TextField {...params} label="Equipamento" />}
                            />
                        </FormControl>
                    </div>
                    <br />
                    <div className='form-input'>
                        <TextField
                            label="Data de início"
                            type="date"
                            name="dataEmprestimo"
                            value={emprestimo.dataEmprestimo}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </div>
                    <br />
                    <div className='form-input'>
                        <TextField
                            label="Data de devolução estimada"
                            type="date"
                            name="dataDevolucao"
                            value={emprestimo.dataDevolucao}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                        />
                    </div>
                    <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                </form>
            </div>
        </div>
    );
}

export default AddEmprestimo;
