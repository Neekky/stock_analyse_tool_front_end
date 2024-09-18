import { useEffect, useCallback, useState } from "react";
import "./index.less";
import { allInfoApi, stockklineApi } from "@/apis";
import { useDispatch } from "react-redux";
import {
  finishCountIncrease,
  updateDataByCode,
} from "@/store/features/winners_limit_data/winners_limit_data_slice";
import ReactEcharts from "echarts-for-react";
import dayjs from "dayjs";

export default function Index(props) {
  const { data, date } = props;

  const [kLine, setKLine] = useState([]);

  // 定义store相关的hooks
  const dispatch = useDispatch();

  useEffect(() => {
    const stock_code: string = data.stock_code;
    const market_id: string = data.market_id;
    get_profit_data(stock_code, market_id, stock_code);
    get_stock_realtime_data(stock_code);
  }, [data.stock_code]);

  useEffect(() => {
    // 起始日期为选择日期的60天前
    const start_date = date.subtract(120, "day").format("YYYYMMDD");
    // 结束日期恒定为今天
    const end_date = dayjs(new Date()).format("YYYYMMDD");

    const stock_code: string = data.stock_code;
    get_stock_data(stock_code, start_date, end_date);
  }, [data.stock_code, date]);

  useEffect(() => {
    const chooseDay = dayjs(date).add(1, "day").format("YYYY-MM-DD");
    const now = dayjs();

    const today = now.format("YYYY-MM-DD");

    const tradeBeginTime = dayjs().hour(9).minute(15).second(0);
    const tradeEndTime = dayjs().hour(15).minute(0).second(0);

    // 轮询的间隔时间
    const interval = setInterval(() => {
      // 非交易时间或三点之后，清除轮询
      // if (today !== tradeDateStr || now.isAfter(afternoonThree)) {
      //   clearInterval(interval);
      // }
    }, 3000);

    // 清理函数，用于组件卸载时清除轮询
    return () => clearInterval(interval);
  }, [date]);

  const get_stock_data = async (symbol: string, start_date, end_date) => {
    const res = await stockklineApi.stockZhAHist(
      symbol,
      "daily",
      start_date,
      end_date,
      "qfq"
    );
    if (res?.length > 0) {
      setKLine(res);
    }
  };

  const get_profit_data = async (
    stockCode: string,
    marketId: string,
    code: string
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

  const get_stock_realtime_data = async (stock_code) => {
    const res = await stockklineApi.stockZhAHistPreMinEm(stock_code);
    console.log(res, "ressss is");
  };

  const get_stock_intraday_data = async (stock_code) => {
    const res = await stockklineApi.stockIntradayEm(stock_code);
    console.log(res, "get_stock_intraday_data is");
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
      media: [
        {
          query: {
            maxWidth: 600,
          },
          option: {
            // 针对小屏幕的配置
            title: {
              text: "",
            },
            grid: {
              left: "5%",
              right: "5%",
              bottom: "10%",
              top: "20%",
              containLabel: true, // 适应屏幕
            },
            xAxis: {
              axisLabel: {
                fontSize: 10, // 调整x轴文字大小
              },
            },
            yAxis: {
              axisLabel: {
                fontSize: 10, // 调整y轴文字大小
              },
            },
            series: [
              {
                // 针对小屏幕的特定设置，比如缩减数据点数量或调整样式
                type: "bar", // 示例类型
                barWidth: "50%", // 柱状图宽度
                // 其他设置
              },
            ],
          },
        },
      ],
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
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: (params) => {
          const { data, axisValue } = params[0];
          return `
                日期: ${axisValue}<br/>
                开盘: ${data[1]}<br/>
                最高: ${data[4]}<br/>
                最低: ${data[3]}<br/>
                收盘: ${data[2]}<br/>
              `;
        },
      },
      legend: {
        // data: ["K线", "成交额"],
      },
      xAxis: {
        type: "category",
        data: kLine.map((item) => dayjs(item["日期"]).format("YYYY-MM-DD")),
      },
      yAxis: [
        {
          type: "value",
          name: "成交额",
          // 关联成交量图，最好分开展示
          position: "left",
        },
        {
          type: "value",
          name: "K线",
          position: "right",
        },
      ],
      grid: [
        {
          left: "5%",
          right: "5%",
          bottom: "10%",
          top: "10%",
          containLabel: true, // 适应屏幕
        },
      ],
      series: [
        {
          name: "K线",
          type: "candlestick",
          data: kLine.map((item) => [
            item["开盘"],
            item["收盘"],
            item["最低"],
            item["最高"],
          ]),
          yAxisIndex: 1,
          itemStyle: {
            color: "#ef232a",
            color0: "#14b143",
            borderColor: "#ef232a",
            borderColor0: "#14b143",
          },
        },
        {
          name: "成交额",
          type: "bar",
          yAxisIndex: 0,
          data: kLine.map((item) => item["成交额"]),
          itemStyle: {
            color: "#4b8df8",
          },
        },
      ],
    };
  }, [kLine]);

  return (
    <div
      className="stock-item-wrap"
      style={{ backgroundColor: data.newestProfitColor }}
    >
      {/* 股票基本数据展示 */}
      <div className="stock-info-wrap">
        <div className="mb-2.5 text-[15px] w-2/6 flex justify-start">
          <span className="text-[15px] text-[#333] mr-4">股票代码</span>{" "}
          <span className=" text-[#f46649]">{data.stock_code}</span>
        </div>

        <div className="mb-2.5 text-[15px] w-2/6 flex justify-center">
          <span className="text-[15px] text-[#333] mr-4">股票简称</span>{" "}
          <span className=" text-[#f46649]">{data.stock_name}</span>
        </div>

        <div className="mb-2.5 text-[15px] w-2/6 flex justify-end">
          <span className="text-[15px] text-[#333] mr-4">净买入</span>{" "}
          <span className=" text-[#f46649]">{data.net_value}</span>
        </div>
      </div>

      <div className="stock-info-wrap">
        <div className="mb-2.5 text-[15px] w-1/2 flex justify-start">
          <div className="text-[15px] text-[#333] mr-4">游资</div>{" "}
          {data.tags.length > 0 ? (
            <div className="mb-2.5 text-[15px] flex justify-center">
              {data.tags.map((ele) => {
                return (
                  <span style={{ color: ele.color }} className="mr-2">
                    {ele.name}
                  </span>
                );
              })}
            </div>
          ) : null}
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
