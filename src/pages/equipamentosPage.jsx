import React, { useState, useEffect } from 'react';
import pessoasService from '../services/pessoasService';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import '../styles/equipamentosPage.css'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faWheelchair, faWalking } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCrutch } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/navBar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import equipamentosService from '../services/equipamentosService';


const EquipamentosPage = () =>{
    const [equipamentos, setEquipamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredEquipamentos, setFilteredEquipamentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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


    const getStatusString = (status) => {
        const statusMap = {
            0: "Em uso",
            1: "Disponível"
        }
        return statusMap[status] || "Disponível";
    }

    const getStatusClass = (status) => {
        const statusMap = {
            0: "em-uso",
            1: "disponivel"
        }
        return statusMap[status] || "disponivel";
    }

    const getEstadoString = (status) => {
        const statusMap = {
            0: "Novo",
            1: "Usado"
        }
        return statusMap[status] || "Usado";
    }

    const getEstadoClass = (status) => {
        const statusMap = {
            0: "novo",
            1: "usado"
        }
        return statusMap[status] || "usado";
    }

    const getCargaDescription = (carga) => {
        const cargaMap = {
            0: 'Normal',
            1: 'Obeso',
            2: 'Semi-obeso'
        };
        return cargaMap[carga] || 'desconhecido'; // Retorna 'desconhecido' se não for 0, 1 ou 2
    };

    const getCargaClass = (carga) => {
        const cargaClasses = {
          0: 'carga-normal-class',
          1: 'carga-obeso-class',
          2: 'carga-semi-obeso-class'
        };
        return cargaClasses[carga] || 'carga-desconhecido'; // Retorna uma classe padrão se não for 0, 1 ou 2
      };

    useEffect(() => {
        const loadEquipamentos = async () => {
            try {
                setLoading(true);
                const data = await equipamentosService.getEquipamentos(1, 500);
                setEquipamentos(data);
                setFilteredEquipamentos(data);
                setLoading(false);
            } catch (error) {
                console.error("Falha ao carregar os equipamentos:", error);
                setLoading(false);
            }
        };

        loadEquipamentos();
    }, []);

    useEffect(() => {
        const results = equipamentos.filter(equip => 
            equip.nomeEquipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equip.idEquipamento.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredEquipamentos(results);
    }, [searchTerm, equipamentos]);

    const navigate = useNavigate();

    return(
        <div className='main-content' >
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/Inicio")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br></br>
                <h2 className='pessoas-title'>Equipamentos</h2>
                <input
                    type="text"
                    placeholder="Pesquise um equipamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
                <div className='equipamentos'>
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                    filteredEquipamentos.length === 0 ? (
                      <div className='no-emprestimos-pessoa'>
                        <FontAwesomeIcon icon={faWheelchair} className='icon-chair'/>
                        <div>Nenhum equipamento encontrado.</div>
                      </div>
                    ) : (
                        filteredEquipamentos.map(equip => 
                        
                        <div key={equip.idEquipamento} className='box-equip'>
                            <div className='icon-equip-div'>
                                <FontAwesomeIcon className='icon-equip' icon={getEquipamentoIcon(equip.nomeCategoriaEquipamento)} />
                            </div>
                            <div className='equip-info'>
                                <div className='row-info'>
                                    <div className='nomeequip'>{equip.nomeEquipamento}</div>
                                    <div className='idequip'>ID: {equip.idEquipamento}</div>
                                </div>
                                <div className='row1-info'>
                                    <div className={getStatusClass(equip.statusEquipamento)}>{getStatusString(equip.statusEquipamento)}</div>
                                    <div className={getEstadoClass(equip.estadoEquipamento)}>{getEstadoString(equip.estadoEquipamento)}</div>
                                </div>
                                <div className='row2-info'>
                                    <div className={getCargaClass(equip.cargaEquipamento)}>{getCargaDescription(equip.cargaEquipamento)}</div>
                                    <button className='btn-equip-div' onClick={() => navigate(`/equipamento/edit/${equip.idEquipamento}`)}>Editar</button>
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
                    <div className='plus-pessoa-div'>
                        <button className='plus-pessoa' onClick={() => navigate("/equipamento/add")}>Cadastrar Equipamento</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquipamentosPage;