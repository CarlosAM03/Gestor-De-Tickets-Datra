import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import type { HttpError } from '@/types/http-error.types';
import {
  ACCESS_TOKEN_KEY,
} from '@/auth/auth.storage';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL no está definida en el entorno');
}

/* =============================
   AXIOS INSTANCE
============================= */
const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =============================
   REQUEST INTERCEPTOR
   Adjunta JWT automáticamente
============================= */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

/* =============================
   RESPONSE INTERCEPTOR
   Error normalizado por dominio
============================= */
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? null;
    const payload = error.response?.data as any;

    const normalizedError: HttpError = {
      status,
      code: 'UNKNOWN_ERROR',
      message: 'Ocurrió un error inesperado',
      raw: payload,
    };

    switch (status) {
      case 401:
        normalizedError.code = 'UNAUTHORIZED';
        normalizedError.message =
          payload?.message ?? 'Sesión inválida o expirada';
        break;

      case 403:
        normalizedError.code = 'FORBIDDEN';
        normalizedError.message =
          payload?.message ?? 'Acción no permitida';
        break;

      case 404:
        normalizedError.code = 'NOT_FOUND';
        normalizedError.message =
          payload?.message ?? 'Recurso no encontrado';
        break;

      case 409:
        normalizedError.code = 'INVALID_STATE';
        normalizedError.message =
          payload?.message ?? 'Estado inválido para esta acción';
        break;

      case 422:
        normalizedError.code = 'VALIDATION_ERROR';
        normalizedError.message =
          payload?.message ?? 'Datos inválidos';
        break;

      case null:
        normalizedError.code = 'NETWORK_ERROR';
        normalizedError.message =
          'No se pudo conectar con el servidor';
        break;

      default:
        normalizedError.code = 'SERVER_ERROR';
        normalizedError.message =
          payload?.message ?? 'Error interno del servidor';
    }

    return Promise.reject(normalizedError);
  },
);

export default http;
