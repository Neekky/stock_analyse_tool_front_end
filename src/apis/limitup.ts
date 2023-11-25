import { Axios } from "@/utils"; // 导入 api

export default new (class User extends Axios {
    // 获取涨停板数据
    // num为连板数
    getLimitUpData(params: any) {
        return this.get(`/limitup`, { params });
    }

    getLimitUpDataByNum(params: any) {
        return this.get(`/limitup/by-num`, { params });
    }

    // 获取涨停板排名数据
    getLimitupRank() {
        const url = `http://127.0.0.1:8000/get_limitup_rank`
        return this.get(url);
    }
})();