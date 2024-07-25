import React, { useState, useEffect } from 'react';
import pessoasService from '../services/pessoasService';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/equipamentosPage.css';
import { faArrowLeft, faCircleUser, faWheelchair, faCrutch, faFilter, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavBar from '../components/navBar';
import { Box, FormControl, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, ListItemText } from '@mui/material';
import Modal from 'react-modal';
import equipamentosService from '../services/equipamentosService';
import categoriasServices from '../services/categoriasServices';
import locaisServices from '../services/locaisServices';
import Loading from '../components/loading';

const EquipamentosPage = () => {
    const [equipamentos, setEquipamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredEquipamentos, setFilteredEquipamentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showInUse, setShowInUse] = useState(true);
    const [showAvailable, setShowAvailable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNew, setShowNew] = useState(true);
    const [showUsed, setShowUsed] = useState(true);
    const [showDefeito, setShowDefeito] = useState(true);
    const [showBaixado, setShowBaixado] = useState(true);
    const [showNormal, setShowNormal] = useState(true);
    const [showObeso, setShowObeso] = useState(true);
    const [showSemiObeso, setShowSemiObeso] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [selectedCategorias, setSelectedCategorias] = useState([]);
    const [openCategorias, setOpenCategorias] = useState(false);
    const [locais, setLocais] = useState([]);
    const [selectedLocais, setSelectedLocais] = useState([]);
    const [openLocais, setOpenLocais] = useState(false);
    const [filteredCount, setFilteredCount] = useState(0);
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('userToken'); // Ou onde você estiver armazenando o token
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);

    const getEquipamentoIcon = (categoria) => {
        switch (categoria) {
            case 'Cadeiras de Rodas':
                return faWheelchair;
            case 'Muletas':
                return faCrutch;
            default:
                return faCircleUser;
        }
    };

    const handleCategoriaChange = (event) => {
        const value = event.target.value;
        setSelectedCategorias(value);
    };

    const handleLocalChange = (event) => {
        const value = event.target.value;
        setSelectedLocais(value);
    };

    const getStatusString = (status, estado) => {
        if (estado === 2 || estado === 3) {
            return "Fora de uso";
        }
        const statusMap = {
            0: "Em uso",
            1: "Disponível"
        };
        return statusMap[status] || "Disponível";
    };

    const getStatusClass = (status, estado) => {
        if (estado === 2 || estado === 3) {
            return "fora-de-uso";
        }
        const statusMap = {
            0: "em-uso",
            1: "disponivel"
        };
        return statusMap[status] || "disponivel";
    };

    const getEstadoString = (status) => {
        const statusMap = {
            0: "Novo",
            1: "Usado",
            2: "Defeito",
            3: "Baixado"
        };
        return statusMap[status] || "Usado";
    };

    const getEstadoClass = (status) => {
        const statusMap = {
            0: "novo",
            1: "usado",
            2: "defeito",
            3: "baixado"
        };
        return statusMap[status] || "usado";
    };

    const getCargaDescription = (carga) => {
        const cargaMap = {
            0: 'Normal',
            1: 'Obeso',
            2: 'Semi-obeso'
        };
        return cargaMap[carga] || 'desconhecido';
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(89, 89, 89, 0.75)',
        },
    };

    const getCargaClass = (carga) => {
        const cargaClasses = {
            0: 'carga-normal-class',
            1: 'carga-obeso-class',
            2: 'carga-semi-obeso-class'
        };
        return cargaClasses[carga] || 'carga-desconhecido';
    };

    const renderImage = (base64String) => {
        if (!base64String) {
            console.log("Imagem base64 está vazia");
            return null;
        }
        return `data:image/png;base64,${base64String}`;
    };

    useEffect(() => {
        const loadEquipamentos = async () => {
            try {
                setLoading(true);
                const data = await equipamentosService.getEquipamentos(1, 500); // Carregar 10 por vez
                setEquipamentos(data);
                setFilteredEquipamentos(data);
                setLoading(false);
            } catch (error) {
                console.error("Falha ao carregar os equipamentos:", error);
                setLoading(false);
            }
        };
    
        loadEquipamentos();
    }, [page]);

    useEffect(() => {
        const loadLocais = async () => {
            try {
                const data = await locaisServices.getLocais(1, 500);
                setLocais(data);
                setSelectedLocais(data.map(local => local.idLocal));
            } catch (error) {
                console.error("Erro ao carregar os locais:", error);
            }
        };

        loadLocais();
    }, []);

    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const data = await categoriasServices.getCategorias(1, 500);
                console.log("Categorias carregadas: ", data);
                setCategorias(data);
                setSelectedCategorias(data.map(categoria => categoria.idCategoria));
            } catch (error) {
                console.error("Falha ao carregar as categorias:", error);
            }
        };

        loadCategorias();
    }, []);

    useEffect(() => {
        let results = equipamentos.filter(equip =>
            equip.nomeEquipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equip.idEquipamento.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (showInUse && !showAvailable) {
            results = results.filter(equip => equip.statusEquipamento === 0);
        } else if (!showInUse && showAvailable) {
            results = results.filter(equip => equip.statusEquipamento === 1 || equip.statusEquipamento === -1);
        } else if (!showInUse && !showAvailable) {
            results = [];
        }

        if (showNew && !showUsed && !showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0);
        } else if (!showNew && showUsed && !showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 1);
        } else if (!showNew && !showUsed && showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 2);
        } else if (!showNew && !showUsed && !showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 3);
        } else if (showNew && showUsed && !showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 1);
        } else if (showNew && !showUsed && showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 2);
        } else if (showNew && !showUsed && !showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 3);
        } else if (!showNew && showUsed && showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 1 || equip.estadoEquipamento === 2);
        } else if (!showNew && showUsed && !showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 1 || equip.estadoEquipamento === 3);
        } else if (!showNew && !showUsed && showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 2 || equip.estadoEquipamento === 3);
        } else if (showNew && showUsed && showDefeito && !showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 1 || equip.estadoEquipamento === 2);
        } else if (showNew && showUsed && !showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 1 || equip.estadoEquipamento === 3);
        } else if (showNew && !showUsed && showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 2 || equip.estadoEquipamento === 3);
        } else if (!showNew && showUsed && showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 1 || equip.estadoEquipamento === 2 || equip.estadoEquipamento === 3);
        } else if (showNew && showUsed && showDefeito && showBaixado) {
            results = results.filter(equip => equip.estadoEquipamento === 0 || equip.estadoEquipamento === 1 || equip.estadoEquipamento === 2 || equip.estadoEquipamento === 3);
        }

        if (showNormal && !showObeso && !showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 0);
        } else if (!showNormal && showObeso && !showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 1);
        } else if (!showNormal && !showObeso && showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 2);
        } else if (!showNormal && !showObeso && !showSemiObeso) {
            results = [];
        } else if (showNormal && showObeso && !showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 0 || equip.cargaEquipamento === 1);
        } else if (showNormal && !showObeso && showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 0 || equip.cargaEquipamento === 2);
        } else if (!showNormal && showObeso && showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 1 || equip.cargaEquipamento === 2);
        } else if (showNormal && showObeso && showSemiObeso) {
            results = results.filter(equip => equip.cargaEquipamento === 0 || equip.cargaEquipamento === 1 || equip.cargaEquipamento === 2);
        }

        results = results.filter(equip => selectedCategorias.includes(equip.idCategoria));

        results = results.filter(equip => selectedLocais.includes(equip.idLocal));

        setFilteredEquipamentos(results);
        setFilteredCount(results.length); 
    }, [searchTerm, equipamentos, showInUse, showAvailable, showNew, showUsed, showDefeito, showBaixado, showNormal, showObeso, showSemiObeso, selectedCategorias, selectedLocais]);

    const navigate = useNavigate();

    return (
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/Inicio")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
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
                <h3>Disponibilidade:</h3>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" backgroundColor="white" marginLeft="25px" marginRight="100px">
                    <FormControlLabel
                        control={<Checkbox checked={showInUse} onChange={() => setShowInUse(!showInUse)} />}
                        label="Em uso"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showAvailable} onChange={() => setShowAvailable(!showAvailable)} />}
                        label="Disponíveis"
                    />
                </Box>
                <h3>Estado:</h3>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" marginLeft="25px" marginRight="130px">
                    <FormControlLabel
                        control={<Checkbox checked={showNew} onChange={() => setShowNew(!showNew)} />}
                        label="Novos"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showUsed} onChange={() => setShowUsed(!showUsed)} />}
                        label="Usados"
                    />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" marginLeft="25px" marginRight="130px">
                    <FormControlLabel
                        control={<Checkbox checked={showDefeito} onChange={() => setShowDefeito(!showDefeito)} />}
                        label="Defeituosos"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showBaixado} onChange={() => setShowBaixado(!showBaixado)} />}
                        label="Baixados"
                    />
                </Box>
                <h3>Carga:</h3>
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" gap="5px">
                    <FormControlLabel
                        control={<Checkbox checked={showNormal} onChange={() => setShowNormal(!showNormal)} />}
                        label="Normal"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showObeso} onChange={() => setShowObeso(!showObeso)} />}
                        label="Obeso"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={showSemiObeso} onChange={() => setShowSemiObeso(!showSemiObeso)} />}
                        label="Semi-obeso"
                    />
                </Box>
                <h3>Mostrar por categorias:</h3>
                <div className='filter-categoria'>
                    <FormControl fullWidth>
                        <InputLabel id="categorias-label">Categorias</InputLabel>
                        <Select
                            labelId="categorias-label"
                            id="categorias-select"
                            multiple
                            value={selectedCategorias}
                            onChange={handleCategoriaChange}
                            open={openCategorias}
                            onClose={() => setOpenCategorias(false)}
                            onOpen={() => setOpenCategorias(true)}
                            renderValue={(selected) => selected.map(id => {
                                const categoria = categorias.find(c => c.idCategoria === id);
                                return categoria ? categoria.nomeCategoria : '';
                            }).join(', ')}
                        >
                            {categorias.map(categoria => (
                                <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                                    <Checkbox checked={selectedCategorias.includes(categoria.idCategoria)} />
                                    <ListItemText primary={categoria.nomeCategoria} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <br />
                <h3>Mostrar por locais:</h3>
                <div className='filter-categoria'>
                    <FormControl fullWidth>
                        <InputLabel id="locais-label">Locais</InputLabel>
                        <Select
                            labelId="locais-label"
                            id="locais-select"
                            multiple
                            value={selectedLocais}
                            onChange={handleLocalChange}
                            open={openLocais}
                            onClose={() => setOpenLocais(false)}
                            onOpen={() => setOpenLocais(true)}
                            renderValue={(selected) => selected.map(id => {
                                const local = locais.find(l => l.idLocal === id);
                                return local ? local.nomeLocal : '';
                            }).join(', ')}
                        >
                            {locais.map(local => (
                                <MenuItem key={local.idLocal} value={local.idLocal}>
                                    <Checkbox checked={selectedLocais.includes(local.idLocal)} />
                                    <ListItemText primary={local.nomeLocal} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <button onClick={() => setIsModalOpen(false)} className='btn-apply-filter'>Aplicar Filtros</button>
            </Modal>
            <div className='container-div'>
                <br></br>
                <div className='row-title'>
                    <h2 className='pessoas-title'>Equipamentos</h2>
                    <button onClick={() => setIsModalOpen(true)} className='btn-filter'><FontAwesomeIcon className="icon-filter" icon={faFilter} /></button>
                </div>
                <input
                    type="text"
                    placeholder="Pesquise um equipamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
                <div className='equipamentos'>
                    <p className='total-equip'>{filteredCount} equipamentos</p>
                    {loading ? (
                        <Loading />
                    ) : (
                        filteredEquipamentos.length === 0 ? (
                            <div className='no-emprestimos-pessoa'>
                                <FontAwesomeIcon icon={faWheelchair} className='icon-chair' />
                                <div>Nenhum equipamento encontrado.</div>
                            </div>
                        ) : (
                            filteredEquipamentos.map(equip =>
                                <div key={equip.idEquipamento} className='box-equip'>
                                    <div className='icon-equip-div'>
                                    {equip.foto1 ? (
                                        <img src={renderImage(equip.foto1)} className='img-equip' alt='Equipamento' />
                                    ) : (
                                        <FontAwesomeIcon icon={faWheelchair} size="4x" className='img-null-equip' />
                                    )}
                                    </div>
                                    <div className='equip-info'>
                                        <div className='row-info'>
                                            <div className='nomeequip'>{equip.nomeEquipamento}</div>
                                            <div className='idequip'>ID: {equip.idEquipamento}</div>
                                        </div>
                                        <div className='row1-info'>
                                            <div className={getStatusClass(equip.statusEquipamento, equip.estadoEquipamento)}>{getStatusString(equip.statusEquipamento, equip.estadoEquipamento)}</div>
                                            <div className={getEstadoClass(equip.estadoEquipamento)}>{getEstadoString(equip.estadoEquipamento)}</div>
                                        </div>
                                        <div className='row2-info'>
                                            <div className={getCargaClass(equip.cargaEquipamento)}>{getCargaDescription(equip.cargaEquipamento)}</div>
                                            {role === 'Associacao' && (
                                                <button className='btn-equip-div' onClick={() => navigate(`/equipamento/edit/${equip.idEquipamento}`)}>Editar</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className='modals'>

                                    </div>
                                </div>
                            )
                        )
                    )}
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className={`plus-pessoa-div ${isModalOpen ? 'hidden' : ''}`}>
                        <button className='plus-pessoa' onClick={() => navigate("/equipamento/add")}>Cadastrar Equipamento</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquipamentosPage;
