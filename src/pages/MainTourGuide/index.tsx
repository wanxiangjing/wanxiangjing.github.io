import React from "react"
import styles from './index.module.scss'
import Layout from "@/Layout";
import { Outlet } from "react-router";

interface IProps {

}

const MainTourGuide = (props: IProps) => {

    return (
            <div className={styles['main-tour-guide']}>
                <div className={styles['main-tour-guide__title']}>
                    欢迎来到万象镜
                </div>
            </div>
    )
}

export default MainTourGuide;