import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import emprestimosService from '../services/emprestimosService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
import '../styles/pessoaPerfil.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../services/axiosConfig';

const PerfilPessoa = () => {
  const { id } = useParams();
  const [emprestimos, setEmprestimos] = useState([]);
  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    };

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

  const handleFinalizar = (emprestimoId) => {
    confirmAlert({
      title: 'Confirmação',
      message: 'Você tem certeza que deseja finalizar este empréstimo?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              await emprestimosService.finalizarEmprestimo(emprestimoId);
              setEmprestimos(emprestimos.filter(emp => emp.id !== emprestimoId));
            } catch (error) {
              console.error("Erro ao finalizar empréstimo:", error);
            }
          }
        },
        {
          label: 'Não'
        }
      ]
    });
  };

  if (!pessoa) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='main-content' >
            <div className='return-div'>
                <button onClick={() => navigate("/Usuarios/pessoas")} className='return-btn'><FontAwesomeIcon icon={faArrowLeft} /></button>
            </div>
            <div className='container-div'>
                <br></br>
                <div className='pessoa'>
                    <div className='pessoa-icon-div'>
                        <FontAwesomeIcon className='pessoa-icon' icon={faCircleUser}/>
                    </div>
                    <div>
                        <div className='pessoa-name'>{pessoa.nomeCompleto}</div>
                        <div className='pessoa-cpf'>{pessoa.cpf}</div>
                        <div className={getStatusClass(pessoa.statusEmprestimo)}>{getStatusPessoa(pessoa.statusEmprestimo)}</div>
                    </div>
                </div>
                <div className='box-emprestimos'>
                  <h2 className='emprestimos-title'>Empréstimos</h2>
                  {loading ? (
                    <p>Carregando...</p>
                  ) : (
                    emprestimos.length === 0 ? (
                      <div className='no-emprestimos'>
                        <FontAwesomeIcon icon={faWheelchair} className='icon-chair' />
                        <div>Nenhum empréstimo encontrado.</div>
                      </div>
                    ) : (
                      emprestimos.map(emp => (
                        <div key={emp.id} className='sub-box-emprestimos'>
                          <div className='nomeEquipamento'>{emp.nomeEquipamento}</div>
                          <div className='dataEmp'>Início: {formatDate(emp.dataEmprestimo)}</div>
                          <div className='status-and-btn'>
                            <div className={getEmpStatusClass(emp.status)}>{emp.status === 0 ? 'Em andamento' : 'Finalizado'}</div>
                            {emp.status === 0 && (
                              <button onClick={() => handleFinalizar(emp.id)} className='finalizar-btn'>Finalizar</button>
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