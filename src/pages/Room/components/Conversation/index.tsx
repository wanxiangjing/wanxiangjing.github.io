/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import logo from '@/assets/img/logo.png';
import defaultAvatar from '@/assets/img/userAvatar.png';
import Loading from '@/components/Loading/HorizonLoading';
import { useScene } from '@/core/lib/useCommon';
import { RootState } from '@/store';
import { Tag } from 'antd-mobile';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';


function Conversation() {
  const room = useSelector((state: RootState) => state.room);
  const { msgHistory, isFullScreen } = room;
  const { userId } = useSelector((state: RootState) => state.room.localUser);
  const { isAITalking, isUserTalking } = useSelector((state: RootState) => state.room);
  const [isDisplay, setIsDisplay] = useState(false)
  const { user: storeUser } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayTimer = useRef<NodeJS.Timeout | null>(null)
  const { botName } = useScene();
  const lastAIMsg = msgHistory.findLast((msg) => msg.user.startsWith('Chat'));
  const lastUserMsg = msgHistory.findLast((msg) => !!!msg.user.startsWith('Chat'));

  const handleDisplay = () => {
    setIsDisplay(true)
    if (displayTimer.current) {
      clearTimeout(displayTimer.current)
    }
    displayTimer.current = setTimeout(() => {
      setIsDisplay(false)
    }, 5000)
  }

  const lastAIMsgValue = useMemo(() => {
    handleDisplay()
    return lastAIMsg?.value
  }, [lastAIMsg?.value])
  const lastUserMsgValue = useMemo(() => {
    handleDisplay()
    return lastUserMsg?.value
  }, [lastUserMsg?.value])

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
      className={`${styles.conversation} ${isDisplay ? styles['fade-in'] : styles['fade-out']}`}
    >
      {msgHistory?.map(({ value, user, isInterrupted }, index) => {
        const isUserMsg = user === userId;
        const isRobotMsg = user === botName;
        if (!isUserMsg && !isRobotMsg) {
          return '';
        }
        return (
          <div
            key={`msg-container-${index}`}
            className={` ${isUserMsg ? styles.userMsgContainer : styles.aiMsgContainer}`}
          >
            <div
              className={`${isUserMsg ? styles.userMsg : styles.aiMsg}`}
              key={`msg-${index}`}
            >

              {isRobotMsg && <img src={logo} className={styles.avatar} alt="" />}
              <div className={styles.msg}>
                {value}
                <div className={styles['loading-wrapper']}>
                  {
                    (isUserTextLoading(user) || isAITextLoading(user)) &&
                      index === msgHistory.length - 1 ? (
                      <Loading gap={3} className={styles.loading} dotClassName={styles.dot} />
                    ) : (
                      ''
                    )}
                </div>
              </div>
              {isUserMsg && <img src={storeUser.avatar || defaultAvatar} className={styles.avatar} alt="" />}
              {!isUserMsg && isInterrupted ? <Tag className={styles.interruptTag}>已打断</Tag> : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Conversation;
