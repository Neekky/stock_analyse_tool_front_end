import { allInfoApi, stockklineApi } from "@/apis";
import thirdParty from "@/apis/thirdParty";

export const OFTEN = {
  formData: {
    list: [
      {
        code: "1A0001",
        market: "16",
        name: "上证指数",
      },
      {
        code: "399001",
        market: "32",
        name: "深证成指",
      },
      {
        code: "399006",
        market: "32",
        name: "创业板指数",
      },
      {
        code: "1B0688",
        market: "16",
        name: "科创50",
      },
      {
        code: "1B0300",
        market: "16",
        name: "沪深300",
      },
      {
        code: "1B0852",
        market: "16",
        name: "中证1000",
      },
    ],
  },
};

// 获取财务和股票K线数据
export const get_profit_data = async (data) => {
  const { start_date, end_date, market_id, stock_code } = data;

  try {
    const res = await allInfoApi.get_profit_data_and_kline({
      stock_code,
      market_id,
      start_date,
      end_date,
      period: "daily",
      adjust: "qfq",
    });

    if (res.code === 200) {
      const transData = res.data.query_profit.map((ele) => ({
        ...ele,
        numberYoy: Number(ele.yoy),
        numberMom: Number(ele.mom),
        numberValue: Number(ele.value),
      }));
      const kline = JSON.parse(res.data.stock_intraday_em_data);

      return {
        ...data,
        financialData: transData,
        kline,
      };
    }
  } catch (error) {
    console.log(error, `财务数据请求报错,股票码${stock_code}`);
    return {
      ...data,
      financialData: [],
      kline: [],
    };
  }
};

// 获取个股板块数据
export const get_stock_plate_data = async (data) => {
  try {
    const stock: string = data["股票代码"]?.split(".")[0];

    // 计算market
    let market = "33";
    if (stock.startsWith("6")) {
      market = "17";
    }
    if (stock.startsWith("8")) {
      market = "151";
    }

    const res = await thirdParty.getQKAStockPlateData(stock, market);
    if (res?.status_msg === "Success") {
      return {
        plateData: res.data,
      };
    } else {
      throw new Error("请求个股板块数据失败");
    }
  } catch (error) {
    return {
      plateData: {},
    };
  }
};

// kdj涨停板块
export const combineKdj = async (data) => {
  const results: any[] = await Promise.allSettled([
    get_profit_data(data),
    allInfoApi.get_wencai_info(`${data['股票简称']}股东增减持`),
  ]);

  // 去除p标签
  const desc = results[1].value?.data?.desc?.replace(/<\/?p>/g, '') || '';
  return { ...results[0].value, incOrDecHold: desc };
};

// 领涨龙头板块
export const combineLeading = async (data) => {
  const results: any[] = await Promise.allSettled([
    get_profit_data(data),
    get_stock_plate_data(data),
  ]);

  return { ...results[0].value, ...results[1].value };
};

// 获取股票分钟级分时数据
export const get_stock_realtime_data = async (stock_code) => {
  try {
    const res = await stockklineApi.stockZhAHistPreMinEm(stock_code);

    if (res?.length >= 12) {
      const open = res[0].开盘;
      const close = res[12].收盘;
      const change = close - open;
      const changeRate = (change / open) * 100;
      // 开盘涨幅大于0的股票进行收录
      if (changeRate > 0) {
        return { isStandards: true };
      }
    }
    return { isStandards: false };
  } catch (error) {
    console.log("获取股票分时数据失败了", stock_code);
    return { isStandards: false };
  }
};

// 获取股票详细的分笔分时数据
export const get_stock_intraday_data = async (stock_code) => {
  try {
    const res = await stockklineApi.getStockRealtimeKLine(stock_code);

    if (res.code === 200) {
      const data = JSON.parse(res.data);
      return {
        realtimeData: data,
      };
    }
    return {
      realtimeData: null,
    };
  } catch (error) {
    console.log("获取股票详细分时数据失败了", stock_code);
    return {
      realtimeData: null,
    };
  }
};

export const combineRealtimeData = async (data) => {
  const { stock_code } = data;
  const results: any[] = await Promise.allSettled([
    get_stock_realtime_data(stock_code),
    get_stock_intraday_data(stock_code),
  ]);
  return { ...data, ...results[0].value, ...results[1].value };
};
