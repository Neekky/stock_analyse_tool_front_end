import { Axios } from "@/utils"; // 导入 api

export default new (class EastMoney extends Axios {
  // 东方财富-获取股票板块数据
  getStockPlateData(prefix: string, code: string) {
    const url = `https://datacenter.eastmoney.com/securities/api/data/get?type=RPT_F10_CORETHEME_BOARDTYPE&sty=BOARD_NAME&filter=(SECUCODE=%22${code}.${prefix}%22)&client=PC`;
    return this.get(url);
  }

  // 同花顺-获取每日涨停数据
  getDailyLimitData(date: string, page: number = 1) {
    const timeStr = new Date().getTime();
    const url = `https://data.10jqka.com.cn/dataapi/limit_up/limit_up_pool?page=${page}&limit=200&field=199112,10,9001,330323,330324,330325,9002,330329,133971,133970,1968584,3475914,9003,9004&filter=HS,GEM2STAR&order_field=330324&order_type=0&date=${date}&_=${timeStr}`;
    return this.get(url);
  }

  // 同花顺-获取当日热点板块数据
  getHotPlateData() {
    const url = `https://eq.10jqka.com.cn/open/api/hot_list/v1/hot_plate/concept/data.txt`;
    return this.get(url);
  }

  // 同花顺的股票相关板块数据，包含是否为龙头，各板块当前人气股，market：沪市-17；深市-33；北证-151
  getQKAStockPlateData(code, market) {
    const url = `https://dq.10jqka.com.cn/fuyao/thsweb_quote/fund/v1/get_list_obj?code=${code}&market=${market}`;
    return this.get(url);
  }

})();
