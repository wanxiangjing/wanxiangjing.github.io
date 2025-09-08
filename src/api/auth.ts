import { apiClient } from "@/core/service/request";
import { ILoginParams, ILoginResult, IRegisterParams } from "@/types/auth";


// 登录
export const apiUserLogin = (params: ILoginParams) => {
    return apiClient.post<ILoginResult>('/auth/login', params);
}

// 注册
export const apiUserRegister = (params: IRegisterParams) => {
    return apiClient.post<ILoginResult>('/auth/register', params);
}

