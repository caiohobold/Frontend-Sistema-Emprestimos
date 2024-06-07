import axios from 'axios';

const API_URL = 'https://localhost:7000/api/Categorias/';

const getCategorias = async (pageNumber, pageSize) => {
    try {
        const response = await axios.get(API_URL, {
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