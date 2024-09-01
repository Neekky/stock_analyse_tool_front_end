import { useEffect } from "react";
import "./index.less";
import { allInfoApi, stockklineApi } from "@/apis";
import { useDispatch } from "react-redux";
import {
  finishCountIncrease,
  updateDataByCode,
} from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import ReactEcharts from "echarts-for-react";
import dayjs from "dayjs";
import { useState } from "react";
import { useCallback } from "react";

export default function Index(props) {
  const { data, date } = props;

  const [kLine, setKLine] = useState([]);

  // 定义store相关的hooks
  const dispatch = useDispatch();

  useEffect(() => {
    const stock: string = data["股票代码"]?.split(".");
    get_profit_data(stock[0], stock[1] === "SH" ? "17" : "33", data.code);
  }, [data.code]);

  useEffect(() => {
    // 起始日期为选择日期的60天前
    const start_date = date.subtract(120, "day").format("YYYYMMDD");
    // 结束日期恒定为今天
    const end_date = dayjs(new Date()).format("YYYYMMDD");

    const stock: string = data["股票代码"]?.split(".");
    get_stock_data(
      stock[0],
      start_date,
      end_date
    );
  }, [data.code, date]);

  useEffect(() => {}, [data.financialData]);

  const get_stock_data = async (symbol:string, start_date, end_date) => {
    const res = await stockklineApi.stockZhAHist(
      symbol,
      'daily',
      start_date,
      end_date,
      'qfq'
    );
    if (res?.length > 0) {
      setKLine(res);
    }
    console.log(res, "K线");
  };

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
    const yoyGrowth = reverseData.map((item) =>
      (item.numberYoy * 100).toFixed(2)
    ); // 同比增长率
    const qoqGrowth = reverseData.map((item) =>
      (item.numberMom * 100).toFixed(2)
    ); // 环比增长率

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
          barWidth: 20,
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

  // k线图的echarts配置
  const getKlineoOption = useCallback(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: {
        type: 'category',
        data: kLine.map((item) => dayjs(item['日期']).format("YYYY-MM-DD")),
      },
      yAxis: [
        {
          type: 'value',
          name: 'K线',
        },
        {
          type: 'value',
          name: '成交额',
          // 关联成交量图，最好分开展示
          position: 'right',
        },
      ],
      series: [
        {
          name: 'K-line',
          type: 'candlestick',
          data: kLine.map((item) => [item['开盘'], item['收盘'], item['最低'], item['最高']]),
          itemStyle: {
            color: '#ef232a',
            color0: '#14b143',
            borderColor: '#ef232a',
            borderColor0: '#14b143',
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          yAxisIndex: 1,
          data: kLine.map((item) => item['成交额']),
          itemStyle: {
            color: '#4b8df8',
          },
        },
      ],
    };
  }, [kLine])

  return (
    <div
      className="stock-item-wrap"
      style={{ backgroundColor: data.newestProfitColor }}
    >
      {/* 股票基本数据展示 */}
      <div className="stock-info-wrap">
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">股票代码</span>{" "}
          <span className=" text-[#333]">{data.股票代码}</span>
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">股票简称</span>{" "}
          <span className=" text-[#333]">{data.股票简称}</span>
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">涨停原因类别</span>{" "}
          <span className=" text-[#333]">{data.涨停原因类别}</span>
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">几天几板</span>{" "}
          <span className=" text-[#333]">{data.几天几板}</span>
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">连续涨停天数</span>{" "}
          <span className=" text-[#333]">{data.连续涨停天数}</span>
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">买入信号</span>{" "}
          <span className=" text-[#333]">{data.买入信号inter}</span>
        </div>
        <div className="mb-2.5 text-[15px]">
          <span className="text-[15px] text-[#ff2244]">技术形态</span>{" "}
          <span className=" text-[#333]">{data.技术形态}</span>
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
      <div className="h-72 md:w-full custom:w-screen mt-6 flex justify-center">
        <ReactEcharts
          option={getKlineoOption()}
          style={{ width: "80%", height: "100%" }}
        />
      </div>
      
    </div>
  );
}
