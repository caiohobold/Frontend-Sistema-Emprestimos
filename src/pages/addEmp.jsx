import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import axios from 'axios';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pessoasServices from '../services/pessoasService';
import equipamentosServices from '../services/equipamentosService';
import { jwtDecode } from 'jwt-decode';
import api from '../services/axiosConfig';
import { format } from 'date-fns';
import { Autocomplete } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEmprestimo = () => {
    const [pessoas, setPessoas] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [emprestimo, setEmprestimo] = useState({
        idPessoa: '',
        idEquipamento: '',
        dataEmprestimo: '',
        idUsuario: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

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

        fetchPessoas();
        fetchEquipamentos();
    }, []);

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
    }

      const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formattedDate = format(new Date(emprestimo.dataEmprestimo), 'yyyy-MM-dd');
        const emprestimoData = { ...emprestimo, dataEmprestimo: formattedDate, idUsuario: getCurrentUser().id};
    
        try {
          await api.post('https://localhost:7000/api/Emprestimos', emprestimoData);
          toast.success("Empréstimo cadastrado com sucesso!");
          setLoading(false);
          setTimeout(() => {
            navigate('/Usuarios/emprestimos');
          }, 1500);
        } catch (error) {
          console.error('Erro ao cadastrar o empréstimo:', error);
          setMessage('Erro ao cadastrar o empréstimo.');
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

    return(
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
                <div className='form-input'>
                    <TextField
                    label="Data do Empréstimo"
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
                <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                </form>
            </div>
        </div>
    )
}

export default AddEmprestimo;