import { useEffect } from "react";
import "./index.less";
import { allInfoApi } from "@/apis";
import { useDispatch } from "react-redux";
import {
  finishCountIncrease,
  updateDataByCode,
} from "@/store/features/kdj_limit_data/kdj_limit_data_slice";

export default function Index(props) {
  const { data } = props;

  // 定义store相关的hooks
  const dispatch = useDispatch();

  useEffect(() => {
    const stock: string = data["股票代码"]?.split(".");
    get_profit_data(stock[0], stock[1] === "SH" ? "17" : "33", data.code);
  }, [data.code]);

  useEffect(() => {}, [data.financialData]);

  const get_profit_data = async (
    stockCode: string,
    marketId: string,
    code: number
  ) => {
    try {
      const res = await allInfoApi.get_profit_data(stockCode, marketId);
      dispatch(finishCountIncrease());
      if (res.code === 200) {
        dispatch(updateDataByCode({ data: res.data, code }));
        // 已完成统计数量递增
      }
    } catch (error) {
      // 已完成统计数量递增
      dispatch(finishCountIncrease());
      console.log(error, `财务数据请求报错,股票码${stockCode}`);
    }
  };

  return (
    <div className="stock-item-wrap">
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">股票简称</span>{" "}
        {data.股票简称}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">涨停封单量占成交量比</span>{" "}
        {data.涨停封单量占成交量比}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">涨停原因类别</span>{" "}
        {data.涨停原因类别}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">几天几板</span>{" "}
        {data.几天几板}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">连续涨停天数</span>{" "}
        {data.连续涨停天数}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">买入信号</span>{" "}
        {data.买入信号inter}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">技术形态</span>{" "}
        {data.技术形态}
      </div>
      <div className="mb-2.5 text-[15px]">
        <span className="text-[15px] text-[#ff2244]">归母净利润增长</span>{" "}
        {(data.financialData?.[0].yoy * 100).toFixed(2)}%
      </div>
    </div>
  );
}
