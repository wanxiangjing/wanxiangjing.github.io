/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { configureStore } from '@reduxjs/toolkit';
import roomSlice, { RoomState } from './slices/room';
import deviceSlice, { DeviceState } from './slices/device';
import userSlice, { UserState } from './slices/user';
import globalSlice, { GlobalState } from './slices/global';
import roomExtraSlice, { RoomExtraState } from './slices/roomExtra';
import rtcClientSlice, { RtcClientState } from './slices/RtcClient';

export interface RootState {
  room: RoomState;
  device: DeviceState;
  user: UserState;
  global: GlobalState;
  roomExtra: RoomExtraState;
  rtcClient: RtcClientState,
}

const store = configureStore({
  reducer: {
    room: roomSlice,
    device: deviceSlice,
    user: userSlice,
    global: globalSlice,
    roomExtra: roomExtraSlice,
    rtcClient: rtcClientSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
