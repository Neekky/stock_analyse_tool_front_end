import { Axios } from "@/utils"; // 导入 api
import queryString from "query-string";
import dayjs from "dayjs";
import { service } from "@/utils/request";

const API_GATEWAY_FLASK = import.meta.env.VITE_APP_API_GATEWAY_FLASK;

interface IGetStockKLineProps {
  symbol: string;
  period?: "daily" | "weekly" | "monthly";
  start_date?: string;
  adjust?: "" | "qfq" | "hfq";
  end_date?: string;
  is_head_end?: "1" | void; // 是否只返回起始日和结束日日期
}

interface IGetIndexKLineProps {
  index?: string;
  startDate?: string;
  endDate?: string;
}

interface IGetIndexTopBottomProps {
  type?: string;
  code?: string;
  start_date?: string;
  end_date?: string;
}

let codeIdMap: any = null;

// akshare辅助函数，获取每个股票所对应的ID，返回一个映射符号到ID的字典
export const codeIdMapEM = async () => {
  if (codeIdMap) return codeIdMap;
  const url = "https://80.push2.eastmoney.com/api/qt/clist/get";

  const paramsList = [
    {
      fs: "m:1 t:2,m:1 t:23",
      marketId: 1,
    },
    {
      fs: "m:0 t:6,m:0 t:80",
      marketId: 0,
    },
    {
      fs: "m:0 t:81 s:2048",
      marketId: 0,
    },
  ];

  const codeIdDict = {};

  for (let i = 0; i < paramsList.length; i++) {
    const params = {
      pn: "1",
      pz: "50000",
      po: "1",
      np: "1",
      ut: "bd1d9ddb04089700cf9c27f6f7426281",
      fltt: "2",
      invt: "2",
      fid: "f3",
      fs: paramsList[i].fs,
      fields: "f12",
      _: Date.now(),
    };

    try {
      const response = await service.get(url, { params, timeout: 15000 });
      const dataJson = response;

      if (!dataJson?.data?.diff) {
        continue;
      }

      dataJson.data.diff.forEach((item) => {
        const code = item.f12; // Assuming f12 corresponds to stock code
        codeIdDict[code] = paramsList[i].marketId; // Assigning market ID
      });
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
      return {};
    }
  }
  codeIdMap = codeIdDict;
  return codeIdDict;
};
codeIdMapEM();

export default new (class StockKline extends Axios {
  // 获取涨停板数据
  getStockKLine(params: IGetStockKLineProps) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/get_stock_k_line?${stringified}`;
    return this.get(url);
  }

  getStockRealtimeKLine(symbol: string) {
    const url = `${API_GATEWAY_FLASK}/get_stock_realtime_data?symbol=${symbol}`;
    return this.get(url);
  }

  // 获取指数的K线数据
  getIndexKLine(params: IGetIndexKLineProps) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/get_index_k_line?${stringified}`;
    return this.get(url);
  }

  // 获取指数的见顶见底概率
  getIndexTopBottomPercent(params: IGetIndexTopBottomProps) {
    const stringified = queryString.stringify(params);
    const url = `${API_GATEWAY_FLASK}/get_index_top_bottom_percent?${stringified}`;
    return this.get(url);
  }

  // 快速获取上证指数的见顶见底概率
  getSzTopBottomPercent() {
    const url = `${API_GATEWAY_FLASK}/get_sz_top_bottom_percent`;
    return this.get(url);
  }

  // 直接从东方财富获取股票K线
  async stockZhAHist(
    symbol = "000001",
    period = "daily",
    startDate = "20240201",
    endDate = "20240830",
    adjust = "",
    timeout = 3000
  ) {
    const codeIdDict = await codeIdMapEM(); // 需要实现 codeIdMapEm 函数
    const adjustDict = { qfq: "1", hfq: "2", "": "0" };
    const periodDict = { daily: "101", weekly: "102", monthly: "103" };

    const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get";
    const params = {
      fields1: "f1,f2,f3,f4,f5,f6",
      fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f116",
      ut: "7eea3edcaed734bea9cbfc24409ed989",
      klt: periodDict[period],
      fqt: adjustDict[adjust],
      secid: `${codeIdDict[symbol]}.${symbol}`,
      beg: startDate,
      end: endDate,
      _: Date.now(), // 使用当前时间戳
    };

    try {
      const response = await this.get(url, { params, timeout });
      const dataJson = response.data;

      if (!dataJson || !dataJson?.klines) {
        return []; // 返回空数组替代DataFrame
      }

      const tempData = dataJson?.klines.map((item) => item.split(","));
      const formattedData = tempData.map((item) => {
        return {
          日期: dayjs(item[0]).valueOf(), // 使用moment.js格式化日期，todo，转成使用dayjs，转为时间戳
          股票代码: symbol,
          开盘: parseFloat(item[1]),
          收盘: parseFloat(item[2]),
          最高: parseFloat(item[3]),
          最低: parseFloat(item[4]),
          成交量: parseFloat(item[5]),
          成交额: parseFloat(item[6]),
          振幅: parseFloat(item[7]),
          涨跌幅: parseFloat(item[8]),
          涨跌额: parseFloat(item[9]),
          换手率: parseFloat(item[10]),
        };
      });

      return formattedData;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return [];
    }
  }

  async stockZhASpotEm() {
    /**
     * 东方财富网-沪深京 A 股-实时行情
     * @return {Promise<Object>} 实时行情数据
     */
    const url = "https://82.push2.eastmoney.com/api/qt/clist/get";
    const params = new URLSearchParams({
      pn: "1",
      pz: "50000",
      po: "1",
      np: "1",
      ut: "bd1d9ddb04089700cf9c27f6f7426281",
      fltt: "2",
      invt: "2",
      fid: "f3",
      fs: "m:0 t:6,m:0 t:80,m:1 t:2,m:1 t:23,m:0 t:81 s:2048",
      fields:
        "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18," +
        "f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152",
      _: "1623833739532",
    });

    try {
      const response = await this.get(`${url}?${params}`, { timeout: 15000 });
      if (response?.data?.diff <= 0) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataJson = response;

      if (!dataJson.data.diff || dataJson.data.diff.length === 0) {
        return [];
      }
      console;
      const tempArr = dataJson.data.diff.map((item) => {
        const transformedItem = {
          最新价: item.f2 || 0,
          涨跌幅: item.f3 || 0,
          涨跌额: Number(item.f4) || 0,
          成交量: Number(item.f5) || 0,
          成交额: Number(item.f6) || 0,
          振幅: Number(item.f7) || 0,
          换手率: Number(item.f8) || 0,
          "市盈率-动态": Number(item.f9) || 0,
          量比: Number(item.f10) || 0,
          "5分钟涨跌": Number(item.f11) || 0,
          代码: item.f12 || "",
          名称: item.f14 || "",
          最高: Number(item.f15) || 0,
          最低: Number(item.f16) || 0,
          今开: Number(item.f17) || 0,
          昨收: Number(item.f18) || 0,
          总市值: Number(item.f20) || 0,
          流通市值: Number(item.f21) || 0,
          涨速: Number(item.f22) || 0,
          市净率: Number(item.f23) || 0,
          "60日涨跌幅": Number(item.f24) || 0,
          年初至今涨跌幅: Number(item.f25) || 0,
        };
        return transformedItem;
      });
      return tempArr;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return [];
    }
  }

  // 获取指定股票日内分钟级数据
  async stockZhAHistPreMinEm(
    symbol = "000001",
    startTime = "09:00:00",
    endTime = "15:50:00"
  ) {
    const codeIdDict = await codeIdMapEM(); // 假设这是一个已定义的函数，它返回对应代码字典
    const url = "https://push2.eastmoney.com/api/qt/stock/trends2/get";
    const params = {
      fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13",
      fields2: "f51,f52,f53,f54,f55,f56,f57,f58",
      ut: "fa5fd1943c7b386f172d6893dbfba10b",
      ndays: "1",
      iscr: "1",
      iscca: "0",
      secid: `${codeIdDict[symbol]}.${symbol}`,
      _: Date.now(),
    };

    try {
      const response = await this.get(url, { params, timeout: 15000 });
      const data = response;
      if (!data.data || !data.data.trends) {
        throw new Error("无效的响应数据");
      }

      const tempData = data.data.trends.map((item) => item.split(","));
      const tempDf = tempData.map((item) => ({
        时间: item[0],
        开盘: parseFloat(item[1]) || null,
        收盘: parseFloat(item[2]) || null,
        最高: parseFloat(item[3]) || null,
        最低: parseFloat(item[4]) || null,
        成交量: parseFloat(item[5]) || null,
        成交额: parseFloat(item[6]) || null,
        最新价: parseFloat(item[7]) || null,
      }));

      const dateFormat = dayjs(tempDf[0].时间).format("YYYY-MM-DD");

      const filteredData = tempDf.filter((item) => {
        const itemTime = dayjs(item.时间);
        const flag =
          itemTime.isAfter(`${dateFormat} ${startTime}`) &&
          itemTime.isBefore(`${dateFormat} ${endTime}`);
        return flag;
      });

      // 转换为字符串时间格式
      filteredData.forEach((item) => {
        item.时间 = dayjs(item.时间).format("YYYY-MM-DD HH:mm:ss");
      });

      return filteredData;
    } catch (error: any) {
      console.error("获取股票数据失败:", error.message);
      throw error; // 根据需要处理错误
    }
  }

  mapNature(nature) {
    switch (nature) {
      case "2":
        return "买盘";
      case "1":
        return "卖盘";
      case "4":
        return "中性盘";
      default:
        return "未知";
    }
  }
})();
