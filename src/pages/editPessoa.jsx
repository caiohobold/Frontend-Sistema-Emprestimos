import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomInput from '../components/customInput';
import axios from 'axios';
import '../styles/editPessoa.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../services/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPessoa = () => {
  const { id } = useParams();
  const [pessoa, setPessoa] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    telefone: '',
    descricao: '',
    endereco: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await api.get(`https://localhost:7000/api/Pessoas/${id}`);
        setPessoa(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os dados da pessoa:', error);
        setLoading(false);
      }
    };

    fetchPessoa();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPessoa(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`https://localhost:7000/api/Pessoas/${id}`, pessoa);
      setMessage('Dados atualizados com sucesso!');
      navigate('/Usuarios/pessoas');
    } catch (error) {
      console.error('Erro ao atualizar os dados da pessoa:', error);
      setMessage('Erro ao atualizar os dados.');
    }
  };

  const handleDelete = async () => {
    confirmAlert({
      title: 'Confirmação',
      message: 'Você tem certeza que deseja remover esta pessoa?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              await api.delete(`https://localhost:7000/api/Pessoas/${id}`);
              setMessage('Pessoa removida com sucesso!');
              navigate('/Usuarios/pessoas');
            } catch (error) {
              const resMessage =
                    (error.response && 
                        error.response.data &&
                        error.response.data.message) || 
                    error.message || 
                    error.toString();

                    if (error.response && error.response.status === 500) {
                      toast.error("Não é possível remover uma pessoa que possui empréstimos em andamento.");
                  } else {
                      toast.error(resMessage);
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (

    <div className='main-content' >
      <ToastContainer/>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/pessoas")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br></br>
                <div className='header-edit'>
                    <h2 className='pessoa-edit-title'>Edição de pessoa</h2>
                    <button className='btn-delete' onClick={handleDelete}><FontAwesomeIcon className='icon-delete' icon={faTrashCan} /></button>
                </div>
                {message && <p>{message}</p>}
                <form className='form-edit' onSubmit={handleSave}>
                    <div className='form-input'>
                        <CustomInput label="Nome Completo" name="nomeCompleto" type="text" value={pessoa.nomeCompleto} onChange={handleChange}/>
                    </div>
                    <div className='form-input'>
                        <CustomInput label="CPF" type="text" name="cpf" mask="999.999.999-99" value={pessoa.cpf} onChange={handleChange}/>
                    </div>
                    <div className='form-input'>
                        <CustomInput label="E-mail" type="text" name="email" value={pessoa.email} onChange={handleChange}/>
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Telefone" type="text" name="telefone" mask="(99) 99999-9999" value={pessoa.telefone} onChange={handleChange}/>
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Descrição" type="text" name="descricao" value={pessoa.descricao} onChange={handleChange}/>
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Endereço" type="text" name="endereço" value={pessoa.endereco} onChange={handleChange}/>
                    </div>
                    <button type="submit" className='save-btn'>Salvar</button>
                </form>
            </div>
        </div>
    /* 
    <div className='edit-pessoa'>
      <h2>Editar Pessoa</h2>
      
    </div> */
  );
}

export default EditPessoa;