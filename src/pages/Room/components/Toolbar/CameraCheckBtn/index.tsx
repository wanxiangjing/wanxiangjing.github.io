import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.scss';
import CamaraCheckSVG from '@/assets/img/camara-check.svg';
import { RootState } from '@/store';
import { MediaType } from '@volcengine/rtc';
import { updateSelectedDevice } from '@/store/slices/device';

const CameraCheckBtn = () => {
    const { videoInputs, selectedCamera } = useSelector((state: RootState) => state.device)
    const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);
    const dispatch = useDispatch()
    const handleCheckCamera = () => {
        const value = videoInputs.find((item) => item.deviceId !== selectedCamera && !item.label.startsWith('OBS'))?.deviceId;
        if (!value) {
            return;
        }
        try {
            RtcClient?.switchDevice(MediaType.VIDEO, value);
            dispatch(
                updateSelectedDevice({
                    selectedCamera: value,
                })
            );
        } catch (error) {
            console.log('切换摄像头失败', error);
            dispatch(
                updateSelectedDevice({
                    selectedCamera: selectedCamera,
                })
            );
        }
    }
    return (
        <div className={styles.btn} onClick={handleCheckCamera}>
            <img src={CamaraCheckSVG} alt="" />
        </div>
    )
}

export default CameraCheckBtn;
