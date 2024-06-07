import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomInput from '../components/customInput';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../services/axiosConfig';
import '../styles/addPessoa.css';
import categoriasServices from '../services/categoriasServices';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditEquip = () => {
    const [categorias, setCategorias] = useState([]);
    const { id } = useParams();
    const [equipamento, setEquipamento] = useState({
      nomeEquipamento: '',
      idCategoria: '',
      estadoEquipamento: '',
      cargaEquipamento: '',
      descricaoEquipamento: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEquip = async () => {
        try {
            const response = await api.get(`https://localhost:7000/api/Equipamentos/${id}`);
            setEquipamento(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar os dados do equipamento:', error);
            setLoading(false);
        }
        };

        fetchEquip();
    }, [id]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await categoriasServices.getCategorias(1, 500);
                setCategorias(data);
            } catch (error) {
                console.error("Erro ao carregas categorias:", error);
            }
        };
    
        fetchCategorias();
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipamento(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const handleSave = async (e) => {
    e.preventDefault();
    try {
        await api.put(`https://localhost:7000/api/Equipamentos/${id}`, equipamento);
        setMessage('Dados atualizados com sucesso!');
        navigate('/Usuarios/equipamentos');
    } catch (error) {
        console.error('Erro ao atualizar os dados do equipamento:', error);
        setMessage('Erro ao atualizar os dados.');
    }
    };

    const handleDelete = async () => {
        confirmAlert({
          title: 'Confirmação',
          message: 'Você tem certeza que deseja remover este equipamento?',
          buttons: [
            {
              label: 'Sim',
              onClick: async () => {
                try {
                  await api.delete(`https://localhost:7000/api/Equipamentos/${id}`);
                  setMessage('Equipamento removido com sucesso!');
                  navigate('/Usuarios/equipamentos');
                } catch (error) {
                const resMessage =
                  (error.response && 
                    error.response.data &&
                    error.response.data.message) || 
                error.message || 
                error.toString();

                if (error.response && error.response.status === 500) {
                  toast.error("Não é possível remover um equipamento vinculado a um empréstimo.");
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

      return(
        <div className='main-content' >
          <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/equipamentos")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br></br>
                <div className='header-edit'>
                    <h2 className='pessoa-edit-title'>Edição de equipamento</h2>
                    <button className='btn-delete' onClick={handleDelete}><FontAwesomeIcon className='icon-delete' icon={faTrashCan} /></button>
                </div>
                {message && <p>{message}</p>}
                <form className='form-edit' onSubmit={handleSave}>
                    <div className='form-input'>
                        <CustomInput label="Nome do Equipamento" type="text" name="nomeEquipamento" value={equipamento.nomeEquipamento} onChange={handleChange} />
                    </div>
                    <div className='form-input-estado'>
                        <FormControl fullWidth>
                            <InputLabel>Estado do Equipamento</InputLabel>
                            <Select
                                name="estadoEquipamento"
                                value={equipamento.estadoEquipamento}
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Novo</MenuItem>
                                <MenuItem value={1}>Usado</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className='form-input-estado'>
                        <FormControl fullWidth>
                                <InputLabel>Carga do Equipamento</InputLabel>
                                <Select
                                    name="cargaEquipamento"
                                    value={equipamento.cargaEquipamento}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Normal</MenuItem>
                                    <MenuItem value={1}>Obeso</MenuItem>
                                    <MenuItem value={2}>Semi-obeso</MenuItem>
                                </Select>
                        </FormControl>
                    </div>
                <div className='form-input'>
                    <CustomInput label="Descrição" type="text" name="descricaoEquipamento" value={equipamento.descricaoEquipamento} onChange={handleChange} />
                </div>
                <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                </form>
            </div>
        </div>

      )

}

export default EditEquip;