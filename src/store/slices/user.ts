/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '@/types/user';

export interface UserState {
    user: IUser
    token?: string
    isLogin: boolean
}
const initialState: UserState = {
    user: {},
    token: '',
    isLogin: false
};

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, { payload }: { payload: IUser }) => {
            if (payload) {
                state.user = payload;
            }
        },
        updateToken: (state, { payload }) => {
            if (payload.token) {
                state.token = payload.token;
            }
        },
        clearUser: (state) => {
            state.user = {};
            state.token = '';
        }
    },
});
export const { updateUser, updateToken, clearUser } = UserSlice.actions;

export default UserSlice.reducer;
