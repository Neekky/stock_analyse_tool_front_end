import { useEffect } from "react";
import "./index.less";
import { allInfoApi } from "@/apis";
import { useDispatch } from "react-redux";
import {
  finishCountIncrease,
  updateDataByCode,
} from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import ReactEcharts from "echarts-for-react";

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
        const transData = res.data.map((ele) => ({
          ...ele,
          numberYoy: Number(ele.yoy),
          numberMom: Number(ele.mom),
          numberValue: Number(ele.value),
        }));
        dispatch(updateDataByCode({ data: transData, code }));
        // 已完成统计数量递增
      }
    } catch (error) {
      // 已完成统计数量递增
      dispatch(finishCountIncrease());
      console.log(error, `财务数据请求报错,股票码${stockCode}`);
    }
  };

  const getOption = () => {
    // 数组倒置
    const reverseData = data?.financialData?.slice(0)?.reverse() || [];
    const categories = reverseData.map((item) => item.report); // 获取X轴刻度
    const netProfit = reverseData.map((item) => item.numberValue); // 净利润
    const yoyGrowth = reverseData.map((item) => (item.numberYoy * 100).toFixed(2)); // 同比增长率
    const qoqGrowth = reverseData.map((item) => (item.numberMom * 100).toFixed(2)); // 环比增长率

    return {
      title: {
        text: "股票归母净利润分析",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["净利润", "同比增长率", "环比增长率"],
      },
      xAxis: {
        type: "category",
        data: categories,
      },
      yAxis: [
        {
          type: "value",
          name: "净利润",
          position: "left",
        },
        {
          type: "value",
          name: "增长率",
          position: "right",
          axisLabel: {
            formatter: "{value} %",
          },
        },
      ],
      series: [
        {
          name: "净利润",
          type: "bar",
          data: netProfit,
          barWidth: 20
        },
        {
          name: "同比增长率",
          type: "line",
          yAxisIndex: 1,
          data: yoyGrowth,
        },
        {
          name: "环比增长率",
          type: "line",
          yAxisIndex: 1,
          data: qoqGrowth,
        },
      ],
    };
  };

  return (
    <div
      className="stock-item-wrap"
      style={{ backgroundColor: data.newestProfitColor }}
    >
      {/* 股票基本数据展示 */}
      <div className="stock-info-wrap">
      
      <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">股票代码</span>{" "}
          {data.股票代码}
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">股票简称</span>{" "}
          {data.股票简称}
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

      {/* 归母净利润图表展示 */}
      <div className="h-72 md:w-full custom:w-screen mt-6 flex justify-center">
        <ReactEcharts
          option={getOption()}
          style={{ width: "80%", height: "100%" }}
        />
      </div>
    </div>
  );
}
