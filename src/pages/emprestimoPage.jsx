import React, { useState, useEffect } from 'react';
import emprestimosService from '../services/emprestimosService';
import { Navigate, useNavigate } from 'react-router-dom';
import WheelShareLogo from '../photos/WheelShareWithoutName.png'
import '../styles/emprestimoPage.css'
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/navBar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const EmprestimosPage = ({ emprestimo }) =>{
    const [emprestimos, setEmprestimos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredEmprestimos, setFilteredEmprestimos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      const results = emprestimos.filter(emp => 
        emp.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) || emp.nomeEquipamento.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEmprestimos(results);
  }, [searchTerm, emprestimos]);


    useEffect(() => {
        const loadEmprestimos = async () => {
            try {
                setLoading(true);
                const data = await emprestimosService.getEmprestimosAtivos(1, 5);
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
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
      };

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
          0: 'carga-normal',
          1: 'carga-obeso',
          2: 'carga-semi-obeso'
        };
        return cargaClasses[carga] || 'carga-desconhecido'; // Retorna uma classe padrão se não for 0, 1 ou 2
      };

      const handleFinalizar = (id) => {
        confirmAlert({
          title: 'Confirmar finalização',
          message: 'Você tem certeza que deseja finalizar este empréstimo?',
          buttons: [
            {
              label: 'Sim',
              onClick: () => finalizarEmprestimo(id)
            },
            {
              label: 'Não'
            }
          ]
        });
      };
      
      const finalizarEmprestimo = (idEmprestimo) => {
        emprestimosService.finalizarEmprestimo(idEmprestimo)
          .then(() => {
            console.log("Empréstimo finalizado com sucesso!");
            // Atualiza a lista de empréstimos, removendo o item finalizado
            setEmprestimos(emprestimos.filter(emp => emp.id !== idEmprestimo));
          })
          .catch(error => {
            console.error("Erro ao finalizar empréstimo:", error);
            alert("Falha ao finalizar empréstimo");
          })
      };

    return(
        <div className='main-content' >
            <div className='img-div'>
                <img src={WheelShareLogo} className='WheelShareLogo'></img>
            </div>
            <div className='container-div'>
                <br></br>
                <h2 className='emprestimo-title'>Empréstimos</h2>
                <input
                    type="text"
                    placeholder="Pesquise um equipamento ou pessoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
                <div className='emprestimos'>
                  {loading ? (
                        <p>Carregando...</p>
                    ) : (
                      filteredEmprestimos.length === 0 ? (
                      <div className='no-emprestimos'>
                        <FontAwesomeIcon icon={faWheelchair} className='icon-chair'/>
                        <div>Nenhum empréstimo encontrado.</div>
                      </div>
                    ) : (
                      filteredEmprestimos.map(emp => 
                        
                        <div key={emp.id} className='box-emprestimo'>
                            <div className='nomepessoa-emprestimo'>{emp.nomePessoa}</div>
                            <div className='nomeequipamento-emprestimo'>{emp.nomeEquipamento}</div>
                            <div className='data-emprestimo'>Início: {formatDate(emp.dataEmprestimo)}</div>
                            <div className='modals'>
                                <div className={getCargaClass(emp.cargaEquipamento)}>{getCargaDescription(emp.cargaEquipamento)}</div>
                                <button onClick={() => handleFinalizar(emp.id)} className='btn-finalizar'>Finalizar</button>
                            </div>
                        </div>
                        
                    )
                  )
                )}
                </div>
                <NavBar />
          </div>
        </div>
    );
}

export default EmprestimosPage;