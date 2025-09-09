import logoImg from '@/assets/img/logo.png'
import { authClient } from '@/core/service/auth'
import { Button } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import { useLocation, useNavigate } from 'react-router'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { updateHasPreload } from '@/store/slices/global'

const StartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // 从url参数中获取redirect
    const redirect = useLocation().search.split('redirect=')[1]
    const handleClick = () => {
        dispatch(updateHasPreload(true))
        if (authClient.getIsLogin()) {
            navigate(redirect || '/');
        } else {
            navigate(`/login?redirect=${redirect || '/'}`);
        }
    }

    return (
        <div className={styles.startPageContainer}>
            <div className={styles.mainContent}>
                <img className={styles.logo} src={logoImg} alt="logo" />
                <div className={styles.title}>
                    万象镜
                </div>
                <div className={styles.desc}>
                    AI讲解·随问随答
                </div>
                <div className={styles.desc}>
                    看见故事·不只风景
                </div>
            </div>
            <div className={styles.enterButtonWrap}>
                <Button block shape='rounded' color='primary' onClick={handleClick}>
                    立即体验 <RightOutline className={styles.rightIcon} />
                </Button>
            </div>
            <div className={styles.id11ske}></div>
            <div className={styles.idEkm31}></div>
            <div className={styles.idTgbz2}></div>
        </div>
    )
}


export default StartPage
