/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import { IMyPosition, IPOIListResponse } from '@/types/map';
import { createSlice } from '@reduxjs/toolkit';


export interface PositionState {
    // 周围景点列表
    poiList?: IPOIListResponse
    // 当前位置
    myPosition?: IMyPosition
    // 是否定位成功
    isLocated: boolean,
}
const initialState: PositionState = {
    poiList: undefined,
    myPosition: undefined,
    isLocated: false,
};

export const PositionSlice = createSlice({
    name: 'position',
    initialState,
    reducers: {
        updateMyPosition: (state, { payload }: { payload: IMyPosition }) => {
            if (payload) {
                state.myPosition = payload;
            }
        },
        updatePoiList: (state, { payload }: { payload: IPOIListResponse }) => {
            if (payload) {
                state.poiList = payload;
            }
        },
        updateIsLocated: (state, { payload }: { payload: boolean }) => {
            state.isLocated = !!payload;
        },
    },
});
export const { updateMyPosition, updatePoiList, updateIsLocated } = PositionSlice.actions;

export default PositionSlice.reducer;
