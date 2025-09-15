/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import rtcApi from '@/api/rtc';
import { COMMAND, INTERRUPT_PRIORITY } from '@/utils/handler';
import { string2tlv } from '@/utils/utils';
import VERTC, {
  AudioProfileType,
  AutoPlayFailedEvent,
  DeviceInfo,
  IRTCEngine,
  LocalAudioPropertiesInfo,
  LocalStreamStats,
  MediaType,
  MirrorType,
  NetworkQuality,
  PlayerEvent,
  RemoteAudioPropertiesInfo,
  RemoteStreamStats,
  RoomProfileType,
  ScreenEncoderConfig,
  StreamIndex,
  StreamRemoveReason,
  VideoRenderMode,
  onUserJoinedEvent,
  onUserLeaveEvent,
} from '@volcengine/rtc';
import { Toast } from 'antd-mobile';

export interface IEventListener {
  handleError: (e: { errorCode: any }) => void;
  handleUserJoin: (e: onUserJoinedEvent) => void;
  handleUserLeave: (e: onUserLeaveEvent) => void;
  handleTrackEnded: (e: { kind: string; isScreen: boolean }) => void;
  handleUserPublishStream: (e: { userId: string; mediaType: MediaType }) => void;
  handleUserUnpublishStream: (e: {
    userId: string;
    mediaType: MediaType;
    reason: StreamRemoveReason;
  }) => void;
  handleRemoteStreamStats: (e: RemoteStreamStats) => void;
  handleLocalStreamStats: (e: LocalStreamStats) => void;
  handleLocalAudioPropertiesReport: (e: LocalAudioPropertiesInfo[]) => void;
  handleRemoteAudioPropertiesReport: (e: RemoteAudioPropertiesInfo[]) => void;
  handleAudioDeviceStateChanged: (e: DeviceInfo) => void;
  handleAutoPlayFail: (e: AutoPlayFailedEvent) => void;
  handlePlayerEvent: (e: PlayerEvent) => void;
  handleRoomBinaryMessageReceived: (e: { userId: string; message: ArrayBuffer }) => void;
  handleNetworkQuality: (
    uplinkNetworkQuality: NetworkQuality,
    downlinkNetworkQuality: NetworkQuality
  ) => void;
  handleVideoDeviceStateChanged: (e: DeviceInfo) => void;
}

export interface BasicBody {
  app_id: string;
  room_id: string;
  user_id: string;
  token?: string;
}

/**
 * @brief RTC Core Client
 * @notes Refer to official website documentation to get more information about the API.
 */
export class RTCClient {
  engine!: IRTCEngine;

  basicInfo!: BasicBody;

  private _audioCaptureDevice?: string;

  private _videoCaptureDevice?: string;

  private mirrorType = MirrorType.MIRROR_TYPE_RENDER;

  audioBotEnabled = false;

  audioBotStartTime = 0;

  createEngine = async () => {
    this.engine = VERTC.createEngine(this.basicInfo.app_id);
    // 开启web浏览器降噪 
    await this.engine.setAudioCaptureConfig({
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
    })
  };

  addEventListeners = ({
    handleError,
    handleUserJoin,
    handleUserLeave,
    handleTrackEnded,
    handleUserPublishStream,
    handleUserUnpublishStream,
    handleRemoteStreamStats,
    handleLocalStreamStats,
    handleLocalAudioPropertiesReport,
    handleRemoteAudioPropertiesReport,
    handleAudioDeviceStateChanged,
    handleAutoPlayFail,
    handlePlayerEvent,
    handleRoomBinaryMessageReceived,
    handleNetworkQuality,
    handleVideoDeviceStateChanged,
  }: IEventListener) => {
    this.engine.on(VERTC.events.onError, handleError);
    this.engine.on(VERTC.events.onUserJoined, handleUserJoin);
    this.engine.on(VERTC.events.onUserLeave, handleUserLeave);
    this.engine.on(VERTC.events.onTrackEnded, handleTrackEnded);
    this.engine.on(VERTC.events.onUserPublishStream, handleUserPublishStream);
    this.engine.on(VERTC.events.onUserUnpublishStream, handleUserUnpublishStream);
    this.engine.on(VERTC.events.onRemoteStreamStats, handleRemoteStreamStats);
    this.engine.on(VERTC.events.onLocalStreamStats, handleLocalStreamStats);
    this.engine.on(VERTC.events.onAudioDeviceStateChanged, handleAudioDeviceStateChanged);
    this.engine.on(VERTC.events.onLocalAudioPropertiesReport, handleLocalAudioPropertiesReport);
    this.engine.on(VERTC.events.onRemoteAudioPropertiesReport, handleRemoteAudioPropertiesReport);
    this.engine.on(VERTC.events.onAutoplayFailed, handleAutoPlayFail);
    this.engine.on(VERTC.events.onPlayerEvent, handlePlayerEvent);
    this.engine.on(VERTC.events.onRoomBinaryMessageReceived, handleRoomBinaryMessageReceived);
    this.engine.on(VERTC.events.onNetworkQuality, handleNetworkQuality);
    this.engine.on(VERTC.events.onVideoDeviceStateChanged, handleVideoDeviceStateChanged);
  };

  joinRoom = () => {
    console.log(' ------ userJoinRoom\n', `roomId: ${this.basicInfo.room_id}\n`, `uid: ${this.basicInfo.user_id}`);
    return this.engine.joinRoom(
      this.basicInfo.token!,
      `${this.basicInfo.room_id!}`,
      {
        userId: this.basicInfo.user_id!,
        extraInfo: JSON.stringify({
          call_scene: 'RTC-AIGC',
          user_name: this.basicInfo.user_id,
          user_id: this.basicInfo.user_id,
        }),
      },
      {
        isAutoPublish: true,
        isAutoSubscribeAudio: true,
        roomProfileType: RoomProfileType.chat,
      }
    );
  };

  leaveRoom = () => {
    this.audioBotEnabled = false;
    if (this.engine) {
      this.engine.leaveRoom && this.engine.leaveRoom().catch();
      VERTC.destroyEngine(this.engine);
    }
    this._audioCaptureDevice = undefined;
  };

  checkPermission(): Promise<{
    video: boolean;
    audio: boolean;
  }> {
    return VERTC.enableDevices({
      video: false,
      audio: true,
    });
  }

  /**
   * @brief get the devices
   * @returns
   */
  async getDevices(props?: { video?: boolean; audio?: boolean }): Promise<{
    audioInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
    videoInputs: MediaDeviceInfo[];
  }> {
    const { video = false, audio = true } = props || {};
    let audioInputs: MediaDeviceInfo[] = [];
    let audioOutputs: MediaDeviceInfo[] = [];
    let videoInputs: MediaDeviceInfo[] = [];
    const { video: hasVideoPermission, audio: hasAudioPermission } = await VERTC.enableDevices({
      video,
      audio,
    });
    if (audio) {
      const inputs = await VERTC.enumerateAudioCaptureDevices();
      const outputs = await VERTC.enumerateAudioPlaybackDevices();
      audioInputs = inputs.filter((i) => i.deviceId && i.kind === 'audioinput');
      audioOutputs = outputs.filter((i) => i.deviceId && i.kind === 'audiooutput');
      this._audioCaptureDevice = audioInputs.filter((i) => i.deviceId)?.[0]?.deviceId;
      if (hasAudioPermission) {
        if (!audioInputs?.length) {
          Toast.show({
            content: '无麦克风设备, 请先确认设备情况。',
            icon: 'fail'
          });
        }
        if (!audioOutputs?.length) {
          Toast.show({
            content: '无扬声器设备, 请先确认设备情况。',
            icon: 'fail'
          });
        }
      } else {
        Toast.show({
          content: '暂无麦克风设备权限, 请先确认设备权限授予情况。',
          icon: 'fail'
        });
      }
    }
    if (video) {
      videoInputs = await VERTC.enumerateVideoCaptureDevices();
      videoInputs = videoInputs.filter((i) => i.deviceId && i.kind === 'videoinput');
      this._videoCaptureDevice = videoInputs?.[0]?.deviceId;
      if (hasVideoPermission) {
        if (!videoInputs?.length) {
          Toast.show({
            content: '无摄像头设备, 请先确认设备情况。',
            icon: 'fail'
          });
        }
      } else {
        Toast.show({
          content: '暂无摄像头设备权限, 请先确认设备权限授予情况。',
          icon: 'fail'
        });
      }
    }

    return {
      audioInputs,
      audioOutputs,
      videoInputs,
    };
  }

  startVideoCapture = async (camera?: string) => {
    await this.engine.startVideoCapture(camera || this._videoCaptureDevice);
  };

  stopVideoCapture = async () => {
    this.engine.setLocalVideoMirrorType(MirrorType.MIRROR_TYPE_RENDER);
    await this.engine.stopVideoCapture();
  };

  startScreenCapture = async (enableAudio = false) => {
    await this.engine.startScreenCapture({
      enableAudio,
    });
  };

  stopScreenCapture = async () => {
    await this.engine.stopScreenCapture();
  };

  startAudioCapture = async (mic?: string) => {
    await this.engine.startAudioCapture(mic || this._audioCaptureDevice);
  };

  stopAudioCapture = async () => {
    await this.engine.stopAudioCapture();
  };

  publishStream = (mediaType: MediaType) => {
    this.engine.publishStream(mediaType);
  };

  unpublishStream = (mediaType: MediaType) => {
    this.engine.unpublishStream(mediaType);
  };

  publishScreenStream = async (mediaType: MediaType) => {
    await this.engine.publishScreen(mediaType);
  };

  unpublishScreenStream = async (mediaType: MediaType) => {
    await this.engine.unpublishScreen(mediaType);
  };

  setScreenEncoderConfig = async (description: ScreenEncoderConfig) => {
    await this.engine.setScreenEncoderConfig(description);
  };

  /**
   * @brief 设置业务标识参数
   * @param businessId
   */
  setBusinessId = (businessId: string) => {
    this.engine.setBusinessId(businessId);
  };

  setAudioVolume = (volume: number) => {
    this.engine.setCaptureVolume(StreamIndex.STREAM_INDEX_MAIN, volume);
    this.engine.setCaptureVolume(StreamIndex.STREAM_INDEX_SCREEN, volume);
  };

  /**
   * @brief 设置音质档位
   */
  setAudioProfile = (profile: AudioProfileType) => {
    this.engine.setAudioProfile(profile);
  };

  /**
   * @brief 切换设备
   */
  switchDevice = (deviceType: MediaType, deviceId: string) => {
    if (deviceType === MediaType.AUDIO) {
      this._audioCaptureDevice = deviceId;
      this.engine.setAudioCaptureDevice(deviceId);
    }
    if (deviceType === MediaType.VIDEO) {
      this._videoCaptureDevice = deviceId;
      this.engine.setVideoCaptureDevice(deviceId).then(() => {
        this.checkMirrorType();
      });
    }
    if (deviceType === MediaType.AUDIO_AND_VIDEO) {
      this._audioCaptureDevice = deviceId;
      this._videoCaptureDevice = deviceId;
      this.engine.setVideoCaptureDevice(deviceId);
      this.engine.setAudioCaptureDevice(deviceId);
    }
  };

  setLocalVideoMirrorType = (type: MirrorType) => {
    return this.engine.setLocalVideoMirrorType(type);
  };
  private checkMirrorType = () => {
    // 同时切换镜像,获取当前镜像
    if (this.mirrorType === MirrorType.MIRROR_TYPE_RENDER) {
      this.setLocalVideoMirrorType(MirrorType.MIRROR_TYPE_NONE);
      this.mirrorType = MirrorType.MIRROR_TYPE_NONE;
    } else {
      this.setLocalVideoMirrorType(MirrorType.MIRROR_TYPE_RENDER);
      this.mirrorType = MirrorType.MIRROR_TYPE_RENDER;
    }
  }

  setLocalVideoPlayer = (
    userId: string,
    renderDom?: string | HTMLElement,
    isScreenShare = false,
    renderMode = VideoRenderMode.RENDER_MODE_FILL
  ) => {
    return this.engine.setLocalVideoPlayer(
      isScreenShare ? StreamIndex.STREAM_INDEX_SCREEN : StreamIndex.STREAM_INDEX_MAIN,
      {
        renderDom,
        userId,
        renderMode,
      }
    );
  };

  /**
   * @brief 移除播放器
   */
  removeVideoPlayer = (userId: string, scope: StreamIndex | 'Both' = 'Both') => {
    let removeScreen = scope === StreamIndex.STREAM_INDEX_SCREEN;
    let removeCamera = scope === StreamIndex.STREAM_INDEX_MAIN;
    if (scope === 'Both') {
      removeCamera = true;
      removeScreen = true;
    }
    if (removeScreen) {
      this.engine.setLocalVideoPlayer(StreamIndex.STREAM_INDEX_SCREEN, { userId });
    }
    if (removeCamera) {
      this.engine.setLocalVideoPlayer(StreamIndex.STREAM_INDEX_MAIN, { userId });
    }
  };

  /**
   * @brief 启用 AIGC
   */
  startAgent = async (params?: { welcomeMsg?: string }) => {
    if (this.audioBotEnabled) {
      await this.stopAgent();
    }
    await rtcApi.guidStartVoiceChat({
      welcomeMsg: params?.welcomeMsg,
      roomId: this.basicInfo.room_id,
      userId: this.basicInfo.user_id,
    });
    this.audioBotEnabled = true;
    this.audioBotStartTime = Date.now();
  };

  /**
   * @brief 关闭 AIGC
   */
  stopAgent = async () => {
    // await Apis.VoiceChat.StopVoiceChat({
    //   roomId: this.basicInfo.room_id,
    //   userId: this.basicInfo.user_id,
    // });
    this.audioBotStartTime = 0;
    sessionStorage.removeItem('audioBotEnabled');
    this.audioBotEnabled = false;
  };

  /**
   * @brief 命令 AIGC
   */
  commandAgent = ({
    command,
    agentName,
    interruptMode = INTERRUPT_PRIORITY.NONE,
    message = '',
  }: {
    command: COMMAND;
    agentName: string;
    interruptMode?: INTERRUPT_PRIORITY;
    message?: string;
  }) => {
    if (this.audioBotEnabled) {
      this.engine.sendUserBinaryMessage(
        agentName,
        string2tlv(
          JSON.stringify({
            Command: command,
            InterruptMode: interruptMode,
            Message: message,
          }),
          'ctrl'
        )
      ).then((res) => {
        console.log(res);
      });
      return;
    }
    console.warn('Interrupt failed, bot not enabled.');
  };

  /**
   * @brief 更新 AIGC 配置
   */
  updateAgent = async (scene: string) => {
    if (this.audioBotEnabled) {
      await this.stopAgent();
      await this.startAgent();
    } else {
      await this.startAgent();
    }
  };

  /**
   * @brief 获取当前 AI 是否启用
   */
  getAgentEnabled = () => {
    return this.audioBotEnabled;
  };
}

export default RTCClient