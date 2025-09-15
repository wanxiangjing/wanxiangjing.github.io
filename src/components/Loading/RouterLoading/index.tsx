import { Space, SpinLoading } from "antd-mobile";

const RouterLoading = () => {
    return (
        <Space direction="vertical" align="center" justify="center" style={{ gap: 10 }} >
            <SpinLoading />
            加载中...
        </Space>
    )
}

export default RouterLoading;