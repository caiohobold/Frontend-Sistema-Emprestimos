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
import Loading from '../components/loading';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const EditEmp = () => {
  const { id } = useParams();
  const [emprestimo, setEmprestimo] = useState({
    dataEmprestimo: '',
    dataDevolucao: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await api.get(API_URL + `Emprestimos/${id}`);
        const data = response.data
        const formattedDataEmprestimo = data.dataEmprestimo.split('T')[0];
        const formattedDataDevolucao = data.dataDevolucao.split('T')[0];

        setEmprestimo({
            ...data,
            dataEmprestimo: formattedDataEmprestimo,
            dataDevolucao: formattedDataDevolucao
          });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os dados do empréstimo:', error);
        setLoading(false);
      }
    };

    fetchEmp();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmprestimo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!emprestimo.dataEmprestimo) {
      toast.info("É preciso informar quando o equipamento será/foi emprestado.")
      setLoading(false)
      return;
    }

    if (!emprestimo.dataDevolucao) {
      toast.info("É preciso informar quando o equipamento será/foi devolvido.")
      setLoading(false)
      return;
    }
    try {
      await api.put(`${API_URL}Emprestimos/${id}`, emprestimo);
      toast.success('Empréstimo editado com sucesso!');
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
          toast.error("A data de devolução não pode ser anterior à data de início do empréstimo.");
      }
    }
  };

  return (

    <div className='main-content' >
      <ToastContainer/>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/emprestimos")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br></br>
                <div className='header-edit'>
                    <h2 className='pessoa-edit-title'>Edição de empréstimo</h2>
                </div>
                {message && <p>{message}</p>}
                {loading ? <Loading /> : (
                <form className='form-edit' onSubmit={handleSave}>
                    <div className='form-input'>
                        <CustomInput label="Nome Completo" name="nomePessoa" type="text" value={emprestimo.nomePessoa} readonly />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Equipamento" type="text" name="nomeEquipamento" value={emprestimo.nomeEquipamento} readonly />
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Data de início" type='date' name="dataEmprestimo" value={emprestimo.dataEmprestimo} onChange={handleChange}/>
                    </div>
                    <div className='form-input'>
                        <CustomInput label="Data de devolução" type='date'  name="dataDevolucao" value={emprestimo.dataDevolucao} onChange={handleChange}/>
                    </div>
                    <button type="submit" className='save-pessoa' disabled={loading}>
                        {loading && (
                        <span className="spinner-border spinner-border-sm" id='loading-icon'></span>
                        )}
                        <span>Salvar</span>
                    </button>
                </form>
                )}
            </div>
        </div>
  );
}

export default EditEmp;