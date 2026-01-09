import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL no está definida en el entorno');
}

const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * =============================
 * REQUEST INTERCEPTOR
 * Adjunta JWT automáticamente
 * =============================
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.set(
        'Authorization',
        `Bearer ${token}`,
      );
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * =============================
 * RESPONSE INTERCEPTOR
 * Manejo global de errores
 * =============================
 */
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';

    const isAuthLogin = requestUrl.includes('/auth/login');

    if (status === 401 && !isAuthLogin) {
      // Sesión inválida o expirada
      localStorage.clear();

      // Redirección dura para limpiar estado
      window.location.replace('/login');
    }

    // propagacion de error
    return Promise.reject(error);
  },
);

export default http;