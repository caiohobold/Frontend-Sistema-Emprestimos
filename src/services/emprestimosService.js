import api from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL + 'Emprestimos/';

const getEmprestimosAtivos = async (pageNumber, pageSize) => {
    try {
        const response = await api.get(API_URL + "active", {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
} catch (error) {
    console.error('Erro ao buscar empréstimo ativos: ', error);
    throw error;
}
}

const getAllEmprestimos = async (pageNumber, pageSize) => {
    try{
        const response = await api.get(API_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error){
        console.error("Erro ao buscar empréstimos: ", error);
        throw error;
    }
}

const getEmprestimosByPessoaId = async (idPessoa) => {
    try {
        const response = await api.get(`${API_URL}pessoa/${idPessoa}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar empréstimos: ", error);
        throw error;
    }
}

const finalizarEmprestimo = (idEmprestimo) => {
    return api.post(`${API_URL}${idEmprestimo}/finalizar`);
};


export default {
    getEmprestimosAtivos,
    getEmprestimosByPessoaId,
    finalizarEmprestimo,
    getAllEmprestimos
};