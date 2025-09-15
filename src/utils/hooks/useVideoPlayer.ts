import { useDeviceState } from "@/core/lib/useCommon";
import { RootState } from "@/store";
import { VideoRenderMode } from "@volcengine/rtc";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const useVideoPlayer = () => {
    const username = useSelector((state: RootState) => state.roomExtra.localUser.username);
    const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);

    const {
        isVideoPublished,
        isScreenPublished,
    } = useDeviceState();

    const setVideoPlayer = useCallback(() => {
        if (!username) {
            return;
        }
        RtcClient?.removeVideoPlayer(username);
        if (isVideoPublished) {
            RtcClient?.setLocalVideoPlayer(
                username,
                'local-player',
                isScreenPublished,
                VideoRenderMode.RENDER_MODE_HIDDEN
            );
        }
    }, [isVideoPublished, isScreenPublished, username]);

    return {
        setVideoPlayer,
    }
};

export default useVideoPlayer;
