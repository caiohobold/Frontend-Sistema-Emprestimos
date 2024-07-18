import axios from 'axios';
import api from './axiosConfig';

const API_URL = 'https://backend-wheelshare.up.railway.app/api/Categorias/';

const getCategorias = async (pageNumber, pageSize) => {
    try {
        const response = await api.get(API_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar categorias: ', error);
        throw error;
    }
};

export default {
    getCategorias
};