import { Axios } from "@/utils"; // 导入 api
const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

export default new (class SelectStockModel extends Axios {
    get_limit_kdj_model_data() {
    const url = `${API_GATEWAY_FLASK}/stock_selection_model/get_limit_kdj_model_data`;
    return this.get(url);
  }
})();
