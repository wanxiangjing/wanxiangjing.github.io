/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch, useSelector } from 'react-redux';
import { memo, useEffect, useRef } from 'react';
import Conversation from './Conversation';
import ToolBar from './ToolBar';
import CameraArea from './CameraArea';
import AudioController from './AudioController';
import { isMobile } from '@/utils/utils';
import style from './index.module.scss';
import AiAvatarCard from '@/components/AiAvatarCard';
import store, { RootState } from '@/store';
import FullScreenCard from '@/components/FullScreenCard';
import { useDeviceState, useJoin } from '@/core/lib/useCommon';
import { RTCConfig, SceneConfig, updateFullScreen, updateRTCConfig, updateScene, updateSceneConfig } from '@/store/slices/room';
import rtcApi from '@/api/rtc';

function Room() {
  const { isShowSubtitle, isFullScreen } = useSelector((state: RootState) => state.room);
  const [joining, dispatchJoin] = useJoin();
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream>(null);

  
    const {
      isAudioPublished,
      isVideoPublished,
    } = useDeviceState();

  const handleJoinRoom = () => {
    dispatch(updateFullScreen({ isFullScreen: false })); // 初始化
    if (!joining) {
      dispatchJoin();
    }
  }

  useEffect(() => {
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
    const initCamera = async () => {
      try {
        // 1. 优先尝试获取理想配置（广角+16:9）
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { exact: 'environment' }, // 强制后置广角
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            aspectRatio: 16 / 9,
            // 新增参数提升广角效果
            advanced: [
              { width: { min: 1280 } }, // 确保足够宽度
              { aspectRatio: { exact: 16 / 9 } }
            ]
          }
        };

        // 2. 尝试获取媒体流（带降级方案）
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
          console.warn('广角模式失败，尝试宽松条件:', error);

          // 降级方案1：保持16:9但不强制广角
          constraints.video = {
            aspectRatio: 16 / 9,
            width: { min: 1280 },
            facingMode: 'environment' // 非强制
          };

          stream = await navigator.mediaDevices.getUserMedia(constraints);
        }

        // 3. 应用流并强制横屏显示
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // 强制横屏显示（即使设备竖屏）
        }

      } catch (error) {
        console.error('摄像头初始化完全失败:', error);
        // 可以在这里添加备用图片或错误提示
      }
    };

    initCamera();
    return () => {
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className={`${style.wrapper} ${isMobile() ? style.mobile : ''}`}>
      {isMobile() ? <div className={style.mobilePlayer} id="mobile-local-player" >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: 'auto',
            objectFit: 'cover',
            display: isVideoPublished ? 'block' : 'none',
          }}
        />
      </div> : null}
      {isFullScreen && !isMobile() ? (
        <FullScreenCard />
      ) : isMobile() && isShowSubtitle ? null : (
        <AiAvatarCard
          showUserTag={!isShowSubtitle}
          showStatus={!isShowSubtitle}
          className={isShowSubtitle ? style.subtitleAiAvatar : ''}
        />
      )}
      {isMobile() ? null : <CameraArea />}
      {isShowSubtitle && <Conversation className={style.conversation} />}
      {
        <>
          <ToolBar className={style.toolBar} />
          <AudioController className={style.controller} />
        </>
      }

      <div className={style.declare}>AI生成内容由大模型生成，不能完全保障真实</div>
    </div>
  );
}

export default Room;
