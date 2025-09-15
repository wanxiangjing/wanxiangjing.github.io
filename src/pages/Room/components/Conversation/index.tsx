/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import logo from '@/assets/img/logo.png';
import defaultAvatar from '@/assets/img/userAvatar.png';
import DotsLoader from '@/components/Loading/HorizonLoading';
import { RootState } from '@/store';
import { updateDisplaySubtitleByTimer } from '@/store/slices/room';
import { Tag } from 'antd-mobile';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.scss';


function Conversation() {
  const { isAITalking, isUserTalking, msgHistory, isDisplay } = useSelector((state: RootState) => (
    {
      isDisplay: state.room.isDisplaySubtitleByTimer,
      msgHistory: state.room.msgHistory,
      isAITalking: state.room.isAITalking,
      isUserTalking: state.room.isUserTalking,
    }
  ));
  const { user: storeUser } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayTimer = useRef<NodeJS.Timeout | null>(null)
  const dispatch = useDispatch();
  const lastAIMsg = msgHistory.findLast((msg) => msg.user.startsWith('Chat'));
  const lastUserMsg = msgHistory.findLast((msg) => !!!msg.user.startsWith('Chat'));

  const handleDisplay = () => {
    dispatch(updateDisplaySubtitleByTimer(true))
    if (displayTimer.current) {
      clearTimeout(displayTimer.current)
    }
    displayTimer.current = setTimeout(() => {
      dispatch(updateDisplaySubtitleByTimer(false))
    }, 5000)
  }
  const isUserTextLoading = (owner: string) => {
    return !owner.startsWith('ChatBot') && isUserTalking;
  };

  const isAITextLoading = (owner: string) => {
    return owner.startsWith('ChatBot') && isAITalking;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [msgHistory.length]);

  useEffect(() => {
    handleDisplay()
  }, [lastAIMsg?.value, lastUserMsg?.value])

  return (
    <div
      ref={containerRef}
      className={`${styles.conversation} ${isDisplay ? styles['fade-in'] : styles['fade-out']} `}
      onScroll={handleDisplay}
    >
      {msgHistory?.map(({ value, user, isInterrupted }, index) => {
        const isUserMsg = !user.startsWith('ChatBot');
        const isRobotMsg = user.startsWith('ChatBot');
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
              {isRobotMsg &&
                <div className={styles.avatarWrap}>
                  <img src={logo} className={styles.avatar} alt="" />
                  {
                    (isUserTextLoading(user) || isAITextLoading(user)) &&
                    index === msgHistory.length - 1 && (
                      <DotsLoader />
                    )}
                </div>}
              <div className={styles.msg}>{value}</div>
              {isUserMsg &&
                <div className={styles.avatarWrap}>
                  <img src={storeUser.avatar || defaultAvatar} className={styles.avatar} alt="" />
                  {index === msgHistory.length - 1 && (
                    <DotsLoader />
                  )}
                </div>
              }
              {!isUserMsg && isInterrupted ? <Tag className={styles.interruptTag}>已打断</Tag> : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Conversation;
