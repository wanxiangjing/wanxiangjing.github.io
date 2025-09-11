import { Mask } from "antd-mobile"
import styles from './index.module.scss'


interface IProps {
    visible: boolean,
    onMaskClick?: () => void
    children?: React.ReactNode
}

const FullMask = (props: IProps) => {
    return (
        <Mask
            visible={props.visible}
            color='rgba(0, 0, 0, 0.7)'
            className={styles.fullMask}
            onMaskClick={props.onMaskClick}
            getContainer={() => document.body}
        >
            {props.children}
        </Mask>
    )
}

export default FullMask;