import { TabBar } from "antd-mobile"
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from "antd-mobile-icons"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import styles from './index.module.scss'
import roomIcon from '@/assets/img/logo.png'
import { RootState } from "@/store"
import { useSelector } from "react-redux"


const tabs = [
    {
        key: '/',
        title: '首页',
        icon: <AppOutline />,
    },
    {
        key: '/permission',
        title: '开始导游',
        icon: <img src={roomIcon} className={styles.roomIcon} alt="room" />,
    },
    {
        key: '/profile',
        title: '我的',
        icon: <UserOutline />,
    },
]

const Layout = () => {
    const navigate = useNavigate()
    const pathname = useLocation().pathname
    const [activeKey, setActiveKey] = useState(pathname)
    const { hasPreload } = useSelector((state: RootState) => state.global)
    // 从当前页跳转preload后将当前页路径作为参数传递
    const redirect = pathname

    const setRouteActive = (value: string) => {
        navigate(value)
    }

    useEffect(() => {
        setRouteActive(activeKey)
    }, [activeKey])

    useEffect(() => {
        if (!hasPreload) {
            navigate(`/preload?redirect=${redirect || '/'}`)
        }
    }, [hasPreload])

    return (
        <div className={styles.layout}>
            <div className={styles.layoutContent}>
                <Outlet />
            </div>
            <div className={styles.layoutBottomBar} style={{ display: activeKey !== '/room' ? 'auto' : 'none' }}>
                <TabBar activeKey={activeKey} onChange={value => setActiveKey(value)}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
        </div>
    )
}

export default Layout
