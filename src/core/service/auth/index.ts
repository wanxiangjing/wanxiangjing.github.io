import { apiUserLogin, apiUserRegister } from "@/api/auth";
import store from "@/store";
import { updateUser } from "@/store/slices/user";
import { ILoginResult, IRegisterParams } from "@/types/auth";

// 前端代码示例
class AuthClient {
    accessToken: string | null;
    refreshToken: string | null;
    constructor() {
        this.accessToken = null;
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    // 登录
    async login(email: string, password: string) {
        const res = await apiUserLogin({ identifier: email, password });
        return this.afterLogin(res);
    }

    // 注册
    async register(params: IRegisterParams) {
        const res = await apiUserRegister(params);
        return this.afterLogin(res);
    }

    private afterLogin(res: ILoginResult) {
        this.accessToken = res.access_token;
        localStorage.setItem('refreshToken', res.refresh_token);
        store.dispatch(updateUser(res.user));
        return res;
    }

    // 刷新Access Token
    async refreshAccessToken() {
        const response = await fetch('/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: this.refreshToken })
        });

        if (!response.ok) {
            // 刷新token也失败，需要重新登录
            this.logout();
            throw new Error('请重新登录');
        }

        return response.json();
    }

    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('refreshToken');
    }
}
export const authClient = new AuthClient();