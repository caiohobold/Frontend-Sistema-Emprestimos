import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/addPessoa.css';
import api from '../services/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormControl, InputLabel, MenuItem, Select, Button, TextField } from '@mui/material';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const AddUser = () => {
  const [user, setUser] = useState({
    cpf: '',
    nomeCompleto: '',
    numeroTelefone: '',
    senha: '',
    dataNascimento: '',
    endereco: '',
    emailPessoal: '',
    idAssociacao: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchAssociacao = async () => {
      try {
        const response = await api.get(API_URL + 'Associacoes/me');
        setUser(prevState => ({
          ...prevState,
          idAssociacao: response.data.idAssociacao
        }));
      } catch (error) {
        console.error('Erro ao buscar a associação:', error);
        toast.error("Erro ao buscar a associação.");
      }
    };

    fetchAssociacao();
  }, []);  

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(API_URL + 'Usuarios/register-user', user);
      setMessage('Usuário cadastrado com sucesso!');
      toast.success("Usuário cadastrado com sucesso!");
      setLoading(false);
      setTimeout(() => {
        navigate('/Associacao/cadastros');
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar o usuário:', error);
      setMessage('Erro ao cadastrar o usuário.');
      toast.error("Erro ao cadastrar o usuário.");
      setLoading(false);
    }
  };

  return (
    <div className='main-content'>
    <ToastContainer />
      <div className='return-div'>
        <button onClick={() => navigate("/Associacao/cadastros")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
      </div>
      <div className='container-div'>
        <br></br>
        <h2 className='pessoas-title'>Cadastro de Usuário</h2>
        {message && <p>{message}</p>}
        <form className='form-add-equip' onSubmit={handleSave}>
          <div className='form-input'>
            <CustomInput label="Nome Completo" type="text" name="nomeCompleto" value={user.nomeCompleto} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="CPF" type="text" mask="999.999.999-99" name="cpf" value={user.cpf} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="Telefone" type="text" mask="(99) 99999-9999" name="numeroTelefone" value={user.numeroTelefone} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="E-mail" type="email" name="emailPessoal" value={user.email} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="Endereço" type="text" name="endereco" value={user.endereco} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="Senha" type="senha" name="senha" value={user.senha} onChange={handleChange} />
          </div>
          <br />
          <div className='form-input'>
          <TextField
                    label="Data de Nascimento"
                    type="date"
                    name="dataNascimento"
                    value={user.dataNascimento}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    />
          </div>
          
          <button type="submit" className='save-equip' disabled={loading}>
            {loading && (
            <span className="spinner-border spinner-border-sm" id='loading-icon'></span>
            )}
            <span>Salvar</span>
          </button>
          <br />
          <br />
          <br />
          <br />
          <br />
        </form>
      </div>
    </div>
  );
}

export default AddUser;
