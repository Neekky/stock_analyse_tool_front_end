import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  updateKdjData,
  refreshData,
} from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import { dataConversion } from "@/utils";
import dayjs from "dayjs";
import { selectStockModelApi } from "@/apis";
import { deepClone, rank } from "@/utils/common";
import StockItem from "../stock-item";

export default function Index(props) {
  const { date } = props;
  const dispatch = useDispatch();

  // 各分析维度的权重配比
  const [weights] = useState({
    yoy: 0.4, // 同比增长
    break: 0.2, // 涨停开板次数
    time: 0.1, // 最终涨停时间
    limitAmount: 0.3, // 涨停封单量占成交量比
  });

  const [isFinish, setIsfinish] = useState(false);

  // 定义store相关的hooks
  const kdjData = useSelector(
    (state: RootState) => state.kdj_limit.kdjLimitData
  );

  const finishCount = useSelector(
    (state: RootState) => state.kdj_limit.finishCount
  );

  useEffect(() => {
    const dateStr = dayjs(date).format("YYYYMMDD");
    dispatch(refreshData());
    setIsfinish(false);
    get_limit_kdj_model_data({ date: dateStr });
  }, [date]);

  useEffect(() => {
    if (finishCount === kdjData.length && kdjData.length > 0 && !isFinish) {
      const copyData = deepClone(kdjData);
      // 数据转换
      const copyKdjData = copyData.map((ele) => {
        const newestProfitYoy = ele?.financialData?.[0]?.numberYoy || 0;
        const newestProfitValue = ele?.financialData?.[0]?.numberValue || 0;
        return {
          ...ele,
          newestProfitYoy,
          newestProfitColor: newestProfitValue > 0 ? "#ff004417" : "#90e29f38",
        };
      });

      // 按各维度进行分析，计算总分
      const analysisData = calculateWeightedScores(copyKdjData, weights);
      // 所有股票的数据都已经获取完毕，进行归母净利润增长排序
      const result = dataConversion.quickSort(analysisData, "score", "desc");

      const diffData = stock_differentiation(result);

      dispatch(updateKdjData({ data: diffData, isUpdate: true }));
      setIsfinish(true);
    }
  }, [finishCount, kdjData.length, isFinish]);

  // 将ST、科创板、北证板股票提取出来
  const stock_differentiation = (stockList) => {
    const condition = (value) =>
      value.股票简称.includes("ST") ||
      value.股票简称.includes("st") ||
      value.股票代码.startsWith("688") ||
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
      // const testRank = rank(copyStocks, '涨停开板次数', 'desc');
      // const testNormalize = normalize(copyStocks, '涨停开板次数');
      // console.log(copyStocks)
      // console.log(testRank, 111)
      // console.log(testNormalize, 222)
      // 我的最终排序是降序排序，所以正向因子应该为升序asc，负向因子应该为降序desc
      const normalizedData = {
        yoy: rank(copyStocks, "newestProfitYoy", 'asc'), // 同比增长,
        break: rank(copyStocks, "涨停开板次数", 'desc'), // 涨停开板次数
        time: rank(copyStocks, "final_limit_time_stamp", 'desc'), // 最终涨停时间
        limitAmount: rank(copyStocks, "涨停封单量占成交量比", 'asc'), // 涨停封单量占成交量比
      };

      copyStocks.forEach((stock, index) => {
        stock.score =
          weights.yoy * normalizedData.yoy[index] +
          weights.break * normalizedData.break[index] +
          weights.time * normalizedData.time[index] +
          weights.limitAmount * normalizedData.limitAmount[index];
      });

      return copyStocks;
    } catch (error) {
      console.log("多维度加权分析报错", error);
      return [];
    }
  };

  // 获取每日kdj金叉涨停板数据
  const get_limit_kdj_model_data = async (data) => {
    const res = await selectStockModelApi.get_limit_kdj_model_data(data);
    if (res.code === 200) {
      dispatch(updateKdjData({ data: res.data, isUpdate: true }));
    }
  };

  return (
    <div>
      {kdjData.map((ele, index) => (
        <StockItem
          key={ele.code + ele["涨停封单量"]}
          index={index}
          data={ele}
          date={date}
        />
      ))}
    </div>
  );
}