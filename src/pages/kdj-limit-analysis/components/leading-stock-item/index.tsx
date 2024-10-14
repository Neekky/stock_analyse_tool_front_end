import { useCallback } from "react";
import "./index.less";
import ReactEcharts from "echarts-for-react";
import dayjs from "dayjs";

export default function Index(props) {
  const { data } = props;
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
        data: data.kline.map((item) =>
          dayjs(item["日期"]).format("YYYY-MM-DD")
        ),
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
          data: data.kline.map((item) => [
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
          data: data.kline.map((item) => item["成交额"]),
          itemStyle: {
            color: "#4b8df8",
          },
        },
      ],
    };
  }, [data.kline]);

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
      <div className="stock-info-wrap">
        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">行业板块</span>{" "}
          <span className=" text-[#333]">
            {data.plateData.industry_l2.name}
          </span>
        </div>
        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">行业龙头</span>{" "}
          <span className=" text-[#333]">
            {data.plateData.industry_l2.leading_stock.name}
          </span>
        </div>
        <div className="mb-2.5 text-[15px] flex justify-start">
          <span className="text-[15px] text-[#ff2244] mr-4">细分行业</span>{" "}
          <span className=" text-[#333]">
            {data.plateData.industry_l3.name}
          </span>
        </div>
      </div>

      {/* 股票事件 */}
      <div className="mb-2">
        <div className="text-[20px] text-[#333] font-semibold	">大事提醒</div>
        <div className="stock-info-wrap mt-2 text-[#333]">{data.incOrDecHold}</div>
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
