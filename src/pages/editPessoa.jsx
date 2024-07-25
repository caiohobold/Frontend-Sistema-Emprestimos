import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomInput from '../components/customInput';
import axios from 'axios';
import '../styles/editPessoa.css'
import { jwtDecode } from 'jwt-decode';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../services/axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/loading';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const EditPessoa = () => {
  const [idAssoc, setIdAssoc] = useState('');
  const { id } = useParams();
  const [pessoa, setPessoa] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    telefone: '',
    descricao: '',
    endereco: '',
    idAssociacao: idAssoc
  });
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await api.get(API_URL + `Pessoas/${id}`);
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
    try {
      await api.put(API_URL + `Pessoas/${id}`, pessoa);
      setMessage('Dados atualizados com sucesso!');
      toast.success('Pessoa editada com sucesso!');
      setTimeout(() => {
        navigate('/Usuarios/pessoas');
      }, 1500);
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
              await api.delete(API_URL + `Pessoas/${id}`);
              toast.success('Pessoa removida com sucesso!');
              setTimeout(() => {
                navigate('/Usuarios/pessoas');
              }, 1500);
            } catch (error) {
              const resMessage =
                    (error.response && 
                        error.response.data &&
                        error.response.data.message) || 
                    error.message || 
                    error.toString();

                    if (error.response && error.response.status === 500) {
                      toast.error("Não é possível remover uma pessoa que possui empréstimos ativos ou finalizados.");
                  } else {
                      toast.error("Não é possível remover uma pessoa que possui empréstimos ativos ou finalizados.");
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
                {loading ? <Loading /> : (
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
                          <CustomInput label="Endereço" type="text" name="endereco" value={pessoa.endereco} onChange={handleChange}/>
                      </div>
                      <button type="submit" className='save-btn'>Salvar</button>
                  </form>
                )}
                
            </div>
        </div>
    /* 
    <div className='edit-pessoa'>
      <h2>Editar Pessoa</h2>
      
    </div> */
  );
}

export default EditPessoa;