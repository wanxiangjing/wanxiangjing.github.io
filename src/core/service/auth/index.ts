import { apiRefreshToken, apiUserInfo, apiUserLogin, apiUserRegister } from "@/api/auth";
import store from "@/store";
import { updateLoginStatus, updateUser } from "@/store/slices/user";
import { ILoginParams, ILoginResult, IRegisterParams } from "@/types/auth";
import { isNotEmpty } from "@/utils/utils";

// 前端代码示例
class AuthClient {
    private accessToken: string | null;
    private refreshToken: string | null;
    constructor() {
        this.accessToken = null;
        this.refreshToken = localStorage.getItem('refreshToken');
        if (this.refreshToken) {
            setTimeout(() => {
                this.refreshAccessToken().then(() => {
                    this.getUserInfo().then((res) => {
                        store.dispatch(updateUser(res));
                    });
                });
            }, 0);
        }else{
            window.location.href = '/#/login';
        }
    }

    async getUserInfo() {
        const res = await apiUserInfo();
        return res;
    }

    // 登录
    async login(params: ILoginParams) {
        const res = await apiUserLogin(params);
        return this.afterLogin(res);
    }

    // 注册
    async register(params: IRegisterParams) {
        const res = await apiUserRegister(params);
        return this.afterLogin(res);
    }

    private afterLogin(res: ILoginResult) {
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;
        localStorage.setItem('refreshToken', res.refresh_token);
        store.dispatch(updateUser(res.user));
        store.dispatch(updateLoginStatus({ isLogin: true }));
        return res;
    }

    // 刷新Access Token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }
        const res = await apiRefreshToken(this.refreshToken);
        this.accessToken = res.access_token;
        return res.access_token;
    }

    getAccessToken() {
        return this.accessToken;
    }

    getRefreshToken() {
        return this.refreshToken;
    }

    getIsLogin() {
        return this.refreshToken !== null && isNotEmpty(this.refreshToken);
    }

    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('refreshToken');
    }
}
export const authClient = new AuthClient();