import { Axios } from "@/utils"; // 导入 api

export default new (class User extends Axios {
    // 获取涨停板数据
    // num为连板数
    getLimitUpData(params: any) {
        return this.get(`/service-koa2/limitup`, { params });
    }

    getLimitUpDataByNum(params: any) {
        return this.get(`/service-koa2/limitup/by-num`, { params });
    }

    getWinnersListData(params: any) {
        return this.get(`/service-koa2/limitup/winners-list`, { params });
    }
})();
