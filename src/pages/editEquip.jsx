import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomInput from '../components/customInput';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../services/axiosConfig';
import '../styles/addPessoa.css';
import categoriasServices from '../services/categoriasServices';
import { FormControl, InputLabel, MenuItem, Select, Button, TextField, Autocomplete } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import locaisServices from '../services/locaisServices';
import Loading from '../components/loading';

const EditEquip = () => {
    const [categorias, setCategorias] = useState([]);
    const [local, setLocal] = useState([]);
    const [selectedLocal, setSelectedLocal] = useState(null);
    const { id } = useParams();
    const [equipamento, setEquipamento] = useState({
        nomeEquipamento: '',
        idCategoria: '',
        estadoEquipamento: '',
        cargaEquipamento: '',
        descricaoEquipamento: '',
        idLocal: '',
        foto1: null,
        foto2: null
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);
    const [originalFoto1, setOriginalFoto1] = useState(null);
    const [originalFoto2, setOriginalFoto2] = useState(null);

    const navigate = useNavigate();

    const handleDrop1 = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setEquipamento(prevState => ({
            ...prevState,
            foto1: file
        }));
        setPreview1(URL.createObjectURL(file));
    };

    const handleDrop2 = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setEquipamento(prevState => ({
            ...prevState,
            foto2: file
        }));
        setPreview2(URL.createObjectURL(file));
    };

    const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({ onDrop: handleDrop1, accept: 'image/*' });
    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({ onDrop: handleDrop2, accept: 'image/*' });

    const handleAutoCompleteChangeLocal = (event, value, name) => {
        setEquipamento(prevState => ({
            ...prevState,
            [name]: value ? value.idLocal : ''
        }));
    };

    useEffect(() => {
        const fetchEquip = async () => {
            try {
                const response = await api.get(`https://localhost:7000/api/Equipamentos/${id}`);
                const data = response.data;
                setEquipamento(data);

                if (data.idLocal) {
                    const localResponse = await locaisServices.getLocalById(data.idLocal);
                    setSelectedLocal(localResponse);
                }

                if (data.foto1) {
                    const base64Foto1 = `data:image/jpeg;base64,${data.foto1}`;
                    setPreview1(base64Foto1);
                    setOriginalFoto1(base64Foto1);
                }
                if (data.foto2) {
                    const base64Foto2 = `data:image/jpeg;base64,${data.foto2}`;
                    setPreview2(base64Foto2);
                    setOriginalFoto2(base64Foto2);
                }

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

    useEffect(() => {
        const fetchLocais = async () => {
            try {
                const data = await locaisServices.getLocais(1, 500);
                setLocal(data);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
            }
        };

        fetchLocais();
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

        if (!equipamento.nomeEquipamento) {
            toast.info("O campo 'Nome do Equipamento' é obrigatório.")
            return;
          }
      
          if (!equipamento.descricaoEquipamento) {
            toast.info("O campo 'Descrição' é obrigatório.")
            return;
        }
      
          if (!equipamento.idCategoria) {
            toast.info("O campo 'Categoria' é obrigatório.")
            return;
        }
      
          if (!equipamento.idLocal) {
            toast.info("O campo 'Local de armazenamento' é obrigatório.")
            return;
        }
      
          if (!equipamento.estadoEquipamento && equipamento.estadoEquipamento !== 0) {
            toast.info("O campo 'Estado do Equipamento' é obrigatório.")
            return;
        }
      
          if (!equipamento.cargaEquipamento && equipamento.cargaEquipamento !== 0) {
            toast.info("O campo 'Carga do Equipamento' é obrigatório.")
            return;
        }
      
        if (!equipamento.foto1 || !equipamento.foto2) {
          toast.info("É necessário adicionar duas fotos do equipamento.")
          return;
      }

        const formData = new FormData();
        for (const key in equipamento) {
            if (equipamento[key] !== null && equipamento[key] !== undefined && key !== 'foto1' && key !== 'foto2') {
                formData.append(key, equipamento[key]);
            }
        }

        // Verificar e adicionar as fotos originais se não foram alteradas
        if (equipamento.foto1 && preview1 !== originalFoto1) {
            formData.append("foto1", equipamento.foto1);
        } else if (originalFoto1) {
            const blob1 = await fetch(originalFoto1).then(r => r.blob());
            formData.append("foto1", blob1, "originalFoto1.jpg");
        }

        if (equipamento.foto2 && preview2 !== originalFoto2) {
            formData.append("foto2", equipamento.foto2);
        } else if (originalFoto2) {
            const blob2 = await fetch(originalFoto2).then(r => r.blob());
            formData.append("foto2", blob2, "originalFoto2.jpg");
        }

        console.log("Dados do formulário:", equipamento);
        console.log("FormData:", ...formData.entries());

        try {
            await api.put(`https://localhost:7000/api/Equipamentos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Equipamento atualizado com sucesso!")
            setTimeout(() => {
                navigate('/Usuarios/Equipamentos');
            }, 1500);
        } catch (error) {
            console.error('Erro ao atualizar o equipamento:', error);
            toast.error("Erro ao atualizar o equipamento.");
            setLoading(false);
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
                            toast.success("Equipamento removido com sucesso!")
                            setTimeout(() => {
                                navigate('/Usuarios/equipamentos');
                            }, 1500);
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

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/equipamentos")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br />
                <div className='header-edit'>
                    <h2 className='pessoa-edit-title'>Edição de equipamento</h2>
                    <button className='btn-delete' onClick={handleDelete}><FontAwesomeIcon className='icon-delete' icon={faTrashCan} /></button>
                </div>
                {message && <p>{message}</p>}
                {loading ? <Loading /> : (
                    <form className='form-edit-equip' onSubmit={handleSave}>
                        <div className='form-input'>
                            <CustomInput label="Nome do Equipamento" type="text" name="nomeEquipamento" value={equipamento.nomeEquipamento} onChange={handleChange} />
                        </div>
                        <div className='form-input-estado'>
                            <FormControl fullWidth>
                                <InputLabel>Estado do Equipamento</InputLabel>
                                <Select name="estadoEquipamento" value={equipamento.estadoEquipamento} onChange={handleChange}>
                                    <MenuItem value={0}>Novo</MenuItem>
                                    <MenuItem value={1}>Usado</MenuItem>
                                    <MenuItem value={2}>Defeituoso</MenuItem>
                                    <MenuItem value={3}>Baixado</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='form-input-estado'>
                            <FormControl fullWidth>
                                <InputLabel>Capacidade do Equipamento</InputLabel>
                                <Select name="cargaEquipamento" value={equipamento.cargaEquipamento} onChange={handleChange}>
                                    <MenuItem value={0}>Normal</MenuItem>
                                    <MenuItem value={1}>Obeso</MenuItem>
                                    <MenuItem value={2}>Semi-obeso</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='form-input-estado'>
                            <FormControl fullWidth>
                                <Autocomplete
                                    value={selectedLocal}
                                    options={local}
                                    getOptionLabel={(option) => option.nomeLocal}
                                    onChange={(event, value) => handleAutoCompleteChangeLocal(event, value, 'idLocal')}
                                    renderInput={(params) => <TextField {...params} label="Local de armazenamento" />}
                                />
                            </FormControl>
                        </div>

                        <div className='form-input'>
                            <CustomInput label="Descrição" type="text" name="descricaoEquipamento" value={equipamento.descricaoEquipamento} onChange={handleChange} />
                        </div>
                        <p className='edit-string'>Clique nas fotos para editar</p>
                        <div className='photos'>
                            <div className='form-input'>
                                <div {...getRootProps1()} className="dropzone">
                                    <input {...getInputProps1()} />
                                    {preview1 ? <img src={preview1} alt="Preview" className="preview-image" /> : <p>Clique para selecionar a Foto 1</p>}
                                </div>
                            </div>
                            <div className='form-input'>
                                <div {...getRootProps2()} className="dropzone">
                                    <input {...getInputProps2()} />
                                    {preview2 ? <img src={preview2} alt="Preview" className="preview-image" /> : <p>Clique para selecionar a Foto 2</p>}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className='save-pessoa' disabled={loading}>Salvar</button>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditEquip;
