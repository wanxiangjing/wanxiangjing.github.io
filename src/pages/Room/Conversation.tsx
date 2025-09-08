/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import Loading from '@/components/Loading/HorizonLoading';
import { useScene } from '@/core/lib/useCommon';
import { RootState } from '@/store';
import { isMobile } from '@/utils/utils';
import { SpinLoading, Tag } from 'antd-mobile';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';

const lines: (string | React.ReactNode)[] = [];

function Conversation(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const room = useSelector((state: RootState) => state.room);
  const { msgHistory, isFullScreen } = room;
  const { userId } = useSelector((state: RootState) => state.room.localUser);
  const { isAITalking, isUserTalking } = useSelector((state: RootState) => state.room);
  const { user: storeUser } = useSelector((state: RootState) => state.user);
  const isAIReady = msgHistory.length > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const { botName } = useScene();

  const isUserTextLoading = (owner: string) => {
    return owner === userId && isUserTalking;
  };

  const isAITextLoading = (owner: string) => {
    return owner === botName && isAITalking;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [msgHistory.length]);

  return (
    <div
      ref={containerRef}
      className={`${styles.conversation} ${className} ${isFullScreen ? styles.fullScreen : ''} ${isMobile() ? styles.mobileConversation : ''
        }`}
      {...rest}
    >
      {lines.map((line) => line)}
      {!isAIReady ? (
        <div className={styles.aiReadying}>
          <SpinLoading className={styles['aiReading-spin']} />
          AI 准备中, 请稍侯
        </div>
      ) : (
        ''
      )}
      {msgHistory?.map(({ value, user, isInterrupted }, index) => {
        const isUserMsg = user === userId;
        const isRobotMsg = user === botName;
        if (!isUserMsg && !isRobotMsg) {
          return '';
        }
        return (
          <div
            key={`msg-container-${index}`}
            className={styles.mobileLine}
            style={{ justifyContent: isUserMsg && isMobile() ? 'flex-end' : '' }}
          >
            {!isMobile() && (
              <div className={styles.msgName}>
                <div className={styles.avatar}>
                  {/* <img src={isUserMsg ? storeUser.avatar : client.logo} alt="Avatar" /> */}
                </div>
                {isUserMsg ? `${storeUser.name}（我）` : 'AI 面试官'}
              </div>
            )}
            <div
              className={`${styles.sentence} ${isUserMsg ? styles.user : styles.robot}`}
              key={`msg-${index}`}
            >
              <div className={styles.content}>
                {value}
                <div className={styles['loading-wrapper']}>
                  {isAIReady &&
                    (isUserTextLoading(user) || isAITextLoading(user)) &&
                    index === msgHistory.length - 1 ? (
                    <Loading gap={3} className={styles.loading} dotClassName={styles.dot} />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {!isUserMsg && isInterrupted ? <Tag className={styles.interruptTag}>已打断</Tag> : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Conversation;
