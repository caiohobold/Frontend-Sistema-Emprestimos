import axios from 'axios';

const API_URL = 'https://localhost:7000/api/';

const getLocais = async (pageNumber, pageSize) => {
    try {
        const response = await axios.get(`${API_URL}Locais`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar locais: ', error);
        throw error;
    }
};

const getLocalById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}Locais/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar local: ', error);
        throw error;
    }
};

const updateLocalEquipamento = async (idEquipamento, idLocal) => {
    try {
        const response = await axios.patch(`${API_URL}Equipamentos/${idEquipamento}/local`, { idLocal });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar local do equipamento: ', error);
        throw error;
    }
};

export default {
    getLocais,
    getLocalById,
    updateLocalEquipamento
};
