import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/addPessoa.css';
import api from '../services/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPessoa = () => {
  const [idAssoc, setIdAssoc] = useState('');
  const [pessoa, setPessoa] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    telefone: '',
    descricao: '',
    endereco: '',
    idAssociacao: idAssoc
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
    if (token) {
        const decodedToken = jwtDecode(token);
        setIdAssoc(decodedToken.idAssoc);
        setPessoa(prevState => ({
          ...prevState,
          idAssociacao: decodedToken.idAssoc
        }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPessoa(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!pessoa.nomeCompleto) {
      toast.info("O campo 'Nome Completo' é obrigatório.")
      return;
    }

    if (!pessoa.cpf) {
      toast.info("O campo 'CPF' é obrigatório.")
      return;
    }

    if (!pessoa.email) {
      toast.info("O campo 'E-mail' é obrigatório.")
      return;
    }

    if (!pessoa.telefone) {
      toast.info("O campo 'Telefone' é obrigatório.")
      return;
    }

    if (!pessoa.descricao) {
      toast.info("O campo 'Descrição' é obrigatório.")
      return;
    }

    if (!pessoa.endereco) {
      toast.info("O campo 'Endereço' é obrigatório.")
      return;
    }
    setLoading(true);
    try {
      await api.post('https://localhost:7000/api/Pessoas', pessoa);
      toast.success('Pessoa cadastrada com sucesso!');
      setLoading(false);
      setTimeout(() => {
        navigate('/Usuarios/pessoas');
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar a pessoa:', error);
      toast.error('Erro ao cadastrar a pessoa.');
      setLoading(false);
    }
  };

  return (
    <div className='main-content'>
      <ToastContainer />
      <div className='return-div'>
        <button onClick={() => navigate("/Usuarios/pessoas")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
      </div>
      <div className='container-div'>
        <br></br>
        <h2 className='pessoas-title'>Cadastro de Pessoa</h2>
        {message && <p>{message}</p>}
        <form className='form-edit' onSubmit={handleSave}>
          <div className='form-input'>
            <CustomInput label="Nome Completo" type="text" name="nomeCompleto" value={pessoa.nomeCompleto} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="CPF" type="text" name="cpf" mask="999.999.999-99" value={pessoa.cpf} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="E-mail" type="email" name="email" value={pessoa.email} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="Telefone" type="text" name="telefone" mask="(99) 99999-9999" value={pessoa.telefone} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="Descrição" type="text" name="descricao" value={pessoa.descricao} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <CustomInput label="Endereço" type="text" name="endereco" value={pessoa.endereco} onChange={handleChange} />
          </div>
          <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
        </form>
      </div>
    </div>
  );
}

export default AddPessoa;