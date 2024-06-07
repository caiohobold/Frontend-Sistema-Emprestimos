import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import axios from 'axios';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/addPessoa.css';
import api from '../services/axiosConfig';
import categoriasServices from '../services/categoriasServices';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const AddEquip = () => {
  const [categorias, setCategorias] = useState([]);
  const [equipamento, setEquipamento] = useState({
    nomeEquipamento: '',
    idCategoria: '',
    estadoEquipamento: '',
    cargaEquipamento: '',
    descricaoEquipamento: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

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
    setLoading(true);
    try {
      await api.post('https://localhost:7000/api/Equipamentos', equipamento);
      setMessage('Equipamento cadastrado com sucesso!');
      setLoading(false);
      navigate('/Usuarios/Equipamentos');
    } catch (error) {
      console.error('Erro ao cadastrar o equipamento:', error);
      setMessage('Erro ao cadastrar o equipamento.');
      setLoading(false);
    }
  };

  return (
    <div className='main-content'>
      <div className='return-div'>
        <button onClick={() => navigate("/Usuarios/Equipamentos")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
      </div>
      <div className='container-div'>
        <br></br>
        <h2 className='pessoas-title'>Cadastro de Equipamento</h2>
        {message && <p>{message}</p>}
        <form className='form-edit' onSubmit={handleSave}>
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
  );
}

export default AddEquip;