import { useEffect, useCallback, useState } from "react";
import "./index.less";
import { allInfoApi, stockklineApi } from "@/apis";
import { useDispatch } from "react-redux";
import {
  leadingFinishCountIncrease,
  updateLeadingProfitDataByCode,
} from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import ReactEcharts from "echarts-for-react";
import dayjs from "dayjs";
import thirdParty from "@/apis/thirdParty";

export default function Index(props) {
  const { data, date, isFinish } = props;

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
    get_stock_data(stock[0], start_date, end_date);
  }, [data.code, date]);

  // 倒计时结束时，请求个股板块数据
  useEffect(() => {
    if (isFinish) {
      get_stock_plate_data()
    }
  }, [isFinish, data.code]);

  const get_stock_plate_data = async () => {
    const stock: string = data["股票代码"]?.split(".")[0];

    // 计算market
    let market = "33";
    if (stock.startsWith("6")) {
      market = "17";
    }
    if (stock.startsWith("8")) {
      market = "151";
    }

    const res = await thirdParty.getQKAStockPlateData(stock, market);
    console.log(res)
  };

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
    code: number
  ) => {
    try {
      const res = await allInfoApi.get_profit_data(stockCode, marketId);
      dispatch(leadingFinishCountIncrease());
      if (res.code === 200) {
        const transData = res.data.map((ele) => ({
          ...ele,
          numberYoy: Number(ele.yoy),
          numberMom: Number(ele.mom),
          numberValue: Number(ele.value),
        }));
        dispatch(updateLeadingProfitDataByCode({ data: transData, code }));
        // 已完成统计数量递增
      }
    } catch (error) {
      // 已完成统计数量递增
      dispatch(leadingFinishCountIncrease());
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
        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">股票代码</span>{" "}
          <span className=" text-[#333]">{data.股票代码}</span>
        </div>

        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">股票简称</span>{" "}
          <span className=" text-[#333]">{data.股票简称}</span>
        </div>

        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">几天几板</span>{" "}
          <span className=" text-[#333]">{data.几天几板}</span>
        </div>

        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">概念龙头个数</span>{" "}
          <span className=" text-[#333]">{data.概念龙头个数}</span>
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
