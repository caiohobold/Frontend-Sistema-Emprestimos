import axios from 'axios';
import api from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL + "Usuarios/";

const sendEmail = async (email) => {
    try {
        const response = await api.post(`${API_URL}forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer processo de envio de email: ', error);
        throw error;
    }
};

export default {
    sendEmail
};