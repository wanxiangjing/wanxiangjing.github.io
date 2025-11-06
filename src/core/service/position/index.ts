import store from "@/store";
import { updateIsLocated, updateMyPosition, updatePoiList } from "@/store/slices/position";
import { IMyPosition, IPOIListResponse } from "@/types/map";
import { SafeAny } from "@/types/Safe";
import AMapLoader from "@amap/amap-jsapi-loader";


// TODO 核心逻辑需要迁移到后端
class PositionService {
    private AMap: any;
    private lngLat: [number, number] = [116.397428, 39.90923]; // 默认经纬度（北京天安门）
    private geolocation: any;
    private addressInfo: IMyPosition | null = null;
    private poiResponse: IPOIListResponse | null = null;

    constructor() {

    }

    // 初始化地图
    async initMap() {
        // Initialization code here
        if (this.AMap) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            (window as SafeAny)._AMapSecurityConfig = {
                securityJsCode: "cc1f1efb3f4479413dbcf662c63d877f",
            };
            AMapLoader.load({
                key: "96e012b47df6a5aedc4163395621d90d", // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: ["AMap.Scale", "AMap.Geolocation", "AMap.Geocoder", "AMap.PlaceSearch"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
            }).then((AMap) => {
                console.log("高德地图API加载成功", AMap);
                this.AMap = AMap;
                this.getGeolocationInstance().then((res) => {
                    console.log("当前位置经纬度：", res);
                    this.reverseGeocode();
                    this.placeSearchNearBy({ pageSize: 10, pageIndex: 1 });
                    resolve();
                }).catch((err) => {
                    console.log("获取定位实例失败", err);
                    store.dispatch(updateIsLocated(false));
                    reject(err);
                });
            });
        });
    }

    public getAMapInstance(): any {
        return this.AMap;
    }

    private processAddressData(regeocode: SafeAny): IMyPosition {
        const addressComponent = regeocode.addressComponent;
        const formattedAddress = regeocode.formattedAddress;
        const poiList = regeocode.pois;

        // 获取详细地址信息
        const province = addressComponent.province;
        const city = addressComponent.city;
        const district = addressComponent.district;
        const street = addressComponent.streetNumber.street;
        const number = addressComponent.streetNumber.number;
        // 构建完整地址
        const fullAddress = `${province}${city}${district}${street}${number}`;
        // 处理附近POI（建筑景点）
        const nearbyBuildings = poiList.filter((poi: SafeAny) =>
            poi.type.includes('风景名胜') || poi.type.includes('商务写字楼')
        );

        return {
            fullAddress,
            formattedAddress,
            addressComponent,
            nearbyBuildings
        };
    }

    createMapContainer(containerId: string, options: SafeAny): any {
        if (!this.AMap) {
            throw new Error("AMap is not loaded yet.");
        }
        return new this.AMap.Map(containerId, options);
    }

    async getGeolocationInstance(): Promise<[number, number]> {
        if (!this.AMap) {
            throw new Error("AMap is not loaded yet.");
        }
        console.log('获取定位实例');

        return new Promise((resolve, reject) => {
            this.geolocation = new this.AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
                // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                buttonOffset: new this.AMap.Pixel(10, 20),
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB'
            })
            console.log('定位实例创建成功', this.geolocation);

            this.geolocation.getCurrentPosition((status: SafeAny, result: SafeAny) => {
                if (status == 'complete') {
                    alert('定位成功')
                    console.log(result.position);
                    // 搜索附近景点
                    const lng = result.position.lng;
                    const lat = result.position.lat;
                    this.lngLat = [lng, lat];
                    resolve([lng, lat]);
                } else {
                    alert('定位失败');
                    reject(new Error('定位失败'));
                }
            });
        });
    }

    getLngLat(): [number, number] {
        return this.lngLat;
    }

    async reverseGeocode(): Promise<IMyPosition> {
        if (!this.AMap) {
            throw new Error("AMap is not loaded yet.");
        }
        return new Promise((resolve) => {
            const geocoder = new this.AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(this.lngLat, (status: SafeAny, result: SafeAny) => {
                if (status === 'complete' && result.regeocode) {
                    var address = result.regeocode.formattedAddress;
                    var poiList = result.regeocode.pois; // 附近POI列表 
                    console.log("详细地址：", result.regeocode);
                    console.log("附近建筑：", poiList);
                    const addressInfo: IMyPosition = this.processAddressData(result.regeocode);
                    this.addressInfo = addressInfo;
                    store.dispatch(updateMyPosition(addressInfo));
                    store.dispatch(updateIsLocated(true));
                    resolve(addressInfo);
                }
            });
        });
    }

    async placeSearchNearBy(pageParams: {
        pageSize: number;
        pageIndex: number;
    }): Promise<IPOIListResponse> {
        if (!this.AMap) {
            throw new Error("AMap is not loaded yet.");
        }
        return new Promise((resolve) => {
            const placeSearch = new this.AMap.PlaceSearch({
                type: '风景名胜', // POI类型，可根据高德POI分类码表修改
                pageSize: pageParams.pageSize || 10, // 单页显示结果数
                pageIndex: pageParams.pageIndex || 1,
                // autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
                extensions: "all"
            });
            placeSearch.searchNearBy('', this.lngLat, 2000, (status: string, result: { info: string, poiList: IPOIListResponse }) => {
                // 回调函数，处理搜索结果
                if (status === 'complete' && result.info === 'OK') {
                    console.log('周边景点搜索成功：', result);
                    resolve(result.poiList);
                    store.dispatch(updatePoiList(result.poiList));
                } else {
                    console.error('周边景点搜索失败：', result);
                    resolve({
                        count: 0,
                        pageIndex: 1,
                        pageSize: 0,
                        pois: []
                    });
                }
            });
        });
    }
}

const positionService = new PositionService();
export default positionService;
