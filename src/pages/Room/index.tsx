/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import rtcApi from '@/api/rtc';
import RtcClient from '@/core/lib/RtcClient';
import { useDeviceState, useJoin } from '@/core/lib/useCommon';
import store, { RootState } from '@/store';
import { RTCConfig, SceneConfig, updateFullScreen, updateRTCConfig, updateScene, updateSceneConfig } from '@/store/slices/room';
import { isMobile } from '@/utils/utils';
import { VideoRenderMode } from '@volcengine/rtc';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Conversation from './Conversation';
import style from './index.module.scss';
import ToolBar from './components/Toolbar';

function Room() {
  const { isShowSubtitle, isFullScreen, localUser } = useSelector((state: RootState) => state.room);
  const [joining, dispatchJoin] = useJoin();
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { hasPreload, cameraPermission, microphonePermission } = useSelector((state: RootState) => state.global);
  const navigate = useNavigate();
  const {
    isAudioPublished,
    isVideoPublished,
    isScreenPublished,
  } = useDeviceState();

  const handleJoinRoom = () => {
    dispatch(updateFullScreen({ isFullScreen: false })); // 初始化
    if (!joining) {
      dispatchJoin();
    }
  }

  const setVideoPlayer = () => {
    RtcClient.removeVideoPlayer(localUser.username!);
    if (isVideoPublished) {
      RtcClient.setLocalVideoPlayer(
        localUser.username!,
        'local-player',
        isScreenPublished,
        VideoRenderMode.RENDER_MODE_HIDDEN
      );
    }
  };

  useEffect(() => {
    if (!hasPreload) {
      return;
    }
    rtcApi.getGuideScene().then((data) => {
      store.dispatch(updateScene(data.scene.id));
      store.dispatch(updateSceneConfig(
        [data].reduce<Record<string, SceneConfig>>((prev, cur) => {
          prev[cur.scene.id] = cur.scene;
          return prev;
        }, {})
      ));
      store.dispatch(updateRTCConfig(
        [data].reduce<Record<string, RTCConfig>>((prev, cur) => {
          prev[cur.scene.id] = cur.rtc;
          return prev;
        }, {})
      ));
    }).then(() => {
      if (!joining) {
        handleJoinRoom();
      }
    })
  }, [])

  useEffect(() => {
    if (!cameraPermission || !microphonePermission) {
      navigate('/permission');
    }
  }, [])

  useEffect(() => {
    if (!hasPreload) {
      return;
    }
    if (!isVideoPublished) {
      return;
    }
    setVideoPlayer();
  }, [isVideoPublished, isScreenPublished]);

  return (
    <div className={`${style.wrapper} ${isMobile() ? style.mobile : ''}`}>
      <div className={style.mobilePlayer} id="local-player" />
      {isShowSubtitle && <Conversation className={style.conversation} />}
      {
        <>
          <ToolBar className={style.toolBar} />
          {/* <AudioController className={style.controller} /> */}
        </>
      }

      <div className={style.declare}>AI生成内容由大模型生成，不能完全保障真实</div>
    </div>
  );
}

export default Room;
