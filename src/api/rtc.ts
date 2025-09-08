import { apiClient } from "@/core/service/request";
import { RTCConfig, SceneConfig } from "@/store/slices/room";

export interface GuideSceneResult {
    rtc: RTCConfig;
    scene: SceneConfig;
}

const rtcApi = {
    getGuideScene: async () => apiClient.post<GuideSceneResult>(`/rtc/guide/getScenes`),
    guidStartVoiceChat: async (params: {
        roomId: string;
        userId: string;
        welcomeMsg?: string;
    }) => apiClient.post<GuideSceneResult>(`/rtc/guide/proxy?Action=StartVoiceChat`, params),
    guidStopVoiceChat: async (params: {
        roomId: string;
        userId: string;
    }) => apiClient.post<GuideSceneResult>(`/rtc/guide/proxy?Action=StopVoiceChat`, params),
}

export default rtcApi;