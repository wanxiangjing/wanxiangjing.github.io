// src/services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from './types';
import { authClient } from '../auth';
import { Toast } from 'antd-mobile';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = authClient.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (response.data.code !== 200) {
          return Promise.reject(new Error(response.data.message));
        }
        return response.data.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          // 如果是刷新token失败，跳转到登录页
          console.log(error.config.url);
          if (error.config.url === '/auth/refresh') {
            authClient.logout();
            window.location.href = '/#/login';
            Toast.show({
              icon: '!',
              content: '登录过期，请重新登录',
              duration: 1000,
            });
            return Promise.reject(error);
          }
          // 尝试刷新token
          return authClient.refreshAccessToken().then((newToken) => {
            if (newToken) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return this.client(error.config);
            }
            return Promise.reject(error);
          });
        }
        if (error.response?.status === 400) {
          Toast.show({
            icon: '!',
            content: error.response.data.message,
            duration: 1000,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<ApiResponse<T>>(config);
    return response as unknown as T;
  }

  // GET请求
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  // POST请求
  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  // PUT请求
  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  // DELETE请求
  public async delete<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, params });
  }
}

// 创建API客户端实例
export const apiClient = new ApiClient("https://api.aibanyou.top/api/v1/usr/");
