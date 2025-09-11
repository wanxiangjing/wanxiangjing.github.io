import FullMask from "@/components/FullMask"
import { RootState } from "@/store"
import { Space, SpinLoading } from "antd-mobile"
import { useSelector } from "react-redux"

const LoadingMask = () => {
    const { msgHistory } = useSelector((state: RootState) => state.room)
    return (
        <FullMask visible={msgHistory.length < 1}>
            <Space direction="vertical" justify="center" align="center">
                <SpinLoading color="#fff" style={{ '--size': '36px' }} />
                <span style={{ fontSize: '1rem', color: '#fff' }}>AI 准备中,请稍等...</span>
            </Space>
        </FullMask>
    )
}

export default LoadingMask