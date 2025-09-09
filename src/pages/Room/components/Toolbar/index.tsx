/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDeviceState, useLeave, useScene } from '@/core/lib/useCommon';
import { isMobile } from '@/utils/utils';
import { memo } from 'react';
import style from './index.module.scss';
import { AudioFill, AudioMutedOutline } from 'antd-mobile-icons';

function ToolBar(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const { isVision, isScreenMode } = useScene();
  const leaveRoom = useLeave();
  const {
    isAudioPublished,
    isVideoPublished,
    isScreenPublished,
    switchMic,
    switchCamera,
    switchScreenCapture,
  } = useDeviceState();

  return (
    <div className={style.roomToolBar} >
      
      <div
        onClick={() => switchMic(true)}
        className={ isAudioPublished ? style.audioBtnActive : style.audioBtn}
      >
      {isAudioPublished ? <AudioFill fontSize={36} color={isAudioPublished ? '#fff' : '#eee'} /> : <AudioMutedOutline  fontSize={36} color={isAudioPublished ? '#fff' : '#eee'} />}
      </div>
      {/* <img
          src={isVideoPublished ? CameraOpenSVG : CameraCloseSVG}
          onClick={() => switchCamera(true)}
          className={style.btn}
          alt="camera"
        /> */}
      {/* {isScreenMode && (
        <img
          src={isScreenPublished ? ScreenOnSVG : ScreenOffSVG}
          onClick={() => switchScreenCapture()}
          className={style.btn}
          alt="screenShare"
        />
      )} */}
      {/* <img src={LeaveRoomSVG} onClick={leaveRoom} className={style.btn} alt="leave" /> */}
    </div>
  );
}
export default memo(ToolBar);
