import { CloseOutline, SetOutline, TextOutline } from 'antd-mobile-icons';
import styles from './index.module.scss';
import { useState } from 'react';
import { List, Mask, Switch } from 'antd-mobile';
import FullMask from '@/components/FullMask';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateDisplaySubtitleByTimer, updateShowSubtitle } from '@/store/slices/room';

const SettingBtn = () => {
    const [settingVisible, setSettingVisible] = useState(false);
    const isShowSubtitle = useSelector((state: RootState) => state.room.isShowSubtitle);
    const dispatch = useDispatch();
    const handleShowSubtitleChange = (value: boolean) => {
        if(value){
            dispatch(updateDisplaySubtitleByTimer(true));
        }
        dispatch(updateShowSubtitle(value));
    }
    return (<>
        <FullMask
            visible={settingVisible}
            onMaskClick={() => setSettingVisible(false)}
        >
            <div className={styles.settingBox}>
                <div className={styles.titleWarp}>
                    <div className={styles.title}>设置</div>
                    <div className={styles.close} onClick={() => setSettingVisible(false)}>
                        <CloseOutline color='#a8a8a8ff' fontSize={'1.5rem'} />
                    </div>
                </div>
                <ul className={styles.settingList}>
                    <li>
                        <div className={styles.icon}>
                            <TextOutline color='var(--adm-color-primary)' fontSize={'1.2rem'} />
                        </div>
                        <div className={styles.itemLabel}>字幕</div>
                        <div className={styles.extra}>
                            <Switch style={{ '--width': '46px', '--height': '24px', '--border-width': '0px' }} checked={isShowSubtitle} onChange={handleShowSubtitleChange} />
                        </div>
                    </li>   
                </ul>
            </div>
        </FullMask>
        <div className={styles.btn} onClick={() => setSettingVisible(true)}>
            <SetOutline color='#fff' fontSize={'2rem'} />
        </div>
    </>
    )
}

export default SettingBtn;