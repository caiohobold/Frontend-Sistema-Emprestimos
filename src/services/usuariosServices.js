import axios from 'axios';
import api from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL + 'Usuarios/';

const getUsuarios = async (pageNumber, pageSize) => {
    try {
        const response = await api.get(API_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários: ', error);
        throw error;
    }
};

export default {
    getUsuarios
};