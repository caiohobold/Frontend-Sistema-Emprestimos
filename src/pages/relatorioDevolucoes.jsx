import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import WheelShareLogo from '../photos/WheelShareWithoutName.png';
import '../styles/userPage.css';
import CustonBtn from '../components/customBtn';
import NavBar from '../components/navBar';
import { faUser, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faUserGroup, faTriangleExclamation, faChartPie, faArrowLeft, faWheelchair, faFilter, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import emprestimosService from '../services/emprestimosService';
import Modal from 'react-modal';
import { FormControlLabel, Checkbox, Box, TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Loading from '../components/loading';

const RelatorioDevolucoes = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [emprestimos, setEmprestimos] = useState([]);
    const [showAtivos, setshowAtivos] = useState(true);
    const [showFinalizados, setshowFinalizados] = useState(true);
    const [estadoEquipamento, setEstadoEquipamento] = useState([]);
    const [showAtrasados, setShowAtrasados] = useState(true);
    const [showEmDia, setShowEmDia] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [locais, setLocais] = useState([]);
    const [selectedLocal, setSelectedLocal] = useState(null);
    const [endDate, setEndDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filteredEmprestimos, setFilteredEmprestimos] = useState([]);
    const [filteredCount, setFilteredCount] = useState(0);

    useEffect(() => {
        let results = emprestimos.filter(emp =>
            emp.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) || emp.nomeEquipamento.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (showAtrasados && !showEmDia) {
            results = results.filter(emp => isAtrasado(emp.dataDevolucao));
        } else if (!showAtrasados && showEmDia) {
            results = results.filter(emp => !isAtrasado(emp.dataDevolucao));
        } else if (!showAtrasados && !showEmDia) {
            results = [];
        }

        if (startDate) {
            results = results.filter(emp => new Date(emp.dataDevolucao) >= new Date(startDate));
        }

        if (endDate) {
            results = results.filter(emp => new Date(emp.dataDevolucao) <= new Date(endDate));
        }

        setFilteredEmprestimos(results);
        setFilteredCount(results.length); 
    }, [searchTerm, emprestimos, showAtrasados, showEmDia, startDate, endDate]);

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token)
            setRole(decodedToken.role);
        }
    }, []);

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

    const handleLocationChange = (event, value) => {
        setSelectedLocal(value ? value.idLocal : null);
    };

    const handleEstadoChange = (event) => {
        setEstadoEquipamento(event.target.value);
    };

    const customStyles = {
        overlay: {
          backgroundColor: 'rgba(89, 89, 89, 0.75)', // Cor de fundo do overlay
        },
      };

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

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };


    return (
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Associacao/relatorios")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
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
                <hr />
                <h3>Filtrar por data de devolução:</h3>
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

            <div className='container-div'>
                <br></br>
                <div className='row-title'>
                    <h2 className='emprestimo-title'>Próximas Devoluções</h2>
                    <button onClick={() => setIsModalOpen(true)} className='btn-filter'><FontAwesomeIcon className="icon-filter" icon={faFilter} /></button>
                </div>
                <input
                    type="text"
                    placeholder="Pesquise um equipamento ou pessoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
                <div className='emprestimos-realizados'>
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
                                    <div className='atrasado'>
                                        {isAgendado(emp.dataEmprestimo) && <div className='status-agendado'>Agendado</div>}
                                        {isAtrasado(emp.dataDevolucao) && <div className='status-atrasado'>Atrasado</div>}
                                    </div>
                                    <div className='row-edit'>
                                        <div className='nomepessoa-emprestimo-relatorio'>{emp.nomePessoa}</div>
                                    </div>
                                    <div className='nomeequipamento-emprestimo-relatorio'>{emp.nomeEquipamento}</div>
                                    <div className='row-datas'>
                                        <div className='data-devolucao-relatorio'>Devolução estimada: {formatDate(emp.dataDevolucao.split('T')[0])}</div>
                                        <Link to={`/pessoa/${emp.idPessoa}`}>
                                                <button className='profile-btn-relatorio'><FontAwesomeIcon icon={faUpRightFromSquare} className='icon-btn-relatorio'/></button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        )
                    )}
                    <br></br>
                    <br></br>
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
};

export default RelatorioDevolucoes;
