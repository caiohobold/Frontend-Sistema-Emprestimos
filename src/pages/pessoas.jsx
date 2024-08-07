import React, { useState, useEffect } from 'react';
import pessoasService from '../services/pessoasService';
import { Link, useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox, TextField, Box } from '@mui/material';
import '../styles/pessoasPage.css';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import Loading from '../components/loading';

const PessoasPage = () => {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredPessoas, setFilteredPessoas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(true);
    const [showInactiveOnly, setShowInactiveOnly] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredCount, setFilteredCount] = useState(0);

    useEffect(() => {
        const loadPessoas = async () => {
            try {
                setLoading(true);
                const data = await pessoasService.getPessoas(1, 500);
                setPessoas(data);
                setFilteredPessoas(data);
                setLoading(false);
            } catch (error) {
                console.error("Falha ao carregar as pessoas:", error);
                setLoading(false);
            }
        };

        loadPessoas();
    }, []);

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(89, 89, 89, 0.75)', // Cor de fundo do overlay
        },
    };

    useEffect(() => {
        let results = pessoas;

        if (showActiveOnly && !showInactiveOnly) {
            results = results.filter(pessoa => pessoa.statusEmprestimo === 0);
        } else if (!showActiveOnly && showInactiveOnly) {
            results = results.filter(pessoa => pessoa.statusEmprestimo !== 0);
        } else if (!showActiveOnly && !showInactiveOnly) {
            results = [];
        }
        results = results.filter(pessoa => 
            pessoa.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) || pessoa.cpf.toLowerCase().replace(/\./g, "").replace("-", "").includes(searchTerm.toLowerCase())
        );

        setFilteredPessoas(results);
        setFilteredCount(results.length);
    }, [searchTerm, pessoas, showActiveOnly, showInactiveOnly]);

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
        return statusClasses[status] || 'sem-emprestimo'; 
    };

    const navigate = useNavigate();

    return (
        <div className='main-content'>
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/Inicio")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br></br>
                <div className='row-title'>
                    <h2 className='pessoas-title'>Pessoas</h2>
                    <button onClick={() => setIsModalOpen(true)} className='btn-filter'><FontAwesomeIcon className="icon-filter" icon={faFilter} /></button>
                </div>
                <input
                    type="text"
                    placeholder="Pesquise um nome ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
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
                    <h3>Mostrar apenas pessoas:</h3>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" marginLeft="25px" marginRight="130px">
                        <FormControlLabel
                            control={<Checkbox checked={showActiveOnly} onChange={() => setShowActiveOnly(!showActiveOnly)} />}
                            label="Com empréstimos"
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="row" marginLeft="25px" marginRight="130px">
                        <FormControlLabel
                            control={<Checkbox checked={showInactiveOnly} onChange={() => setShowInactiveOnly(!showInactiveOnly)} />}
                            label="Sem empréstimos"
                        />
                    </Box>
                    <button onClick={() => setIsModalOpen(false)} className='btn-apply-filter'>Aplicar Filtros</button>
                </Modal>
                <div className='pessoas'>
                    <p className='total-equip'>{filteredCount} pessoas</p>
                    {loading ? (
                        <Loading />
                    ) : (
                        filteredPessoas.length === 0 ? (
                            <div className='no-emprestimos-pessoa'>
                                <FontAwesomeIcon icon={faUserSlash} className='icon-chair' />
                                <div>Nenhuma pessoa encontrada.</div>
                            </div>
                        ) : (
                            filteredPessoas.map(p => 
                                <div key={p.idPessoa} className='box-pessoa'>
                                    <div className='icon-pessoa-div'>
                                        <FontAwesomeIcon className='icon-pessoa' icon={faCircleUser} />
                                    </div>
                                    <div className='pessoas-info'>
                                        <div className='nomepessoa'>{p.nomeCompleto}</div>
                                        <div className={getStatusClass(p.statusEmprestimo)}>{getStatusPessoa(p.statusEmprestimo)}</div>
                                        <div className='btns'>
                                            <Link to={`/pessoa/${p.idPessoa}`} className='a-profile-btn'>
                                                <button className='profile-btn'>Ver Perfil</button>
                                            </Link>
                                            <button className='btn-edit-div' onClick={() => navigate(`/pessoa/edit/${p.idPessoa}`)}><FontAwesomeIcon className='btn-edit' icon={faPenToSquare} /></button>
                                        </div>
                                    </div>
                                    <div className='modals'></div>
                                </div>
                            )
                        )
                    )}
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br />
                    <br />
                    <br />
                    <div className={`plus-pessoa-div ${isModalOpen ? 'hidden' : ''}`}>
                        <button className='plus-pessoa' onClick={() => navigate("/pessoa/add")}>Cadastrar Pessoa</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PessoasPage;
