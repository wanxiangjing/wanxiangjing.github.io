import { SafeAny } from "@/types/Safe";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";


interface IGeolocation {
    position: [number, number],
    status: string,
    locationType: string,
    accuracy: number,
    isConverted: boolean,
}
export default function MapContainer() {
    const map = useRef<SafeAny>(null);
    const [geolocation, setGeolocation] = useState<IGeolocation>();

    const onComplete = (result: SafeAny) => {
        console.log(result);

        setGeolocation({
            position: result.position.pos,
            status: 'success',
            locationType: result.location_type,
            accuracy: result.accuracy,
            isConverted: result.isConverted,
        })
    }

    const onError = (result: SafeAny) => {
        console.log(result);
    }

    useEffect(() => {
        (window as SafeAny)._AMapSecurityConfig = {
            securityJsCode: "cc1f1efb3f4479413dbcf662c63d877f",
        };
        AMapLoader.load({
            key: "96e012b47df6a5aedc4163395621d90d", // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        })
            .then((AMap) => {
                console.log(AMap);

                map.current = new AMap.Map("mapContainer", {
                    // 设置地图容器id
                    resizeEnable: true,
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                });

                AMap.plugin('AMap.Geolocation', function () {
                    const geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认：true
                        enableHighAccuracy: true,
                        // 设置定位超时时间，默认：无穷大
                        timeout: 10000,
                        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                        buttonOffset: new AMap.Pixel(10, 20),
                        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        zoomToAccuracy: true,
                        //  定位按钮的排放位置,  RB表示右下
                        buttonPosition: 'RB'
                    })

                    map.current.addControl(geolocation);
                    geolocation.getCurrentPosition((status: SafeAny, result: SafeAny) => {
                        if (status == 'complete') {
                            onComplete(result)
                        } else {
                            onError(result)
                        }
                    })
                })

                AMap.plugin('AMap.CitySearch', function () {
                    const citySearch = new AMap.CitySearch()
                    citySearch.getLocalCity((status: SafeAny, result: SafeAny) => {
                        console.log(status, result);

                        if (status === 'complete' && result.info === 'OK') {
                            // 查询成功，result即为当前所在城市信息
                            console.log(result);
                        }
                    })
                })

            })
            .catch((e) => {
                console.log(e);
            });

        return () => {
            map.current?.destroy();
        };
    }, []);

    return (
        <div id="mpWrap" className={styles.mapContainer}>
            <div
                id="mapContainer"
                className={styles.container}
                style={{ height: "800px" }}
            ></div>
            <div>{
                JSON.stringify(geolocation)
            }</div>
        </div>
    );
}
