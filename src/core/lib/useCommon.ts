/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import {
  clearCurrentMsg,
  clearHistoryMsg,
  localJoinRoom,
  localLeaveRoom,
  updateAIGCState,
} from '@/store/slices/room';
import VERTC, { MediaType } from '@volcengine/rtc';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import useRtcListeners from '@/core/lib/listenerHooks';
import { RootState } from '@/store';

import {
  setDevicePermissions,
  updateMediaInputs,
  updateSelectedDevice,
} from '@/store/slices/device';
import { updateLocalUser } from '@/store/slices/roomExtra';
import logger from '@/utils/logger';
import { Toast } from 'antd-mobile';
export const ABORT_VISIBILITY_CHANGE = 'abortVisibilityChange';
export interface FormProps {
  username: string;
  roomId: string;
  publishAudio: boolean;
}

export const useScene = () => {
  const { scene, sceneConfigMap } = useSelector((state: RootState) => state.room);
  return sceneConfigMap[scene] || {};
}

export const useRTC = () => {
  const { scene, rtcConfigMap } = useSelector((state: RootState) => state.room);
  return rtcConfigMap[scene] || {};
}

export const useDeviceState = () => {
  const dispatch = useDispatch();
  const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);
  const { isAudioPublished, isVideoPublished, isScreenPublished } = useSelector((state: RootState) => ({
    isAudioPublished: state.roomExtra.localUser.publishAudio,
    isVideoPublished: state.roomExtra.localUser.publishVideo,
    isScreenPublished: state.roomExtra.localUser.publishScreen,
  }), shallowEqual);
  const queryDevices = async (type: MediaType) => {
    const mediaDevices = await RtcClient?.getDevices({
      audio: type === MediaType.AUDIO,
      video: type === MediaType.VIDEO,
    });
    if (type === MediaType.AUDIO) {
      dispatch(
        updateMediaInputs({
          audioInputs: mediaDevices?.audioInputs,
        })
      );
      dispatch(
        updateSelectedDevice({
          selectedMicrophone: mediaDevices?.audioInputs[0]?.deviceId,
        })
      );
    } else {
      dispatch(
        updateMediaInputs({
          videoInputs: mediaDevices?.videoInputs,
        })
      );
      dispatch(
        updateSelectedDevice({
          selectedCamera: mediaDevices?.videoInputs[0]?.deviceId,
        })
      );
    }
    return mediaDevices;
  };

  const switchMic = async (controlPublish = true) => {
    if (controlPublish) {
      await (!isAudioPublished
        ? RtcClient?.publishStream(MediaType.AUDIO)
        : RtcClient?.unpublishStream(MediaType.AUDIO));
    }
    queryDevices(MediaType.AUDIO);
    await (!isAudioPublished ? RtcClient?.startAudioCapture() : RtcClient?.stopAudioCapture());
    dispatch(
      updateLocalUser({
        publishAudio: !isAudioPublished,
      })
    );
  };

  const switchCamera = async (controlPublish = true) => {
    if (controlPublish) {
      await (!isVideoPublished
        ? RtcClient?.publishStream(MediaType.VIDEO)
        : RtcClient?.unpublishStream(MediaType.VIDEO));
    }
    queryDevices(MediaType.VIDEO);
    await (!isVideoPublished ? RtcClient?.startVideoCapture() : RtcClient?.stopVideoCapture());
    dispatch(
      updateLocalUser({
        publishVideo: !isVideoPublished,
      })
    );
  };

  const switchScreenCapture = async (controlPublish = true) => {
    try {
      !isScreenPublished
        ? sessionStorage.setItem(ABORT_VISIBILITY_CHANGE, 'true')
        : sessionStorage.removeItem(ABORT_VISIBILITY_CHANGE);
      if (controlPublish) {
        await (!isScreenPublished
          ? RtcClient?.publishScreenStream(MediaType.VIDEO)
          : RtcClient?.unpublishScreenStream(MediaType.VIDEO));
      }
      await (!isScreenPublished ? RtcClient?.startScreenCapture() : RtcClient?.stopScreenCapture());
      dispatch(
        updateLocalUser({
          publishScreen: !isScreenPublished,
        })
      );
    } catch {
      console.warn('Not Authorized.');
    }
    sessionStorage.removeItem(ABORT_VISIBILITY_CHANGE);
    return false;
  };

  return {
    isAudioPublished,
    isVideoPublished,
    isScreenPublished,
    switchMic,
    switchCamera,
    switchScreenCapture,
  };
};

export const useGetDevicePermission = () => {
  const [permission, setPermission] = useState<{
    audio: boolean;
  }>();


  const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const permission = await RtcClient?.checkPermission();
      if (permission) {
        dispatch(setDevicePermissions(permission));
        setPermission(permission);
      }
    })();
  }, [dispatch]);
  return permission;
};

export const useJoin = (): [
  boolean,
  (params?: { audio?: boolean }) => Promise<void | boolean>
] => {
  // 关闭进入房间自动开麦，开始面试后才会开
  const devicePermissions = useSelector((state: RootState) => state.device.devicePermissions);
  const isAIGCEnable = useSelector((state: RootState) => state.room.isAIGCEnable);

  const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);

  const dispatch = useDispatch();

  const { switchCamera, switchMic } = useDeviceState();
  const [joining, setJoining] = useState(false);
  const listeners = useRtcListeners();

  const handleAIGCModeStart = async () => {
    const welcomeMsg = `您好,欢迎使用万象镜，我是你的AI智能导游！`
    if (isAIGCEnable) {
      await RtcClient?.stopAgent();
      dispatch(clearCurrentMsg());
      await RtcClient?.startAgent({ welcomeMsg });
    } else {
      await RtcClient?.startAgent({ welcomeMsg });
    }
    dispatch(updateAIGCState({ isAIGCEnable: true }));
  };

  async function disPatchJoin(): Promise<boolean | undefined> {
    if (joining) {
      return;
    }

    const isSupported = await VERTC.isSupported();
    if (!isSupported) {
      Toast.show({
        content: '您的浏览器可能不支持 RTC 功能，请尝试更换浏览器或升级浏览器后再重试。',
      });
      return;
    }

    setJoining(true);

    /** 1. Create RTC Engine */
    await RtcClient?.createEngine();

    /** 2.1 Set events callbacks */
    RtcClient?.addEventListeners(listeners);

    /** 2.2 RTC starting to join room */
    await RtcClient?.joinRoom();
    /** 3. Set users' devices info */
    const mediaDevices = await RtcClient?.getDevices({
      audio: true,
      video: true,
    });

    dispatch(
      localJoinRoom({
        roomId: RtcClient?.basicInfo.room_id!,
        user: {
          username: RtcClient?.basicInfo.user_id,
          userId: RtcClient?.basicInfo.user_id,
        },
      })
    );
    dispatch(
      updateSelectedDevice({
        selectedMicrophone: mediaDevices!.audioInputs[0]?.deviceId,
        selectedCamera: mediaDevices!.videoInputs[0]?.deviceId,
      })
    );
    dispatch(updateMediaInputs(mediaDevices));

    setJoining(false);

    if (devicePermissions.video) {
      try {
        await switchCamera();
      } catch (e) {
        logger.debug('No permission for video');
      }
    }
    if (devicePermissions.audio) {
      try {
        await switchMic();
      } catch (e) {
        logger.debug('No permission for audio');
      }
    }

    handleAIGCModeStart();
  }

  return [joining, disPatchJoin];
};

export const useLeave = () => {
  const dispatch = useDispatch();
  const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);

  return async function () {
    await Promise.all([
      RtcClient?.stopAudioCapture,
      RtcClient?.stopScreenCapture,
      RtcClient?.stopVideoCapture,
    ]);
    await RtcClient?.stopAgent();
    await RtcClient?.leaveRoom();
    dispatch(clearHistoryMsg());
    dispatch(clearCurrentMsg());
    dispatch(localLeaveRoom());
    dispatch(updateAIGCState({ isAIGCEnable: false }));
  };
};