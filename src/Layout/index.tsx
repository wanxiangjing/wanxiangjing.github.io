import { TabBar } from "antd-mobile"
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from "antd-mobile-icons"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import styles from './index.module.scss'


const tabs = [
    {
        key: '/',
        title: '首页',
        icon: <AppOutline />,
    },
    {
        key: '/room',
        title: '房间',
        icon: <UnorderedListOutline />,
    },
    {
        key: '/message',
        title: '消息',
        icon: <MessageOutline />,
    },
    {
        key: '/me',
        title: '我的',
        icon: <UserOutline />,
    },
]

const Layout = () => {
    const navigate = useNavigate()
    const pathname = useLocation().pathname
    const [activeKey, setActiveKey] = useState(pathname)

    const setRouteActive = (value: string) => {
        navigate(value)
    }

    useEffect(() => {
        setRouteActive(activeKey)
    }, [activeKey])

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
