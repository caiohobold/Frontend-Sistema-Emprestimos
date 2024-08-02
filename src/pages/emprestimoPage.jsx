import React, { useState, useEffect } from 'react';
import emprestimosService from '../services/emprestimosService';
import locaisServices from '../services/locaisServices';
import { useNavigate } from 'react-router-dom';
import WheelShareLogo from '../photos/WheelShareWithoutName.png';
import { jwtDecode } from 'jwt-decode';
import '../styles/emprestimoPage.css';
import { faPenToSquare, faWheelchair, faFilter } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/navBar';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Modal from 'react-modal';
import { FormControlLabel, Checkbox, Box, TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import equipamentosService from '../services/equipamentosService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/loading';

const EmprestimosPage = () => {
    const [emprestimos, setEmprestimos] = useState([]);
    const [locais, setLocais] = useState([]);
    const [estadoEquipamento, setEstadoEquipamento] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredEmprestimos, setFilteredEmprestimos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAtrasados, setShowAtrasados] = useState(true);
    const [showAgendados, setShowAgendados] = useState(true)
    const [showEmDia, setShowEmDia] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedEmprestimo, setSelectedEmprestimo] = useState(null);
    const [selectedLocal, setSelectedLocal] = useState(null);
    const [filteredCount, setFilteredCount] = useState(0);
    const [role, setRole] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token)
            setRole(decodedToken.role);
        }
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        let results = emprestimos.filter(emp =>
            emp.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) || emp.nomeEquipamento.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        // Filtros combinados para Atrasados, Em dia e Agendados
        if (showAtrasados || showEmDia || showAgendados) {
            results = results.filter(emp => {
                const isAtrasadoStatus = isAtrasado(emp.dataDevolucao);
                const isAgendadoStatus = isAgendado(emp.dataEmprestimo);
                const isEmDiaStatus = !isAtrasadoStatus && !isAgendadoStatus;
    
                return (
                    (showAtrasados && isAtrasadoStatus) ||
                    (showEmDia && isEmDiaStatus) ||
                    (showAgendados && isAgendadoStatus)
                );
            });
        }
    
        if (startDate) {
            results = results.filter(emp => new Date(emp.dataEmprestimo) >= new Date(startDate));
        }
    
        if (endDate) {
            results = results.filter(emp => new Date(emp.dataEmprestimo) <= new Date(endDate));
        }
    
        setFilteredEmprestimos(results);
        setFilteredCount(results.length);
    }, [searchTerm, emprestimos, showAtrasados, showEmDia, showAgendados, startDate, endDate]);
    
    

    useEffect(() => {
        const loadEmprestimos = async () => {
            try {
                setLoading(true);
                const data = await emprestimosService.getEmprestimosAtivos(1, 500);
                setEmprestimos(data);
                setFilteredEmprestimos(data);
                setLoading(false);
            } catch (error) {
                console.error("Falha ao carregar os empréstimos:", error);
                setLoading(false);
            }
        };

        loadEmprestimos();
    }, []);

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

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const getCargaDescription = (carga) => {
        const cargaMap = {
            0: 'Normal',
            1: 'Obeso',
            2: 'Semi-obeso'
        };
        return cargaMap[carga] || 'desconhecido';
    };

    const getCargaClass = (carga) => {
        const cargaClasses = {
            0: 'carga-normal',
            1: 'carga-obeso',
            2: 'carga-semi-obeso'
        };
        return cargaClasses[carga] || 'carga-desconhecido';
    };

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

    const customStyles = {
        overlay: {
          backgroundColor: 'rgba(89, 89, 89, 0.75)', // Cor de fundo do overlay
        },
      };

    const isAtrasado = (dataDevolucao) => {
        const dataAtual = new Date();
        const dataDevolucaoDate = new Date(dataDevolucao);
        return dataAtual > dataDevolucaoDate;
    }

    const isAgendado = (dataInicio) => {
        const dataAtual = new Date();
        const dataInicioDate = new Date(dataInicio);
        return dataAtual < dataInicioDate;
    }

    const finalizarEmprestimo = async (idEmprestimo) => {
        try {
            await emprestimosService.finalizarEmprestimo(idEmprestimo);
            setEmprestimos(emprestimos.filter(emp => emp.id !== idEmprestimo));
            toast.success("Empréstimo finalizado com sucesso!");
            setTimeout(() => {
                setIsLocationModalOpen(false);
            }, 1500);
            setSelectedLocal(null);
            setSelectedEmprestimo(null);
        } catch (error) {
            toast.error("Erro ao finalizar empréstimo.");
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
            toast.error("Erro ao finalizar empréstimo.");
        }
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
                
                console.log("Passou por aqui")
                await finalizarEmprestimo(selectedEmprestimo.idEmprestimo);
            } catch (error) {
                alert("Falha ao atualizar o local ou estado do equipamento. O empréstimo não será finalizado.");
            }
        }
    };

    const handleEditar = (idEmprestimo) => {
      console.log("Selecionado para edição:", idEmprestimo);  // Log para verificar o ID
      navigate(`/emprestimos/edit/${idEmprestimo}`);
  };

    const handleLocationChange = (event, value) => {
        setSelectedLocal(value ? value.idLocal : null);
    };

    const handleEstadoChange = (event) => {
        setEstadoEquipamento(event.target.value);
    };

    return (
        <div className='main-content'>
            <ToastContainer />
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo' alt="WheelShare Logo"></img>
            </div>
            <Modal
                style={customStyles}
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Filtros"
                className="modal-filter"
                closeTimeoutMS={300}
            >
                <br />
                <h2>Filtros</h2>
                <h3>Mostrar apenas empréstimos:</h3>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" marginLeft="25px" marginRight="130px">
                    <FormControlLabel
                        control={<Checkbox checked={showAtrasados} onChange={() => setShowAtrasados(!showAtrasados)} />}
                        label="Atrasados"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showEmDia} onChange={() => setShowEmDia(!showEmDia)} />}
                        label="Em dia"
                    />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" marginLeft="25px" marginRight="130px">
                    <FormControlLabel
                        control={<Checkbox checked={showAgendados} onChange={() => setShowAgendados(!showAgendados)} />}
                        label="Agendados"
                    />
                </Box>
                <hr />
                <h3>Filtrar por data de início:</h3>
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" marginTop="15px">
                    <TextField
                        label="Data de Início"
                        className='date-input'
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Data de Fim"
                        className='date-input'
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
                <button onClick={() => setIsModalOpen(false)} className='btn-apply-filter'>Aplicar Filtros</button>
            </Modal>

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
                <div className='row-title'>
                    <h2 className='emprestimo-title'>Empréstimos</h2>
                    <button onClick={() => setIsModalOpen(true)} className='btn-filter'><FontAwesomeIcon className="icon-filter" icon={faFilter} /></button>
                </div>
                <input
                    type="text"
                    placeholder="Pesquise um equipamento ou pessoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
                <div className='emprestimos'>
                <p className='total-equip'>{filteredCount} empréstimos ativos</p>
                    {loading ? (
                        <Loading />
                    ) : (
                        filteredEmprestimos.length === 0 ? (
                            <div className='no-emprestimos'>
                                <FontAwesomeIcon icon={faWheelchair} className='icon-chair' />
                                <div>Nenhum empréstimo ativo encontrado.</div>
                            </div>
                        ) : (
                            filteredEmprestimos.map(emp =>
                                <div key={emp.id} className='box-emprestimo'>
                                    <div className='atrasado-agendado'>
                                        {isAgendado(emp.dataEmprestimo) && <div className='status-agendado'>Agendado</div>}
                                        {isAtrasado(emp.dataDevolucao) && <div className='status-atrasado'>Atrasado</div>}
                                    </div>
                                    <div className='row-edit'>
                                        <div className='nomepessoa-emprestimo'>{emp.nomePessoa}</div>
                                        <button className='btn-edit-equip-div' onClick={() => handleEditar(emp.id)}><FontAwesomeIcon className='btn-edit-equip' icon={faPenToSquare} /></button>
                                    </div>
                                    <div className='nomeequipamento-emprestimo'>{emp.nomeEquipamento}</div>
                                    <div className='row-datas'>
                                        <div className='data-emprestimo'>Início: {formatDate(emp.dataEmprestimo.split('T')[0])}</div>
                                        <div></div>
                                        <div className='data-devolucao'>Devolução: {formatDate(emp.dataDevolucao.split('T')[0])}</div>
                                    </div>
                                    <div className='modals'>
                                        <div className={getCargaClass(emp.cargaEquipamento)}>{getCargaDescription(emp.cargaEquipamento)}</div>
                                        <button onClick={() => handleFinalizar(emp.id, emp.idEquipamento)} className='btn-finalizar'>Finalizar</button>
                                    </div>
                                </div>
                            )
                        )
                    )}
                    <br></br>
                    <br></br>
                </div>

                <NavBar />
            </div>
        </div>
    );
}

export default EmprestimosPage;
