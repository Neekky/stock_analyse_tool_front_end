import { useEffect, useState } from "react";

import { dataConversion } from "@/utils";
import dayjs from "dayjs";
import { allInfoApi, selectStockModelApi } from "@/apis";
import { deepClone, rank } from "@/utils/common";
import LeadingStockItem from "../leading-stock-item";
import { combineLeading } from "../../common";
import { Spin } from "antd";

export default function Index(props) {
  const { date } = props;

  // 各分析维度的权重配比
  const [weights] = useState({
    yoy: 0.4, // 同比增长
    break: 0.1, // 涨停开板次数
    time: 0.1, // 最终涨停时间
    limitAmount: 0.2, // 涨停封单量占成交量比
    leadingCount: 0.1, // 占不同概念龙头的数量
    hotPlate: 0.1, // 占当日热门概念数量
  });

  const [isLoading, setIsLoading] = useState(true);

  const [progress, setProgress] = useState(0);

  const [leadingData, setLeadingData] = useState<any[]>([]);

  useEffect(() => {
    const dateStr = dayjs(date).format("YYYYMMDD");

    // 周末不处理
    const day = dayjs(date).day();
    if (day === 0 || day === 6) return;

    // 请求今日热点涨停股票
    get_limit_leading_model_data(dateStr, date);
  }, [date]);

  // 将ST、科创板、北证板股票提取出来
  const stock_differentiation = (stockList) => {
    const condition = (value) =>
      value.股票简称.includes("ST") ||
      value.股票简称.includes("st") ||
      value.股票代码.startsWith("688") ||
      value.股票代码.startsWith("4") ||
      value.股票代码.startsWith("8");

    const isStMore = stockList.filter((ele) => condition(ele));
    const isntStMore = stockList.filter((ele) => !condition(ele));
    return isntStMore.concat(isStMore);
  };

  // 2. 计算每个股票的加权总分
  const calculateWeightedScores = (stocks, weights) => {
    try {
      if (!Array.isArray(stocks) || stocks.length === 0) {
        throw new Error("无效的股票数据");
      }
      if (typeof weights !== "object" || Object.keys(weights).length === 0) {
        throw new Error("无效的权重数据");
      }

      const copyStocks = deepClone(stocks).map((ele) => {
        const [hours, minutes, seconds] = ele["最终涨停时间"]
          .trim()
          .split(":")
          .map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        // 处理涨停时间为时间戳
        return {
          ...ele,
          final_limit_time_stamp: date.getTime(),
        };
      });

      // 我的最终排序是降序排序，所以正向因子应该为升序asc，负向因子应该为降序desc
      const normalizedData = {
        yoy: rank(copyStocks, "newestProfitYoy", "asc"), // 同比增长
        break: rank(copyStocks, "涨停开板次数", "desc"), // 涨停开板次数
        time: rank(copyStocks, "final_limit_time_stamp", "desc"), // 最终涨停时间
        limitAmount: rank(copyStocks, "涨停封单量占成交量比", "asc"), // 涨停封单量占成交量比
        leadingCount: rank(copyStocks, "概念龙头个数", "asc"), // 涨停封单量占成交量比
        hotPlate: rank(copyStocks, "hotPlateLength", "asc"), // 个股所属概念，命中当日热门概念的数量
      };

      copyStocks.forEach((stock, index) => {
        stock.score =
          weights.yoy * normalizedData.yoy[index] +
          weights.break * normalizedData.break[index] +
          weights.time * normalizedData.time[index] +
          weights.limitAmount * normalizedData.limitAmount[index] +
          weights.leadingCount * normalizedData.limitAmount[index] +
          weights.hotPlate * normalizedData.hotPlate[index];
      });
      return copyStocks;
    } catch (error) {
      console.log("多维度加权分析报错", error);
      return [];
    }
  };

  // 获取每日的热点板块数据
  const get_hot_plate_data = async (date: string) => {
    try {
      const res = await allInfoApi.get_hot_plate_data(date);
      if (res.code === 200) {
        const data = JSON.parse(res.data);
        return data;
      } else {
        throw new Error("热点板块接口请求失败");
      }
    } catch (error) {
      console.log("请求热点板块失败", error);
      return [];
    }
  };

  // 获取每日涨停概念龙头数据
  const get_limit_leading_model_data = async (date, originDate) => {
    try {
      setIsLoading(true);
      setProgress(0);
      setLeadingData([]);
      // 同时请求数据
      const [res, plateRes]: [any, any] = await Promise.allSettled([
        selectStockModelApi.get_limit_leading_model_data({
          date,
        }),
        get_hot_plate_data(date),
      ]);

      if (res?.value?.code === 200) {
        // 查询结果每个个股的各项数据
        const results: any = await fetchInBatches(res.value.data, originDate, 5);

        // 再次进行数据过滤，将财务数据不达标的过滤掉
        const filterResults = results.filter((stock) => {
          const count = dataConversion.countNegatives(stock.financialData);
          return count <= 7;
        });
      
        // 对结果做排序
        const finalResults = rankStock(filterResults, plateRes?.value || []);
        setIsLoading(false);
        setLeadingData(finalResults);
      }
    } catch (error) {
      console.error("每日龙头涨停板数据查询，失败", error, "传参", date);
    }
  };

  /**
   * 以批处理方式异步获取给定 URLs 的数据。
   *
   * @param urls - 一个包含待获取数据的 URL 字符串的数组。
   * @param batchSize - 每次请求的批处理大小。
   * @returns 返回一个 Promise，该 Promise 在所有 URL 请求完成后解析为一个包含请求结果的数组。
   *
   * 请求的结果将根据 `Promise.allSettled` 返回的结构进行处理。
   * 各个结果的状态可以是 "fulfilled" 或 "rejected"，每个结果包含状态及对应的值或原因。
   */
  const fetchInBatches = async (
    data: object[],
    date: any,
    batchSize: number
  ): Promise<
    Array<{ status: "fulfilled" | "rejected"; value?: any; reason?: any }>
  > => {
    const results: PromiseSettledResult<any>[] = [];
    // 起始日期为选择日期的60天前
    const start_date = date.subtract(120, "day").format("YYYYMMDD");

    // 结束日期恒定为今天
    const end_date = dayjs(new Date()).format("YYYYMMDD");

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((item) => {
          const stock: string = item["股票代码"]?.split(".");

          // 获取股票码
          const stock_code = stock[0];

          // 获取股票市场ID
          const market_id = stock[1] === "SH" ? "17" : "33";
          return combineLeading({
            ...item,
            start_date,
            end_date,
            stock_code,
            market_id,
          });
        })
      );
      results.push(...batchResults);

      setProgress(Math.round((i / data.length) * 100));
    }
    return results.map((ele: any) => ele.value);
  };

  const rankStock = (leadingData, plateData = []) => {
    const copyData = deepClone(leadingData);

    // 保留财务正增长的股票
    const filterData = copyData.filter((stock) => {
      const newestProfitYoy = stock?.financialData?.[0]?.numberYoy || 0;
      const newestProfitValue = stock?.financialData?.[0]?.numberValue || 0;

      return newestProfitYoy > 0 && newestProfitValue > 0;
    });
    // 数据转换
    const copyLeadingData = filterData.map((ele) => {
      const newestProfitYoy = ele?.financialData?.[0]?.numberYoy || 0;
      const newestProfitValue = ele?.financialData?.[0]?.numberValue || 0;

      // 将个股的概念进行整合
      const baseConcept = ele?.plateData?.gainian || [];
      const industryConcept = ele?.plateData?.industry_l2 || null;

      if (industryConcept) baseConcept.push(industryConcept);

      // 计算个股概念和当日热门概念的并集
      const intersection = baseConcept.filter((item1: any) =>
        plateData.some(
          (item2: any) => String(item2.code) === String(item1.code)
        )
      );
      return {
        ...ele,
        hotPlate: intersection,
        hotPlateLength: intersection?.length || 0,
        newestProfitYoy, // 最新的同比增长数值
        newestProfitColor: newestProfitValue > 0 ? "#ff004417" : "#90e29f38",
        eventsColor: newestProfitValue > 0 ? "#fdd2d2" : "#cdeac8",
      };
    });

    // 按各维度进行分析，计算总分
    const analysisData = calculateWeightedScores(copyLeadingData, weights);
    // 所有股票的数据都已经获取完毕，进行归母净利润增长排序
    const result = dataConversion.quickSort(analysisData, "score", "desc");

    const diffData = stock_differentiation(result);

    return diffData;
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-72 flex justify-center items-center">
          <Spin size="large" percent={progress}></Spin>
        </div>
      ) : <div>数量：{leadingData.length + 1}</div>}
      {leadingData.map((ele, index) => (
        <LeadingStockItem key={ele.code} index={index} data={ele} date={date} />
      ))}
    </div>
  );
}
