import { Axios } from "@/utils"; // 导入 api
import queryString from "query-string";

const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

interface IGetStockKLineProps {
  symbol: string;
  period?: "daily" | "weekly" | "monthly";
  start_date?: string;
  adjust?: "" | "qfq" | "hfq";
  end_date?: string;
  is_head_end?: "1" | void;
}

interface IGetIndexKLineProps {
    index?: string;
    startDate?: string;
    endDate?: string;
  }

export default new (class StockKline extends Axios {
  // 获取涨停板数据
  getStockKLine(params: IGetStockKLineProps) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/get_stock_k_line?${stringified}`;
    return this.get(url);
  }

  // 获取指数的K线数据
  getIndexKLine(params: IGetIndexKLineProps) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/get_index_k_line?${stringified}`;
    return this.get(url);
  }
})();
