// 实现预加载服务，要求：
// 1. 可以预加载任意资源
// 2. 进入页面之后一次性加载所有资源
// 3. 使用rxjs实现订阅，前台可以拿到加载进度

import { BehaviorSubject, Observable } from 'rxjs';
import rtcApi, { GuideSceneResult } from "@/api/rtc";
import store from "@/store";
import { RTCConfig, SceneConfig, updateRTCConfig, updateScene, updateSceneConfig } from "@/store/slices/room";

// 定义加载状态接口
export interface LoadProgress {
    total: number;
    loaded: number;
    percentage: number;
    status: 'idle' | 'loading' | 'completed' | 'error';
    error?: any;
}

enum ResourceType {
    Image = 'image',
    Script = 'script',
    Style = 'style',
    Font = 'font',
    Media = 'media',
    Other = 'other',
    Api = 'api',
}

interface PreloadItem {
    key: string;
    type: ResourceType;
    link?: string;
    api?: () => Promise<any>;
    callback?: (data: any) => void;
}

// 预加载资源列表
const preloadList: PreloadItem[] = [
    {
        key: 'rtcConfig',
        type: ResourceType.Api,
        api: rtcApi.getGuideScene,
        callback: (data: GuideSceneResult) => {
            store.dispatch(updateScene(data.scene.id));
            store.dispatch(updateSceneConfig(
                [data].reduce<Record<string, SceneConfig>>((prev, cur) => {
                    prev[cur.scene.id] = cur.scene;
                    return prev;
                }, {})
            ));
            store.dispatch(updateRTCConfig(
                [data].reduce<Record<string, RTCConfig>>((prev, cur) => {
                    prev[cur.scene.id] = cur.rtc;
                    return prev;
                }, {})
            ));
        }
    }
    // 可以添加更多预加载项
];

class PreloadService {
    private progressSubject = new BehaviorSubject<LoadProgress>({
        total: preloadList.length,
        loaded: 0,
        percentage: 0,
        status: 'idle'
    });
    private loadProgress$ = this.progressSubject.asObservable();

    // 获取进度 observable，供外部订阅
    getProgressObservable(): Observable<LoadProgress> {
        return this.loadProgress$;
    }

    // 加载所有资源
    async load(): Promise<void> {
        const total = preloadList.length;
        let loaded = 0;

        // 更新初始状态
        this.updateProgress(total, loaded, 'loading');

        try {
            // 创建所有资源加载的 promise
            const loadPromises = preloadList.map(item => this.loadItem(item)
                .then(() => {
                    // 单个资源加载完成，更新进度
                    loaded++;
                    this.updateProgress(total, loaded, 'loading');
                })
            );

            // 等待所有资源加载完成
            await Promise.all(loadPromises);
            this.updateProgress(total, loaded, 'completed');
        } catch (error) {
            console.error('预加载失败:', error);
            this.updateProgress(total, loaded, 'error', error);
            throw error; // 允许调用者捕获错误
        }
    }

    // 加载单个资源
    private async loadItem(item: PreloadItem): Promise<void> {
        return new Promise((resolve, reject) => {
            switch (item.type) {
                case ResourceType.Api:
                    if (item.api) {
                        item.api()
                            .then(data => {
                                item.callback?.(data);
                                resolve();
                            })
                            .catch(error => {
                                console.error(`API资源加载失败: ${item.key}`, error);
                                reject(error);
                            });
                    } else {
                        resolve();
                    }
                    break;

                case ResourceType.Image:
                case ResourceType.Script:
                case ResourceType.Style:
                case ResourceType.Font:
                case ResourceType.Media:
                case ResourceType.Other:
                    if (item.link) {
                        const element = this.createResourceElement(item);
                        element.onload = () => {
                            item.callback?.(element);
                            resolve();
                        };
                        element.onerror = (error) => {
                            console.error(`资源加载失败: ${item.link}`, error);
                            reject(error);
                        };
                        document.head.appendChild(element);
                    } else {
                        resolve();
                    }
                    break;
            }
        });
    }

    // 创建资源元素
    private createResourceElement(item: PreloadItem): HTMLElement {
        if (item.type === ResourceType.Script) {
            const script = document.createElement('script');
            script.src = item.link!;
            return script;
        } else {
            const link = document.createElement('link');
            link.href = item.link!;
            link.rel = item.type === ResourceType.Style ? 'stylesheet' : item.type;
            return link;
        }
    }

    // 更新进度状态
    private updateProgress(total: number, loaded: number, status: LoadProgress['status'], error?: any): void {
        const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
        this.progressSubject.next({
            total,
            loaded,
            percentage,
            status,
            error
        });
    }
}

export default PreloadService;