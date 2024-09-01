import { Axios } from "@/utils"; // 导入 api
const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;


export default new (class StockInfo extends Axios {
  // 获取指数运行数据
  get_status_of_index(index: string) {
    const url = `${API_GATEWAY_FLASK}/get_status_of_index?index=${index}`;
    return this.get(url);
  }

  // 获取股票归母净利润的数据
  get_profit_data(stockCode: string, marketId: string) {
    const url = `${API_GATEWAY_FLASK}/all_info/query_profit?stockCode=${stockCode}&marketId=${marketId}`;
    return this.get(url);
  }

  // wc的通用接口
  get_wencai_data(query: string) {
    const url = `${API_GATEWAY_FLASK}/all_info/querymoney?query=${query}`;
    return this.get(url);
  }
  // 获取涨停板数据
  // num为连板数
  get_stock_fundamentals(name: string) {
    const url = `${API_GATEWAY_FLASK}/all_info/fundamentals?name=${name}`;
    return this.get(url);
  }

  get_hot_plate_data(date?: string) {
    const url = `${API_GATEWAY_FLASK}/all_info/hot_plate_data?date=${date}`;
    return this.get(url);
  }

  get_hot_plate_stock_data(pid) {
    const url = `${API_GATEWAY_FLASK}/all_info/hot_plate_stock_data?pid=${pid}`;
    return this.get(url);
  }

  get_all_stock_data() {
    const url = `${API_GATEWAY_FLASK}/all_info/all_stock_list`;
    return this.get(url);
  }

  get_trade_date() {
    const url = `${API_GATEWAY_FLASK}/all_info/get_trade_date`;
    return this.get(url);
  }
  
})();
