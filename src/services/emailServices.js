import axios from 'axios';
import api from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL;

const sendEmail = async (email) => {
    try {
        const response = await api.post(`${API_URL}Usuarios/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer processo de envio de email: ', error);
        throw error;
    }
};

const sendEmailAssoc = async (email) => {
    try {
        const response = await api.post(`${API_URL}Associacoes/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer processo de envio de email: ', error);
        throw error;
    }
};

export default {
    sendEmail,
    sendEmailAssoc
};