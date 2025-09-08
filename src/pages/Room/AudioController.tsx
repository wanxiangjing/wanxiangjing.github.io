/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useSelector } from 'react-redux';
import AudioLoading from '@/components/Loading/AudioLoading';
import { useDeviceState } from '@/core/lib/useCommon';
import { RootState } from '@/store';
import style from './index.module.scss';

const THRESHOLD_VOLUME = 18;

function AudioController(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const room = useSelector((state: RootState) => state.room);
  const volume = room.localUser.audioPropertiesInfo?.linearVolume || 0;
  const { isAudioPublished } = useDeviceState();
  const { isAITalking } = room;
  const isAIReady = room.msgHistory.length > 0;
  const isLoading = volume >= THRESHOLD_VOLUME && isAudioPublished;

  // const handleInterrupt = () => {
  //   RtcClient.commandAgent({
  //     agentName: botName,
  //     command: COMMAND.INTERRUPT,
  //   });
  //   dispatch(setInterruptMsg());
  // };
  return (
    <div className={`${className}`} {...rest}>
      {isAudioPublished ? (
        isAIReady && isAITalking ? (
          <div className={style.interruptContainer}>
            {/* {isInterruptMode ? <div>语音打断 或 </div> : null}
            <div onClick={handleInterrupt} className={style.interrupt}>
              <div className={style.interruptIcon} />
              <span>点此打断</span>
            </div> */}
          </div>
        ) : isLoading ? null : (
          <div className={style.closed}>请开始说话</div>
        )
      ) : (
        <div className={style.closed}>你已关闭麦克风</div>
      )}
      <AudioLoading loading={isLoading} color={isAudioPublished ? undefined : '#EAEDF1'} />
    </div>
  );
}
export default AudioController;
