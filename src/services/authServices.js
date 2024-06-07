import axios from 'axios';

const API_URL = 'https://localhost:7000/api/';

class AuthService{
    loginAssoc(email, senha){
        return axios
        .post(API_URL + 'Associacoes/login', { email, senha })
        .then(response => {
            if(response.data.token){
                localStorage.setItem('assocToken', JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    loginMember(email, senha){
        return axios
        .post(API_URL + 'Usuarios/login', { email, senha })
        .then(response => {
            if(response.data.token){
                localStorage.setItem('userToken', JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    registerAssoc(emailprofissional, cnpj, razaoSocial, nomeFantasia, numero_telefone, endereco, senha){
        return axios
        .post(API_URL + 'Associacoes/register', { emailprofissional, cnpj, razaoSocial, nomeFantasia, numero_telefone, endereco, senha });
    }

    getCurrentUser(){
        return JSON.parse(localStorage.getItem('userToken'));
    }

    getCurrentAsoc(){
        return JSON.parse(localStorage.getItem('assoc'));
    }
}

export default new AuthService();