import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

console.log('API URL:', API_URL);

class AuthService{
    loginAssoc(email, senha){
        return axios
        .post(API_URL + 'Associacoes/login', { email, senha })
        .then(response => {
            const token = response.data.token;
            if(response.data.token){
                localStorage.setItem('userToken', token);
            }
            
            return response.data;
        });
    }

    loginMember(email, senha){
        return axios
        .post(API_URL + 'Usuarios/login', { email, senha })
        .then(response => {
            const token = response.data.token;
            if(response.data.token){
                localStorage.setItem('userToken', token);
            }
            return response.data;
        });
    }


    registerAssoc(emailprofissional, cnpj, razaoSocial, nomeFantasia, numero_telefone, endereco, senha){
        return axios
        .post(API_URL + 'Associacoes/register', { emailprofissional, cnpj, razaoSocial, nomeFantasia, numero_telefone, endereco, senha });
    }

    getCurrentUser(){
        const token = localStorage.getItem('userToken');
        if (!token) return null;
        try {
            return token;
        } catch (error) {
            console.error("Erro ao decodificar o token JWT:", error);
            return null;
        }
    }

    getCurrentAsoc(){
        return JSON.parse(localStorage.getItem('assoc'));
    }
}

export default new AuthService();