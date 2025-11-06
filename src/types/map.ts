// 高德地图逆地理编码返回数据类型定义
export interface IMyPosition {
    fullAddress?: string;
    formattedAddress?: string;
    addressComponent?: {
        citycode: string;
        adcode: string;
        businessAreas: BusinessArea[];
        neighborhoodType: string;
        neighborhood: string;
        building: string;
        buildingType: string;
        street: string;
        streetNumber: string;
        province: string;
        city: string;
        district: string;
        towncode: string;
        township: string;
    };
    nearbyBuildings?: NearbyBuilding[];
}

// 业务区域
export interface BusinessArea {
    name: string;
    id: string;
    location: [number, number]; // [经度, 纬度]
}

// 附近建筑
export interface NearbyBuilding {
    id: string;
    name: string;
    type: string;
    address: string;
    distance: number;
    tel: string;
    location: [number, number]; // [经度, 纬度]
    direction: string;
    businessArea: string;
}

// 可选：响应状态包装接口
// 高德地图API响应状态包装接口
export interface AMapResponse {
    status: string;
    info: string;
    infocode: string;
    regeocode?: IMyPosition;
}


// 坐标点接口
// 高德地图API坐标点接口
export interface Coordinate {
    className: string;
    kT: number;
    KL: number;
    lng: number;
    lat: number;
}

// 照片接口
// 高德地图API照片接口
export interface Photo {
    // 根据实际照片数据结构补充字段
    title?: string;
    url?: string;
}

// POI主接口
// 高德地图API POI主接口
export interface POI {
    adcode: string;
    address: string;
    adname: string;
    citycode: string;
    cityname: string;
    discount: boolean;
    distance: number;
    email: string;
    entr_location: Coordinate;
    exit_location: Coordinate | null;
    groupbuy: boolean;
    id: string;
    index: number;
    indoor_map: boolean;
    location: Coordinate;
    name: string;
    pcode: string;
    photos: Photo[];
    postcode: string;
    rating: string;
    shopinfo: string;
    tel: string;
    ticket_ordering: string;
    type: string;
    website: string;
    _idx: number;
}

// POI列表接口
// 高德地图API POI列表接口
export interface IPOIListResponse {
    count: number;
    pageIndex: number;
    pageSize: number;
    pois: POI[];
}