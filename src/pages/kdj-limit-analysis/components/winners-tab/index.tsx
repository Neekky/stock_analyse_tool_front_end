import { thirdPartyApi } from "@/apis";
import {
  refreshData,
  updateWinnersData,
} from "@/store/features/winners_limit_data/winners_limit_data_slice";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WinnersStockItem from "../winners-stock-item";
import { deepClone, rank } from "@/utils/common";
import { dataConversion } from "@/utils";

export default function Index(props) {
  const { date } = props;
  const dispatch = useDispatch();

  // 各分析维度的权重配比
  const [weights] = useState({
    net_value: 1, // 净买入占比
  });

  const [isFinish, setIsfinish] = useState(false);

  // 定义store相关的hooks
  const winnersData = useSelector(
    (state: RootState) => state.winners_limit.winnersData
  );

  const finishCount = useSelector(
    (state: RootState) => state.winners_limit.finishCount
  );

  // 获取每日龙虎榜数据
  const get_winners_data = async (data) => {
    const res = await thirdPartyApi.getWinnersData(data);
    console.log(res, "21321331");
    if (res.status_msg === "success") {
      // 将1开头的股过滤
      const filterData =
        res.data?.items?.filter(
          (ele) => !ele.stock_code?.startsWith("1") && ele?.net_value > 20000000
        ) || [];
      dispatch(updateWinnersData({ data: filterData, isUpdate: true }));
    }
  };

  useEffect(() => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    dispatch(refreshData());
    setIsfinish(false);
    get_winners_data({ date: dateStr });
  }, [date]);

  useEffect(() => {
    if (
      finishCount === winnersData.length &&
      winnersData.length > 0 &&
      !isFinish
    ) {
      const copyData = deepClone(winnersData);
      // 数据转换
      const copyWinnersData = copyData.map((ele) => {
        const newestProfitYoy = ele?.financialData?.[0]?.numberYoy || 0;
        const newestProfitValue = ele?.financialData?.[0]?.numberValue || 0;
        return {
          ...ele,
          newestProfitYoy,
          newestProfitColor: newestProfitValue > 0 ? "#ff004417" : "#90e29f38",
        };
      });

      // 按各维度进行分析，计算总分
      const analysisData = calculateWeightedScores(copyWinnersData, weights);
      // 所有股票的数据都已经获取完毕，进行归母净利润增长排序
      const result = dataConversion.quickSort(analysisData, "score", "desc");

      const diffData = stock_differentiation(result);

      dispatch(updateWinnersData({ data: diffData, isUpdate: true }));
      setIsfinish(true);
    }
  }, [finishCount, winnersData.length, isFinish]);

  // 将ST、科创板、北证板股票提取出来
  const stock_differentiation = (stockList) => {
    const condition = (value) =>
      value.stock_name.includes("ST") ||
      value.stock_name.includes("st") ||
      value.stock_code.startsWith("688") ||
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
      // const testRank = rank(copyStocks, '涨停开板次数', 'desc');
      // const testNormalize = normalize(copyStocks, '涨停开板次数');
      // console.log(copyStocks)
      // console.log(testRank, 111)
      // console.log(testNormalize, 222)
      // 我的最终排序是降序排序，所以正向因子应该为升序asc，负向因子应该为降序desc
      const normalizedData = {
        net_value: rank(copyStocks, "net_value", "asc"), // 净买入,
        net_rate: rank(copyStocks, "net_rate", "asc"), // 净买入占比,
      };

      copyStocks.forEach((stock, index) => {
        stock.score =
          weights.net_value * normalizedData.net_value[index]
      });

      return copyStocks;
    } catch (error) {
      console.log("多维度加权分析报错", error);
      return [];
    }
  };

  return (
    <div>
      {winnersData.map((ele, index) => (
        <WinnersStockItem
          key={ele.stock_code + ele.hot_money_net_value}
          index={index}
          data={ele}
          date={date}
        />
      ))}
    </div>
  );
}