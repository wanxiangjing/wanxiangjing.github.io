import { SafeAny } from "@/types/Safe";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { IMyPosition, POI } from "@/types/map";
import positionService from "@/core/service/position";

interface IGeolocation {
    position: [number, number],
    status: string,
    locationType: string,
    accuracy: number,
    isConverted: boolean,
}
export default function MapContainer() {
    
    useEffect(() => {
        console.log(positionService.getAMapInstance());
    }, []);

    

    return (
        <div id="mpWrap" className={styles.mapContainer}>
            <div
                id="mapContainer"
                className={styles.container}
                style={{ height: "800px" }}
            ></div>
            <div>{
                // JSON.stringify(geolocation)
            }</div>
            <div id="info-panel" className={styles.infoPanel}></div>
            <div id="my-panel"></div>
        </div>
    );
}
