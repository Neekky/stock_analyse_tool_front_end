import { Axios } from "@/utils"; // 导入 api
import queryString from "query-string";

const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

export default new (class User extends Axios {
    // 获取涨停板数据
    // num为连板数
    getStockKLine(params: { symbol: string, period?: 'daily' | 'weekly' | 'monthly', start_date?: string, adjust?: '' | 'qfq' | 'hfq', end_date?: string }) {
        const stringified = queryString.stringify(params)
        const url = `${API_GATEWAY_FLASK}/get_stock_k_line?${stringified}`
        return this.get(url);
    }
})();
