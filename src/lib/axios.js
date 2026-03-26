import axios from 'axios';

const rawBackendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
const apiURL = rawBackendUrl.endsWith('/api') ? rawBackendUrl : `${rawBackendUrl}/api`;

const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 5000,
  headers: {
    'accept': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
