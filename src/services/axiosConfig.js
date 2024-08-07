import axios from 'axios';
import authServices from './authServices';

const API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem('userToken');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${token}`
}
});

api.interceptors.request.use(
  (config) => {
    const currentUser = authServices.getCurrentUser();
    const token = currentUser ? currentUser.token : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;