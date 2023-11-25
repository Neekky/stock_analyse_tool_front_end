import { Axios } from "@/utils"; // 导入 api
import queryString from "query-string";

export default new (class User extends Axios {
    // 获取涨停板数据
    // num为连板数
    getStockKLine(params: { symbol: string, period?: 'daily' | 'weekly' | 'monthly', start_date?: string, adjust?: '' | 'qfq' | 'hfq', end_date?: string }) {
        const stringified = queryString.stringify(params)
        const url = `http://127.0.0.1:8000/get_stock_k_line?${stringified}`
        return this.get(url);
    }
})();