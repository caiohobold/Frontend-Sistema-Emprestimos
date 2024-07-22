import axios from 'axios';
import api from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL + "Equipamentos/";

const getEquipamentos = async (pageNumber, pageSize) => {
    try {
        const response = await api.get(API_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
} catch (error) {
    console.error('Erro ao buscar equipamentos: ', error);
    throw error;
}
};

const patchEstadoEquipamento = async (id, idEstadoEquipamento) => {
    try{
    const response = await api.patch(`${API_URL}${id}/estado-equipamento`, { idEstadoEquipamento });
    return response.data;
    }
    catch (error){
        console.error('Erro ao atualizar estado: ', error);
        throw error;
    }
}


const getEquipamentosDisponiveis = async (pageNumber, pageSize) => {
    try {
        const response = await api.get(API_URL + "available", {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
} catch (error) {
    console.error('Erro ao buscar equipamentos: ', error);
    throw error;
}
};

export default {
    getEquipamentos,
    getEquipamentosDisponiveis,
    patchEstadoEquipamento
}