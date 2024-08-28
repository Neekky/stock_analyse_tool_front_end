import { selectStockModelApi } from "@/apis";
import { useEffect, useState } from "react";
import StockItem from "./components/stockItem";
import Header from "./components/header";
import { useSelector, useDispatch } from "react-redux";
import { updateData, refreshData } from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import { RootState } from "@/store/store";
import { dataConversion } from "@/utils";
import { deepClone, normalize } from "@/utils/common";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function Index() {
  const [isFinish, setIsfinish] = useState(false);

  // 选择日期
  const [date, setDate] = useState(dayjs(new Date()));

  // 定义store相关的hooks
  const kdjData = useSelector(
    (state: RootState) => state.kdj_limit.kdjLimitData
  );

  const finishCount = useSelector(
    (state: RootState) => state.kdj_limit.finishCount
  );
  const dispatch = useDispatch();

  // 各分析维度的权重配比
  const [weights] = useState({
    yoy: 0.4, // 同比增长
    break: 0.2, // 涨停开板次数
    time: 0.1, // 最终涨停时间
    limitAmount: 0.3, // 涨停封单量占成交量比
  });

  useEffect(() => {
    const dateStr = dayjs(date).format('YYYYMMDD');
    dispatch(refreshData())
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
      console.log(diffData, "维度分析后数据");

      dispatch(updateData({ data: diffData, isUpdate: true }));
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

  // 获取每日kdj金叉涨停板数据
  const get_limit_kdj_model_data = async (data) => {
    const res = await selectStockModelApi.get_limit_kdj_model_data(data);
    if (res.code === 200) {
      dispatch(updateData({ data: res.data, isUpdate: true }));
    }
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

  return (
    <div className="flex items-center	flex-col">
      <Header />

      {/* 日期选择 */}
      <div className="w-10/12 flex items-center	justify-start p-[24px]">
        <span className="text-[15px] text-[#333] mr-2 font-medium">日期选择</span>
        <DatePicker
          format="YYYYMMDD"
          defaultValue={date}
          placeholder="选择日期"
          onChange={setDate}
        />
      </div>
      <div className="w-10/12">
        {kdjData.map((ele, index) => (
          <StockItem
            key={ele.code + ele["涨停封单量"]}
            index={index}
            data={ele}
          />
        ))}
      </div>
    </div>
  );
}
