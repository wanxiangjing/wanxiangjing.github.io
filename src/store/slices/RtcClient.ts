
import { createSlice } from '@reduxjs/toolkit';
import RTCClient from '@/core/lib/RtcClient';
import { roomSlice } from './room';

export interface RtcClientState {
    RtcClient: RTCClient | null,
    scene: string,
}

const initialState: RtcClientState = {
    RtcClient: null,
    scene: '',
}

const rtcClientSlice = createSlice({
    name: 'rtcClient',
    initialState,
    reducers: {
        setRtcClient: (state, action) => {
            state.RtcClient = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(roomSlice.actions.updateRTCConfig, (state, action) => {
                if (!state.RtcClient) {
                    return;
                }
                state.RtcClient.basicInfo = {
                    app_id: action.payload[state.scene].AppId,
                    room_id: action.payload[state.scene].RoomId,
                    user_id: action.payload[state.scene].UserId,
                    token: action.payload[state.scene].Token,
                };
            })
            .addCase(roomSlice.actions.updateScene, (state, action) => {
                state.scene = action.payload;
            })
    }
});


export const { setRtcClient } = rtcClientSlice.actions;
export default rtcClientSlice.reducer;
