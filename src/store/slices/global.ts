/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import { createSlice } from '@reduxjs/toolkit';

export interface GlobalState {
    hasPreload: boolean,
    cameraPermission: boolean,
    microphonePermission: boolean,
    screenSharePermission: boolean,
}
const initialState: GlobalState = {
    hasPreload: false,
    cameraPermission: false,
    microphonePermission: false,
    screenSharePermission: false,
};

export const GlobalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        updateHasPreload: (state, { payload }) => {
            if (payload) {
                state.hasPreload = payload;
            }
        },
        updateCameraPermission: (state, { payload }) => {
            if (payload) {
                state.cameraPermission = payload;
            }
        },
        updateMicrophonePermission: (state, { payload }) => {
            if (payload) {
                state.microphonePermission = payload;
            }
        },
        updateScreenSharePermission: (state, { payload }) => {
            if (payload) {
                state.screenSharePermission = payload;
            }
        },
    },
});
export const { updateHasPreload, updateCameraPermission, updateMicrophonePermission, updateScreenSharePermission } = GlobalSlice.actions;
export default GlobalSlice.reducer;
