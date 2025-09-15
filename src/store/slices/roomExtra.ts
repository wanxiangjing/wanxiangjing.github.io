// 额外的房间状态，有些属性高频变化，引起高层组件的频繁重新渲染，设立此store单独放置。使用下面的属性注意频繁变化的问题
import { createSlice } from '@reduxjs/toolkit';
import { AudioPropertiesInfo, LocalAudioStats, NetworkQuality, RemoteAudioStats } from '@volcengine/rtc';
import { roomSlice } from './room';

export interface IUser {
    username?: string;
    userId?: string;
    publishAudio?: boolean;
    publishVideo?: boolean;
    publishScreen?: boolean;
    audioStats?: RemoteAudioStats;
    audioPropertiesInfo?: AudioPropertiesInfo;
}

export type LocalUser = Omit<IUser, 'audioStats'> & {
    loginToken?: string;
    audioStats?: LocalAudioStats;
};

export interface RoomExtraState {
    networkQuality: NetworkQuality,
    localUser: LocalUser;
    remoteUsers: IUser[];
}
const initialState: RoomExtraState = {
    networkQuality: NetworkQuality.UNKNOWN,
    remoteUsers: [],
    localUser: {
        publishAudio: false,
        publishVideo: false,
        publishScreen: false,
    },
};

export const roomExtraSlice = createSlice({
    name: 'roomExtra',
    initialState,
    reducers: {
        updateNetworkQuality: (state, { payload }) => {
            state.networkQuality = payload.networkQuality;
        },
        remoteUserJoin: (state, { payload }) => {
            state.remoteUsers.push(payload);
        },
        remoteUserLeave: (state, { payload }) => {
            const findIndex = state.remoteUsers.findIndex((user) => user.userId === payload.userId);
            state.remoteUsers.splice(findIndex, 1);
        },
        updateLocalUser: (state, { payload }: { payload: Partial<LocalUser> }) => {
            state.localUser = {
                ...state.localUser,
                ...(payload || {}),
            };
        },
        updateRemoteUser: (state, { payload }: { payload: IUser | IUser[] }) => {
            if (!Array.isArray(payload)) {
                payload = [payload];
            }

            payload.forEach((user) => {
                const findIndex = state.remoteUsers.findIndex((u) => u.userId === user.userId);
                state.remoteUsers[findIndex] = {
                    ...state.remoteUsers[findIndex],
                    ...user,
                };
            });
        },
    },

    extraReducers: (builder) => {
        builder.addCase(roomSlice.actions.localJoinRoom, (state, action) => {
            state.localUser = {
                ...state.localUser,
                ...action.payload.user,
            };
        });
        builder.addCase(roomSlice.actions.localLeaveRoom, (state) => {
            state.localUser = {
                publishAudio: false,
                publishVideo: false,
                publishScreen: false,
            };
            state.remoteUsers = [];
        });

    },
});

export const { updateNetworkQuality, remoteUserJoin, remoteUserLeave, updateLocalUser, updateRemoteUser } = roomExtraSlice.actions;
export default roomExtraSlice.reducer;
