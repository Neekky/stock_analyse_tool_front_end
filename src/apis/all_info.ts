import { Axios } from "@/utils"; // 导入 api
const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

export default new (class StockInfo extends Axios {
    // 获取涨停板数据
    // num为连板数
    get_stock_fundamentals(name: string) {
        const url = `${API_GATEWAY_FLASK}/all_info/fundamentals?name=${name}`
        return this.get(url);
    }

    get_hot_plate_data(date?: string) {
        const url = `${API_GATEWAY_FLASK}/all_info/hot_plate_data?date=${date}`
        return this.get(url);
    }

    get_hot_plate_stock_data(pid) {
        const url = `${API_GATEWAY_FLASK}/all_info/hot_plate_stock_data?pid=${pid}`
        return this.get(url);
    }

    get_all_stock_data() {
        const url = `${API_GATEWAY_FLASK}/all_info/all_stock_list`
        return this.get(url);
    }
})();