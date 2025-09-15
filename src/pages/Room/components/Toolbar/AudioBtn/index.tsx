import { useDeviceState } from "@/core/lib/useCommon";
import styles from './index.module.scss';
import { AudioFill, AudioMutedOutline } from "antd-mobile-icons";
import { useState } from "react";
import { SpinLoading } from "antd-mobile";
const AudioBtn = () => {
    const [loading, setLoading] = useState(false);
    const { isAudioPublished, switchMic } = useDeviceState();
    const handleCheckAudio = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        await switchMic(true);
        setLoading(false);
    }

    return <div
        onClick={handleCheckAudio}
        className={isAudioPublished ? styles.audioBtnActive : styles.audioBtn}
    >
        {loading ? <SpinLoading color="#fff" /> :
            isAudioPublished ? <AudioFill fontSize={36} color={isAudioPublished ? '#fff' : '#eee'} /> : <AudioMutedOutline fontSize={36} color={isAudioPublished ? '#fff' : '#eee'} />}
    </div>
}

export default AudioBtn;