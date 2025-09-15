/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import rtcApi from '@/api/rtc';
import { useDeviceState, useJoin, useLeave } from '@/core/lib/useCommon';
import store, { RootState } from '@/store';
import { RTCConfig, SceneConfig, updateFullScreen, updateRTCConfig, updateScene, updateSceneConfig } from '@/store/slices/room';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Conversation from './components/Conversation';
import LoadingMask from './components/LoadingMask';
import ToolBar from './components/Toolbar';
import style from './index.module.scss';
import useVideoPlayer from '@/utils/hooks/useVideoPlayer';

function Room() {
  const isShowSubtitle = useSelector((state: RootState) => state.room.isShowSubtitle);
  const [joining, dispatchJoin] = useJoin();
  const dispatch = useDispatch();
  const { hasPreload, cameraPermission, microphonePermission } = useSelector((state: RootState) => state.global);
  const navigate = useNavigate();
  const leaveRoom = useLeave()
  const {
    isVideoPublished,
  } = useDeviceState();

  const { setVideoPlayer } = useVideoPlayer();

  const handleJoinRoom = () => {
    dispatch(updateFullScreen({ isFullScreen: false })); // 初始化
    if (!joining) {
      dispatchJoin();
    }
  }

  useEffect(() => {
    if (!hasPreload || !cameraPermission || !microphonePermission) {
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
    return () => {
      console.log('退出讲解')
      leaveRoom();
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
  }, [isVideoPublished]);

  return (
    <div className={style.roomContainer}>
      <LoadingMask />
      <div className={style.mobilePlayer} id="local-player" />
      {isShowSubtitle && <Conversation />}
      <ToolBar />
      <div className={style.declare}>AI生成内容由大模型生成，不能完全保障真实</div>
    </div>
  );
}

export default Room;
