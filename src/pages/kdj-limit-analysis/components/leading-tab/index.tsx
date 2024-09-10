import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  refreshLeadingData,
  updateLeadingData,
} from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import { dataConversion } from "@/utils";
import dayjs from "dayjs";
import { selectStockModelApi } from "@/apis";
import { deepClone, normalize, rank } from "@/utils/common";
import LeadingStockItem from "../leading-stock-item";

export default function Index(props) {
  const { date } = props;
  const dispatch = useDispatch();

  // 各分析维度的权重配比
  const [weights] = useState({
    yoy: 0.4, // 同比增长
    break: 0.1, // 涨停开板次数
    time: 0.1, // 最终涨停时间
    limitAmount: 0.2, // 涨停封单量占成交量比
    leadingCount:  0.2, // 占不同概念龙头的数量
  });

  const [isFinish, setIsfinish] = useState(false);

  // 定义store相关的hooks
  const leadingData = useSelector(
    (state: RootState) => state.kdj_limit.leadingLimitData
  );

  const finishCount = useSelector(
    (state: RootState) => state.kdj_limit.leadingFinishCount
  );

  useEffect(() => {
    const dateStr = dayjs(date).format("YYYYMMDD");
    dispatch(refreshLeadingData());
    setIsfinish(false);
    get_limit_leading_model_data({ date: dateStr });
  }, [date]);

  useEffect(() => {
    if (finishCount === leadingData.length && leadingData.length > 0 && !isFinish) {
      const copyData = deepClone(leadingData);
      // 数据转换
      const copyLeadingData = copyData.map((ele) => {
        const newestProfitYoy = ele?.financialData?.[0]?.numberYoy || 0;
        const newestProfitValue = ele?.financialData?.[0]?.numberValue || 0;
        return {
          ...ele,
          newestProfitYoy, // 最新的同比增长数值
          newestProfitColor: newestProfitValue > 0 ? "#ff004417" : "#90e29f38",
        };
      });

      // 按各维度进行分析，计算总分
      const analysisData = calculateWeightedScores(copyLeadingData, weights);
      // 所有股票的数据都已经获取完毕，进行归母净利润增长排序
      const result = dataConversion.quickSort(analysisData, "score", "desc");

      const diffData = stock_differentiation(result);

      dispatch(updateLeadingData({ data: diffData, isUpdate: true }));
      setIsfinish(true);
    }
  }, [finishCount, leadingData.length, isFinish]);

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
   
      const normalizedData = {
        yoy: normalize(copyStocks, "newestProfitYoy"), // 同比增长
        break: normalize(copyStocks, "涨停开板次数"), // 涨停开板次数
        time: normalize(copyStocks, "final_limit_time_stamp"), // 最终涨停时间
        limitAmount: normalize(copyStocks, "涨停封单量占成交量比"), // 涨停封单量占成交量比
        leadingCount: normalize(copyStocks, "概念龙头个数"), // 涨停封单量占成交量比
      };
      copyStocks.forEach((stock, index) => {
        stock.score =
          weights.yoy * normalizedData.yoy[index] -
          weights.break * normalizedData.break[index] -
          weights.time * normalizedData.time[index] +
          weights.limitAmount * normalizedData.limitAmount[index] +
          weights.leadingCount * normalizedData.limitAmount[index];
      });

      return copyStocks;
    } catch (error) {
      console.log("多维度加权分析报错", error);
      return [];
    }
  };

  // 获取每日涨停概念龙头数据
  const get_limit_leading_model_data = async (data) => {
    const res = await selectStockModelApi.get_limit_leading_model_data(data);
    if (res.code === 200) {
      dispatch(updateLeadingData({ data: res.data, isUpdate: true }));
    }
  };
  return (
    <div>
      {leadingData.map((ele, index) => (
        <LeadingStockItem
          key={ele.code + ele["涨停封单量"]}
          index={index}
          data={ele}
          date={date}
          isFinish={isFinish}
        />
      ))}
    </div>
  );
}
