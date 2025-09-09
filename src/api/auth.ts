import { apiClient } from "@/core/service/request";
import { ILoginParams, ILoginResult, IRegisterParams } from "@/types/auth";
import { IUser } from "@/types/user";


// 登录
export const apiUserLogin = (params: ILoginParams) => {
    return apiClient.post<ILoginResult>('/auth/login', params);
}

// 注册
export const apiUserRegister = (params: IRegisterParams) => {
    return apiClient.post<ILoginResult>('/auth/register', params);
}

// 刷新token
export const apiRefreshToken = (refreshToken: string) => {
    return apiClient.post<{ access_token: string }>('/auth/refresh', { refreshToken });
}

// 登出
export const apiUserLogout = () => {
    return apiClient.post('/auth/logout');
}

// 获取用户信息
export const apiUserInfo = () => {
    return apiClient.post<IUser>('/auth/profile');
}