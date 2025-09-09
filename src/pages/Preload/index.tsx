import { useEffect, useRef, useState } from "react";
import AdPage from "./components/AdPage";
import { IAdData, PreloadPageStatus } from "@/types/preload";
import PreloadService, { LoadProgress } from "@/core/service/preload";
import { useNavigate } from "react-router";
import StartPage from "./components/StartPage";
import PermissionPage from "./components/PermissionPage";




const Preload = () => {
    const [pageStatus, setPageStatus] = useState<PreloadPageStatus>(PreloadPageStatus.Init);
    const [adData, setAdData] = useState<IAdData>({} as IAdData);
    const [preloadProcess, setPreloadProcess] = useState<LoadProgress>({} as LoadProgress);
    // 在组件或其他服务中使用
    const preloadService = useRef(new PreloadService());
    const navigate = useNavigate();

    const loadAd = async () => {
        setTimeout(() => {
            setAdData({
                id: '2asdawdqwswqd',
                duration: 5,
                title: '广告标题',
                description: '广告描述',
                image: '广告图片',
                link: '广告链接',
            });
            // setPageStatus(PreloadPageStatus.Ading);
        }, 1000);
    }
    const initPreload = async () => {
        // 订阅进度更新
        preloadService.current.getProgressObservable().subscribe(progress => {
            setPreloadProcess(progress);

            console.log(`加载进度: ${progress.percentage}%`, progress);
            if (progress.status === 'completed') {
                console.log('所有资源加载完成');
                setPageStatus(PreloadPageStatus.End);
                navigate('/');
            } else if (progress.status === 'error') {
                console.error('加载失败:', progress.error);
            }
        });

        // 开始加载
        preloadService.current.load().catch(error => {
            console.error('预加载失败', error);
        });

    }

    return (
        <div>
            {
                pageStatus === PreloadPageStatus.Init && <StartPage />
                // pageStatus === PreloadPageStatus.Init && <PermissionPage />

            }
            {
                pageStatus === PreloadPageStatus.Ading && <AdPage adData={adData} setPageStatus={setPageStatus} />
            }
        </div>
    );
};

export default Preload;