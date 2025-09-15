import RTCClient from '@/core/lib/RtcClient';
import { RootState } from '@/store';
import { updateCameraPermission, updateMicrophonePermission } from '@/store/slices/global';
import { setRtcClient } from '@/store/slices/RtcClient';
import { Toast } from 'antd-mobile';
import { AudioOutline, CameraOutline, CheckOutline } from 'antd-mobile-icons';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import styles from './index.module.scss';

const PermissionPage = () => {
    const connectorRef = useRef<HTMLDivElement>(null);
    const { cameraPermission, microphonePermission } = useSelector((state: RootState) => state.global);
    const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleRequestPermissions = () => {
        // 这里添加权限请求逻辑
        console.log('请求摄像头和麦克风权限');
        // 实际项目中这里会调用相应的API
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(() => {
                dispatch(updateCameraPermission(true));
                dispatch(updateMicrophonePermission(true));
                setTimeout(() => {
                    navigate('/room');
                }, 1000)
            })
            .catch(() => {
                Toast.show({
                    icon: 'error',
                    content: '权限请求失败,请重试'
                })
                dispatch(updateCameraPermission(false));
                dispatch(updateMicrophonePermission(false));
            });
    };

    useEffect(() => {
        if (!RtcClient) {
            console.log('初始化rtcClient')
            dispatch(setRtcClient(new RTCClient()))
        }
    }, [])


    useEffect(() => {
        if (cameraPermission && microphonePermission) {
            // 动画效果：连接线扩展
            if (connectorRef.current) {
                connectorRef.current!.style.width = '50%';
            }
        }
    }, [cameraPermission, microphonePermission]);

    return (
        <div className={styles.container} id="permission-screen">
            <div className={styles.content}>
                <h2 className={styles.title}>开启智能导览</h2>

                {/* 手机模拟界面 */}
                <div className={styles.phone}>
                    <div className={styles.phoneScreen}>
                        {/* 摄像头权限图标 */}
                        <div className={styles.permissionIconWrapper} id="camera-permission" style={{ backgroundColor: cameraPermission ? '#52c41a' : 'auto' }}>
                            {cameraPermission ? <CheckOutline className={styles.okIcon} /> : <CameraOutline className={styles.icon} />}
                        </div>

                        {/* 麦克风权限图标 */}
                        <div className={styles.permissionIconWrapper} id="mic-permission" style={{ backgroundColor: microphonePermission ? '#52c41a' : 'auto' }}>
                            {microphonePermission ? <CheckOutline className={styles.okIcon} /> : <AudioOutline className={styles.icon} />}
                        </div>

                        {/* 连接线 */}
                        <div
                            ref={connectorRef}
                            className={styles.connector}
                            id="permission-connector"
                        ></div>
                    </div>

                    {/* 手机按钮 */}
                    <div className={styles.phoneButton1}></div>
                    <div className={styles.phoneButton2}></div>
                </div>

                <p className={styles.description}>
                    为了提供AI讲解服务，需要开启麦克风和摄像头权限
                </p>
                <p className={styles.note}>
                    我们高度重视您的隐私，所有数据仅用于为您提供服务
                </p>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.permissionButton}
                    id="request-permissions"
                    onClick={handleRequestPermissions}
                >
                    一键开启权限
                </button>
            </div>

            {/* 背景装饰元素 */}
            <div className={styles.backgroundElement1}></div>
            <div className={styles.backgroundElement2}></div>
        </div>
    );
};

export default PermissionPage;
