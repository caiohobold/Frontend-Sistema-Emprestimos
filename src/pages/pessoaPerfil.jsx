import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import emprestimosService from '../services/emprestimosService';
import { jwtDecode } from 'jwt-decode';
import { FormControlLabel, Checkbox, Box, TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/pessoaPerfil.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../services/axiosConfig';
import locaisServices from '../services/locaisServices';
import Loading from '../components/loading';
import equipamentosService from '../services/equipamentosService';

const PerfilPessoa = () => {
  const { id } = useParams();
  const [emprestimos, setEmprestimos] = useState([]);
  const [estadoEquipamento, setEstadoEquipamento] = useState([]);
  const [locais, setLocais] = useState([]);
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedEmprestimo, setSelectedEmprestimo] = useState(null);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [role, setRole] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
    if (token) {
        const decodedToken = jwtDecode(token)
        setRole(decodedToken.role);
    }
}, []);

  const getStatusPessoa = (status) => {
        const statusMap = {
            0: 'Com empréstimo',
            1: 'Sem empréstimo'
        };
        return statusMap[status] || 'Sem empréstimo'; 
    };

    const getStatusClass = (status) => {
        const statusClasses = {
        0: 'com-emprestimo',
        1: 'sem-emprestimo'
        };
        return statusClasses[status] || 'sem-emprestimo'; // Retorna uma classe padrão se não for 0, 1 ou 2
    };

    const getEmpStatusClass = (status) => {
      const empStatusClass = {
        0: 'em-andamento',
        1: 'finalizado'
      }
      return empStatusClass[status];
    }

    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  };

  const isAtrasado = (dataDevolucao, status) => {
    const dataAtual = new Date();
    const dataDevolucaoDate = new Date(dataDevolucao);
    return dataAtual > dataDevolucaoDate && status === 0;
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(89, 89, 89, 0.75)', // Cor de fundo do overlay
    },
  };


  useEffect(() => {
    const loadLocais = async () => {
        try {
            const data = await locaisServices.getLocais(1, 500);
            setLocais(data);
        } catch (error) {
            console.error("Erro ao carregar os locais:", error);
        }
    };

    loadLocais();
}, []);
    

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try{
        const pessoaResponse = await api.get(`https://localhost:7000/api/Pessoas/${id}`);
        setPessoa(pessoaResponse.data);

        const emprestimosResponse = await emprestimosService.getEmprestimosByPessoaId(id);
        setEmprestimos(emprestimosResponse);
      } catch (error){
        console.error("Falha ao carregar os dados: ", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleFinalizar = (idEmprestimo, idEquipamento) => {
    console.log("Selecionado para finalizar:", idEmprestimo, idEquipamento);  // Log para verificar o ID
    confirmAlert({
        title: 'Confirmar finalização',
        message: 'Você tem certeza que deseja finalizar este empréstimo?',
        buttons: [
            {
                label: 'Sim',
                onClick: () => {
                    setSelectedEmprestimo({ idEmprestimo, idEquipamento });
                    setIsLocationModalOpen(true);
                }
            },
            {
                label: 'Não'
            }
        ]
    });
};

  const handleLocationSubmit = async () => {
    if (selectedEmprestimo) {
        try {
            if (selectedLocal) {
                await atualizarLocalEquipamento(selectedEmprestimo.idEquipamento, selectedLocal);
            }
            if(estadoEquipamento){
                await equipamentosService.patchEstadoEquipamento(selectedEmprestimo.idEquipamento, estadoEquipamento);
            }
            
            await finalizarEmprestimo(selectedEmprestimo.idEmprestimo);
        } catch (error) {
            alert("Falha ao atualizar o local ou estado do equipamento. O empréstimo não será finalizado.");
        }
    }
  };

  const finalizarEmprestimo = async (idEmprestimo) => {
    try {
        await emprestimosService.finalizarEmprestimo(idEmprestimo);
        console.log("Empréstimo finalizado com sucesso!");
        setEmprestimos(emprestimos.filter(emp => emp.id !== idEmprestimo));
        setIsLocationModalOpen(false);
        setSelectedLocal(null);
        setSelectedEmprestimo(null);
    } catch (error) {
        console.error("Erro ao finalizar empréstimo:", error);
        alert("Falha ao finalizar empréstimo");
    }
  };

const atualizarLocalEquipamento = async (idEquipamento, localId) => {
  try {
      console.log("Atualizando local do equipamento:", idEquipamento, localId);  // Log para verificar os IDs
      await locaisServices.updateLocalEquipamento(idEquipamento, localId);
      console.log("Local do equipamento atualizado com sucesso!");
  } catch (error) {
      console.error("Erro ao atualizar local do equipamento:", error);
      throw new Error("Erro ao atualizar local do equipamento");
  }
};

const handleLocationChange = (event, value) => {
  setSelectedLocal(value ? value.idLocal : null);
};

const handleEstadoChange = (event) => {
  setEstadoEquipamento(event.target.value);
};

  if (!pessoa) {
    return <Loading />;
  }

  return (
    <div className='main-content' >
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/pessoas")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>

            <Modal
                style={customStyles}
                isOpen={isLocationModalOpen}
                onRequestClose={() => setIsLocationModalOpen(false)}
                contentLabel="Trocar Local de armazenamento do Equipamento"
                className="modal-filter"
                closeTimeoutMS={300}
            >
                <br />
                <br />
                <h2 className='change-local-equip-h2'>Trocar Local do Equipamento</h2>
                <Autocomplete
                    className='change-local-input'
                    options={locais}
                    getOptionLabel={(option) => option.nomeLocal}
                    onChange={handleLocationChange}
                    renderInput={(params) => <TextField {...params} label="Selecionar Local" />}
                />
                <br />
                <hr />
                <br />
                <h2 className='change-local-equip-h2'>Trocar estado do Equipamento</h2>
                <div className='form-input-estado'>
                    <FormControl fullWidth>
                        <InputLabel>Estado do Equipamento</InputLabel>
                        <Select
                            name="estadoEquipamento"
                            value={estadoEquipamento}
                            onChange={handleEstadoChange}
                        >
                            <MenuItem value={1}>Usado</MenuItem>
                            <MenuItem value={2}>Defeituoso</MenuItem>
                            {role === 'Associacao' && (
                            <MenuItem value={3}>Baixado</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>
                <button onClick={handleLocationSubmit} className='btn-apply-filter'>Confirmar</button>
            </Modal>
            <div className='container-div'>
                <br></br>
                <Modal
                  style={customStyles}
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Filtros"
                    className="modal-filter"
                    closeTimeoutMS={300}
                >
                    <br />
                    <h3 className='info-row-h3'>Informações Adicionais:</h3>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                      <div className='div-info-add'>
                        <p className='description-pessoa'><span>Descrição:</span> {pessoa.descricao}</p>
                        <p className='tel-pessoa'><span>CPF:</span> {pessoa.cpf}</p>
                        <p className='tel-pessoa'><span>E-mail:</span> {pessoa.email}</p>
                        <p className='tel-pessoa'><span>Endereco:</span> {pessoa.endereco}</p>
                      </div>
                    </Box>
                    <hr></hr>
                    <button onClick={() => setIsModalOpen(false)} className='btn-apply-filter'>Fechar</button>
                </Modal>
                <div className='pessoa'>
                    <div className='pessoa-icon-div'>
                        <FontAwesomeIcon className='pessoa-icon' icon={faCircleUser}/>
                    </div>
                    <div>
                        <div className='pessoa-name'>{pessoa.nomeCompleto}</div>
                        <div className='pessoa-cpf'>{pessoa.telefone}</div>
                        <div className='row-3'>
                          <div className={getStatusClass(pessoa.statusEmprestimo)}>{getStatusPessoa(pessoa.statusEmprestimo)}</div>
                          <button onClick={() => setIsModalOpen(true)} className='btn-filter-more-info'>Detalhes</button>                        
                        </div>
                    </div>
                </div>
                <div className='box-emprestimos'>
                  <h2 className='emprestimos-title'>Empréstimos</h2>
                  {loading ? (
                    <Loading />
                  ) : (
                    emprestimos.length === 0 ? (
                      <div className='no-emprestimos'>
                        <FontAwesomeIcon icon={faWheelchair} className='icon-chair' />
                        <div>Nenhum empréstimo encontrado.</div>
                      </div>
                    ) : (
                      emprestimos.map(emp => (
                        <div key={emp.id} className='sub-box-emprestimos'>
                          <div className='atrasado'>
                            {isAtrasado(emp.dataDevolucao, emp.status) && <div className='status-atrasado'>Atrasado</div>}
                          </div>
                          <div className='nomeEquipamento'>{emp.nomeEquipamento}</div>
                          <div className='row-dates'>
                            <div className='dataEmp'>Início: {formatDate(emp.dataEmprestimo.split('T')[0])}</div>
                            <div className='dataDev'>Devolução: {formatDate(emp.dataDevolucao.split('T')[0])}</div>
                          </div>
                          <div className='status-and-btn'>
                            <div className={getEmpStatusClass(emp.status)}>{emp.status === 0 ? 'Em andamento' : 'Finalizado'}</div>
                            {emp.status === 0 && (
                              <button onClick={() => handleFinalizar(emp.id, emp.idEquipamento)} className='finalizar-btn'>Finalizar</button>
                            )}
                          </div>
                    </div>
                  ))
                )
              )}

            </div>
            
          </div>
        </div>
  );
}

export default PerfilPessoa;