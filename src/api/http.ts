import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL no está definida en el entorno');
}

const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10s estándar empresarial
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de REQUEST
 * Adjunta JWT automáticamente
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Interceptor de RESPONSE
 * Manejo global de errores
 */
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Sesión inválida o expirada
      localStorage.clear();

      // Redirección dura: estado limpio garantizado
      window.location.replace('/login');
    }

    return Promise.reject(error);
  },
);

export default http;
