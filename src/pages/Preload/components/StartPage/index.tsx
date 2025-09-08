import { Button } from 'antd-mobile'
import styles from './index.module.scss'
import logoImg from '@/assets/img/logo.png'
import { RightOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

const StartPage = () => {
    const navigate = useNavigate();
    const { isLogin } = useSelector((state: RootState) => state.user);
    const handleClick = () => {
        if (isLogin) {
            navigate('/');
        } else {
            navigate('/login');
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
