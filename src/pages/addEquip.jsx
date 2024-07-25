import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import axios from 'axios';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/addPessoa.css';
import api from '../services/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import categoriasServices from '../services/categoriasServices';
import { FormControl, InputLabel, MenuItem, Select, Button, TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import locaisServices from '../services/locaisServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import URLBase from '../services/URLBase';

const API_URL = URLBase.API_URL;

const AddEquip = () => {
  const [categorias, setCategorias] = useState([]);
  const [equipamento, setEquipamento] = useState({
    nomeEquipamento: '',
    idCategoria: '',
    estadoEquipamento: '',
    cargaEquipamento: '',
    descricaoEquipamento: '',
    idLocal: '',
    foto1: null,
    foto2: null,
    idAssociacao: null
  });
  const [loading, setLoading] = useState(false);
  const [idAssoc, setIdAssoc] = useState('');
  const [message, setMessage] = useState('');
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [local, setLocal] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        setIdAssoc(decodedToken.idAssoc);
        setEquipamento(prevState => ({
          ...prevState,
          idAssociacao: decodedToken.idAssoc
        }));
    }
}, []);

  const handleDrop1 = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setEquipamento(prevState => ({
      ...prevState,
      foto1: file
    }));
    setPreview1(URL.createObjectURL(file));
  };

  const handleAutoCompleteChangeLocal = (event, value, name) => {
    setEquipamento(prevState => ({
        ...prevState,
        [name]: value ? value.idLocal : ''
    }));
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

  useEffect(() => {
    const fetchCategorias = async () => {
        try {
            const data = await categoriasServices.getCategorias(1, 500);
            setCategorias(data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEquipamento(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!equipamento.nomeEquipamento) {
      toast.info("O campo 'Nome do Equipamento' é obrigatório.")
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

    const formData= new FormData();
    for(const key in equipamento){
      formData.append(key, equipamento[key]);
    }
    try {
      await api.post(API_URL + 'Equipamentos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Equipamento cadastrado com sucesso!");
      setTimeout(() => {
        navigate('/Usuarios/Equipamentos');
      }, 1500);
      setLoading(false);

    } catch (error) {
      console.error('Erro ao cadastrar o equipamento:', error);
      toast.error("Erro ao cadastrar o equipamento.")
      setLoading(false);
    }
  };


  return (
    <div className='main-content'>
      <ToastContainer />
      <div className='return-div'>
        <button onClick={() => navigate("/Usuarios/Equipamentos")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
      </div>
      <div className='container-div'>
        <br></br>
        <h2 className='pessoas-title'>Cadastro de Equipamento</h2>
        {message && <p>{message}</p>}
        <form className='form-add-equip' onSubmit={handleSave}>
          <div className='form-input'>
            <CustomInput label="Nome do Equipamento" type="text" name="nomeEquipamento" value={equipamento.nomeEquipamento} onChange={handleChange} />
          </div>
          <div className='form-input'>
            <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                    name="idCategoria"
                    value={equipamento.idCategoria}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                    <em>Selecione uma categoria</em>
                    </MenuItem>
                    {categorias.map(categoria => (
                    <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                        {categoria.nomeCategoria}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
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
                    <InputLabel>Capacidade do Equipamento</InputLabel>
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
          <div className='form-input-estado'>
            <FormControl fullWidth>
              <Autocomplete
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
          <div className='photos'>
            <div className='form-input'>
              <div {...getRootProps1()} className="dropzone">
                <input {...getInputProps1()} />
                {preview1 ? <img src={preview1} alt="Preview" className="preview-image" /> : <p className='edit-string'>Foto 1</p>}
              </div>
            </div>
            <div className='form-input'>
              <div {...getRootProps2()} className="dropzone">
                <input {...getInputProps2()} />
                {preview2 ? <img src={preview2} alt="Preview" className="preview-image" /> : <p className='edit-string'>Foto 2</p>}
              </div>
            </div>
          </div>
          
          <button type="submit" className='save-equip' disabled={loading}>Salvar</button>
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

export default AddEquip;