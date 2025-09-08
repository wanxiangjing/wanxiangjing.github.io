import { IUser } from "./user";

export interface ILoginResult {
    access_token: string;
    refresh_token: string;
    user: IUser;
}

export interface ILoginParams {
    identifier: string;
    password: string;
}

export interface IRegisterParams {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
