import { Axios } from "@/utils"; // 导入 api
import dayjs from "dayjs";

// 东方财富大事提醒事件列表
export const events = [
  {
    EVENT_TYPE: "报表披露",
    EVENT_TYPE_CODE: "001",
    BELONG_CLASSIF: "业绩披露",
    BELONG_CLASSIF_CODE: "02",
  },
  {
    EVENT_TYPE: "大宗交易",
    EVENT_TYPE_CODE: "300",
    BELONG_CLASSIF: "交易行为",
    BELONG_CLASSIF_CODE: "05",
  },
  {
    EVENT_TYPE: "董事长变更",
    EVENT_TYPE_CODE: "380",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "对外担保",
    EVENT_TYPE_CODE: "250",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "法定代表人变更",
    EVENT_TYPE_CODE: "370",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "非标审计意见",
    EVENT_TYPE_CODE: "330",
    BELONG_CLASSIF: "风险提示",
    BELONG_CLASSIF_CODE: "07",
  },
  {
    EVENT_TYPE: "分红送转",
    EVENT_TYPE_CODE: "004",
    BELONG_CLASSIF: "分红融资",
    BELONG_CLASSIF_CODE: "03",
  },
  {
    EVENT_TYPE: "风险警示",
    EVENT_TYPE_CODE: "430",
    BELONG_CLASSIF: "风险提示",
    BELONG_CLASSIF_CODE: "07",
  },
  {
    EVENT_TYPE: "风险提示",
    EVENT_TYPE_CODE: "350",
    BELONG_CLASSIF: "风险提示",
    BELONG_CLASSIF_CODE: "07",
  },
  {
    EVENT_TYPE: "高管及关联方增减持",
    EVENT_TYPE_CODE: "100",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "股东大会",
    EVENT_TYPE_CODE: "005",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "股东户数",
    EVENT_TYPE_CODE: "280",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "股东增减持",
    EVENT_TYPE_CODE: "090",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "股票回购",
    EVENT_TYPE_CODE: "110",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "股权激励",
    EVENT_TYPE_CODE: "150",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "股权质押",
    EVENT_TYPE_CODE: "160",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "沪深港通",
    EVENT_TYPE_CODE: "070",
    BELONG_CLASSIF: "交易行为",
    BELONG_CLASSIF_CODE: "05",
  },
  {
    EVENT_TYPE: "机构调研",
    EVENT_TYPE_CODE: "130",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "监管问询",
    EVENT_TYPE_CODE: "340",
    BELONG_CLASSIF: "风险提示",
    BELONG_CLASSIF_CODE: "07",
  },
  {
    EVENT_TYPE: "解除质押",
    EVENT_TYPE_CODE: "170",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "可转债",
    EVENT_TYPE_CODE: "210",
    BELONG_CLASSIF: "分红融资",
    BELONG_CLASSIF_CODE: "03",
  },
  {
    EVENT_TYPE: "龙虎榜",
    EVENT_TYPE_CODE: "006",
    BELONG_CLASSIF: "交易行为",
    BELONG_CLASSIF_CODE: "05",
  },
  {
    EVENT_TYPE: "名称变动",
    EVENT_TYPE_CODE: "240",
    BELONG_CLASSIF: "交易提示",
    BELONG_CLASSIF_CODE: "04",
  },
  {
    EVENT_TYPE: "配股",
    EVENT_TYPE_CODE: "190",
    BELONG_CLASSIF: "分红融资",
    BELONG_CLASSIF_CODE: "03",
  },
  {
    EVENT_TYPE: "破产重整",
    EVENT_TYPE_CODE: "360",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "融资融券",
    EVENT_TYPE_CODE: "290",
    BELONG_CLASSIF: "交易行为",
    BELONG_CLASSIF_CODE: "05",
  },
  {
    EVENT_TYPE: "上市状态变动",
    EVENT_TYPE_CODE: "230",
    BELONG_CLASSIF: "交易提示",
    BELONG_CLASSIF_CODE: "04",
  },
  {
    EVENT_TYPE: "申购提示",
    EVENT_TYPE_CODE: "200",
    BELONG_CLASSIF: "交易提示",
    BELONG_CLASSIF_CODE: "04",
  },
  {
    EVENT_TYPE: "诉讼仲裁",
    EVENT_TYPE_CODE: "260",
    BELONG_CLASSIF: "风险提示",
    BELONG_CLASSIF_CODE: "07",
  },
  {
    EVENT_TYPE: "停复牌",
    EVENT_TYPE_CODE: "220",
    BELONG_CLASSIF: "交易提示",
    BELONG_CLASSIF_CODE: "04",
  },
  {
    EVENT_TYPE: "投资互动",
    EVENT_TYPE_CODE: "400",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "违规处罚",
    EVENT_TYPE_CODE: "270",
    BELONG_CLASSIF: "风险提示",
    BELONG_CLASSIF_CODE: "07",
  },
  {
    EVENT_TYPE: "限售解禁",
    EVENT_TYPE_CODE: "080",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "项目投资",
    EVENT_TYPE_CODE: "310",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "项目中标",
    EVENT_TYPE_CODE: "410",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "新增概念",
    EVENT_TYPE_CODE: "120",
    BELONG_CLASSIF: "交易提示",
    BELONG_CLASSIF_CODE: "04",
  },
  {
    EVENT_TYPE: "业绩快报",
    EVENT_TYPE_CODE: "002",
    BELONG_CLASSIF: "业绩披露",
    BELONG_CLASSIF_CODE: "02",
  },
  {
    EVENT_TYPE: "业绩预告",
    EVENT_TYPE_CODE: "003",
    BELONG_CLASSIF: "业绩披露",
    BELONG_CLASSIF_CODE: "02",
  },
  {
    EVENT_TYPE: "增发",
    EVENT_TYPE_CODE: "180",
    BELONG_CLASSIF: "分红融资",
    BELONG_CLASSIF_CODE: "03",
  },
  {
    EVENT_TYPE: "增减持计划",
    EVENT_TYPE_CODE: "320",
    BELONG_CLASSIF: "股权变动",
    BELONG_CLASSIF_CODE: "06",
  },
  {
    EVENT_TYPE: "重要合同",
    EVENT_TYPE_CODE: "420",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "资本运作",
    EVENT_TYPE_CODE: "140",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
  {
    EVENT_TYPE: "总经理变更",
    EVENT_TYPE_CODE: "390",
    BELONG_CLASSIF: "重大事项",
    BELONG_CLASSIF_CODE: "01",
  },
];

enum Color {
  green = "#065f46",
  red = "#dc2626",
}

export const eventsMapColor = {
  股东增持: Color.red,
  股东减持: Color.green,
  高管减持: Color.green,
  高管增持: Color.red,
  股票回购: Color.red,
  龙虎榜: Color.red,
  限售解禁: Color.green,
  诉讼仲裁: Color.green,
  股权质押: Color.green,
  解除质押: Color.red,
  违规处罚: Color.green,
};

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

  /**
   * 同花顺的龙虎榜数据
   * desc - 降序,
   * date - YYYY-MM-DD,
   * order_field:
   *  - hot_rank - 同花顺人气；
   *  - buy_value,sell_value - 买卖方金额；
   *  - net_rate - 净买入占比；
   *  - net_value - 净买入；
   *  - change - 涨幅；
   *  */
  getWinnersData(params) {
    const {
      order_field = "net_value",
      order_type = "desc",
      date = dayjs().format("YYYY-MM-DD"),
    } = params;
    const url = `https://data.10jqka.com.cn/dataapi/transaction/stock/v1/list?order_field=${order_field}&order_type=${order_type}&date=${date}&filter=&page=1&size=500&module=all&order_null_greater=1`;
    return this.get(url);
  }

  /**
   * 东方财富获取个股事件
   */
  getDfcfEventsByStock(stock) {
    const url = `https://datacenter.eastmoney.com/securities/api/data/get?type=RTP_F10_ADVANCE_DETAIL_NEW&params=${stock};003,006,080,090,100,110,160,170,180,260,270,320,340,350,410,430&P=1&rdm=rnd_7641669B371C4A8AAD6B0A74FED91DCB`;
    return this.get(url);
  }

  /**
   * 东方财富获取个股事件-无龙虎榜
   */
  getDfcfEventsByStock2(stock) {
    const url = `https://datacenter.eastmoney.com/securities/api/data/get?type=RTP_F10_ADVANCE_DETAIL_NEW&params=${stock};003,080,090,100,110,160,170,180,260,270,320,340,350,410,430&P=1&rdm=rnd_7641669B371C4A8AAD6B0A74FED91DCB`;
    return this.get(url);
  }

  /**
   * 同花顺获取当日股市评分
   */
  getQkjTodayScore() {
    const url = `https://dq.10jqka.com.cn/fuyao/market_analysis_api/score/v1/get_market_score`;
    return this.get(url);
  }

  // 同花顺获取强势股连板
  getConnectingPlate(date: string) {
    const url = `https://data.10jqka.com.cn/mobileapi/hotspot_focus/stock_pool/v1/get_tab_info?date=${date}`;
    return this.get(url);
  }

  // 同花顺获取两日涨停板的比较情况
  getLimitTowDayCompare(date: string) {
    const url = `https://data.10jqka.com.cn/mobileapi/hotspot_focus/limit_up_compare/v1/two_days_compare?date=${date}`;
    return this.get(url);
  }

  // 同花顺获取最近30日的两连板及以上数据的情况
  getHotspotFocus(date: string) {
    const url = `https://data.10jqka.com.cn/mobileapi/hotspot_focus/limit_up_compare/v1/range_compare?`;
    return this.get(url);
  }

  // 同花顺获取涨停强度-连板池的数据
  getLimitPower(date: string) {
    const url = `https://data.10jqka.com.cn/dataapi/limit_up/continuous_limit_pool?page=1&limit=15&field=199112,10,330329,330325,133971,133970,1968584,3475914,3541450,9004&filter=HS,GEM2STAR&order_field=330329&order_type=0&date=${date}`;
    return this.get(url);
  }
  
})();
