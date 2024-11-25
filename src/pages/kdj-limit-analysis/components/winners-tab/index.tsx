import { thirdPartyApi } from "@/apis";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WinnersStockItem from "../winners-stock-item";
import { deepClone, rank } from "@/utils/common";
import { dataConversion } from "@/utils";
import { combineWinners } from "../../common";
import "./index.less";
import { Spin } from "antd";

export default function Index(props) {
  const { date } = props;

  // 获取交易日期
  const tradeDate = useSelector(
    (state: RootState) => state.realtime_stock.tradeDate
  );

  // 各分析维度的权重配比
  const [weights] = useState({
    net_value: 0.5, // 净买入占比
    tags: 0.5, // 游资参与家数
  });

  const [isLoading, setIsLoading] = useState(true);

  const [progress, setProgress] = useState(0);

  // 龙虎榜数据
  const [winnersData, setWinnersData] = useState<any[]>([]);

  // 更新龙虎榜全量数据
  useEffect(() => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");

    // 周末不处理
    const day = dayjs(date).day();
    if (day === 0 || day === 6) return;

    get_winners_data(dateStr, date);
  }, [date]);

  // 获取每日龙虎榜数据
  const get_winners_data = async (date, originDate) => {
    try {
      setIsLoading(true);
      setProgress(0);
      setWinnersData([]);
      const res = await thirdPartyApi.getWinnersData({ date });
      if (res.status_msg === "success") {
        // 将1开头的股过滤
        const filterData =
          res.data?.items?.filter((ele) => {
            // 排除掉3日的龙虎榜
            const flag = ele?.tags?.findIndex((tag) => tag.name === "3日") > -1;
            return (
              !ele.stock_code?.startsWith("1") &&
              ele?.net_value > 20000000 &&
              ele?.change > 0.08 &&
              !flag
            );
          }) || [];

        // 更新龙虎榜常规数据

        // 查询结果每个个股的各项数据
        const results:any = await fetchInBatches(filterData, originDate, 5);

        // 再次进行数据过滤，将财务数据不达标的过滤掉
        const filterResults = results.filter(stock => {
          const count = dataConversion.countNegatives(stock.financialData)
          return count <= 7
        })

        // 对结果做排序
        const finalResults = rankStock(filterResults);
        setIsLoading(false);
        setWinnersData(finalResults);
      }
    } catch (error) {
      console.error("每日龙虎榜涨停板数据，失败：", error, "传参", date);
    }
  };

  const rankStock = (data) => {
    const copyData = deepClone(data);
    // 数据转换
    const copyWinnersData = copyData.map((ele) => {
      const newestProfitYoy = ele?.financialData?.[0]?.numberYoy || 0;
      const newestProfitValue = ele?.financialData?.[0]?.numberValue || 0;
      return {
        ...ele,
        newestProfitYoy,
        newestProfitColor: newestProfitValue > 0 ? "#ff004417" : "#90e29f38",
        tagsLength: ele.tags.length || 0,
        eventsColor: newestProfitValue > 0 ? "#fdd2d2" : "#cdeac8",
      };
    });

    // 按各维度进行分析，计算总分
    const analysisData = calculateWeightedScores(copyWinnersData, weights);
    // 所有股票的数据都已经获取完毕，进行归母净利润增长排序
    const result = dataConversion.quickSort(analysisData, "score", "desc");

    const diffData = stock_differentiation(result);
    return diffData;
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
        batch.map((item) => combineWinners({ ...item, start_date, end_date }))
      );
      results.push(...batchResults);
      setProgress(Math.round((i / data.length) * 100));
    }
    return results.map((ele: any) => ele.value);
  };

  // 将ST、科创板、北证板股票提取出来
  const stock_differentiation = (stockList) => {
    const condition = (value) =>
      value.stock_name.includes("ST") ||
      value.stock_name.includes("st") ||
      value.stock_code.startsWith("688") ||
      value.stock_code.startsWith("4") ||
      value.stock_code.startsWith("9") ||
      value.stock_code.startsWith("8");

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
        return {
          ...ele,
        };
      });

      // 我的最终排序是降序排序，所以正向因子应该为升序asc，负向因子应该为降序desc
      const normalizedData = {
        net_value: rank(copyStocks, "net_value", "asc"), // 净买入,
        net_rate: rank(copyStocks, "net_rate", "asc"), // 净买入占比,
        tags: rank(copyStocks, "tagsLength", "asc"), // 净买入占比,
      };

      copyStocks.forEach((stock, index) => {
        stock.score =
          weights.net_value * normalizedData.net_value[index] +
          weights.tags * normalizedData.tags[index];
      });

      return copyStocks;
    } catch (error) {
      console.log("多维度加权分析报错", error);
      return [];
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-72 flex justify-center items-center">
          <Spin size="large" percent={progress}></Spin>
        </div>
      ) : <div>数量：{winnersData.length + 1}</div>}

      {/* 正常结果列表 */}
      {winnersData.map((ele, index) => (
        <WinnersStockItem
          key={ele.stock_code}
          index={index}
          data={ele}
          date={date}
          tradeDate={tradeDate}
        />
      ))}
    </div>
  );
}
