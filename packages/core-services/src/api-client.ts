import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authStorage } from './auth-storage.service';

/**
 * Lớp ApiClient bọc Axios, hỗ trợ tách biệt nhiều domain/base_url
 * Tự động tiêm Bearer Token từ AuthStorage vào Header
 */
export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, timeout = 15000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Request Interceptor: Tự động gắn Token
    this.instance.interceptors.request.use(
      (config) => {
        const token = authStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Chuẩn hóa dữ liệu trả về
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Lỗi kết nối máy chủ';
        return Promise.reject({
          status: 'error',
          code: error?.response?.data?.code || 'UNKNOWN_ERROR',
          message,
          originalError: error,
        });
      }
    );
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config) as Promise<T>;
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config) as Promise<T>;
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config) as Promise<T>;
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config) as Promise<T>;
  }

  setBaseUrl(newBaseUrl: string): void {
    this.instance.defaults.baseURL = newBaseUrl;
  }
}
