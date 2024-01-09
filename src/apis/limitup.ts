import { Axios } from "@/utils"; // 导入 api
const API_GATEWAY_KOA2 = import.meta.env.VITE_APP_API_GATEWAY_KOA2;
const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

export default new (class Limitup extends Axios {
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

  get_limitup_diff(date: any) {
    return this.get(`${API_GATEWAY_FLASK}/get_limitup_diff`, {
      params: { date },
    });
  }
})();
