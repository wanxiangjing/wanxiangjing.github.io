import { useDeviceState } from "@/core/lib/useCommon";
import styles from './index.module.scss';
import { AudioFill, AudioMutedOutline } from "antd-mobile-icons";
const AudioBtn = () => {
    const { isAudioPublished, switchMic } = useDeviceState();

    return <div
        onClick={() => switchMic(true)}
        className={isAudioPublished ? styles.audioBtnActive : styles.audioBtn}
    >
        {isAudioPublished ? <AudioFill fontSize={36} color={isAudioPublished ? '#fff' : '#eee'} /> : <AudioMutedOutline fontSize={36} color={isAudioPublished ? '#fff' : '#eee'} />}
    </div>
}

export default AudioBtn;