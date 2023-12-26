import { Axios } from "@/utils"; // 导入 api
const API_GATEWAY_KOA2 = import.meta.env.VITE_APP_API_GATEWAY_KOA2;

export default new (class User extends Axios {
    // 获取涨停板数据
    // num为连板数
    getLimitUpData(params: any) {
        return this.get(`${API_GATEWAY_KOA2}/limitup`, { params });
    }

    getLimitUpDataByNum(params: any) {
        return this.get(`${API_GATEWAY_KOA2}/limitup/by-num`, { params });
    }

    getWinnersListData(params: any) {
        return this.get(`${API_GATEWAY_KOA2}/limitup/winners-list`, { params });
    }

    getEarlyLimitData(params: any) {
        return this.get(`${API_GATEWAY_KOA2}/limitup/early-limit-list`, { params });
    }
})();
