import { Axios } from "@/utils"; // 导入 api
import queryString from "query-string";
const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

export default new (class SelectStockModel extends Axios {
  get_limit_kdj_model_data(params?) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/stock_selection_model/get_limit_kdj_model_data?${stringified}`;
    return this.get(url);
  }

  get_limit_leading_model_data(params?) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/stock_selection_model/get_limit_leading_model_data?${stringified}`;
    return this.get(url);
  }
  
})();
