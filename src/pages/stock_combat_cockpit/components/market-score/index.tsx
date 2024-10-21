import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./index.less";

const StockChart = ({ data, indexKline, todayScore }) => {
  const chartRef = useRef(null);
  // 涨跌家数展示
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option: any = {
      title: {
        text: "大盘综合评分",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["综合评分", "上证指数"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.日期),
      },
      yAxis: [
        {
          type: "value",
          name: "评分",
          position: "left",
        },
        {
          type: "value",
          name: "上证指数",
          position: "right",
          axisLabel: {
            formatter: "{value}",
          },
          min: function (value) {
            return (value.min - 10).toFixed(0);
          },
          max: function (value) {
            return (value.max + 10).toFixed(0);
          },
        },
      ],
      series: [
        {
          name: "综合评分",
          type: "line",
          data: data.map((item) => item.综合评分),
          itemStyle: {
            color: "#dc2626",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "上证指数",
          type: "candlestick",
          data: indexKline.map((item) => [item[1], item[2], item[3], item[4]]),
          yAxisIndex: 1,
        },
      ],
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: 0,
          start: 20,
          end: 100,
        },
        {
          type: "inside",
          xAxisIndex: 0,
          start: 20,
          end: 100,
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [data, indexKline]);

  return (
    <>
      {todayScore ? (
        <div className="w-full today-score-wrap">
          <div className="text-[18px] font-semibold	text-[#b91c1c]">
            当日点评
          </div>
          <div>
            <span className="text-[18px] text-[#292524] mr-2">
              当日综合评分
            </span>{" "}
            <span className="text-[24px] text-[#b91c1c] mr-2">
              {todayScore?.sum_socre}
            </span>
            <span className="text-[14px] text-[#78716c] ml-2">技术面</span>{" "}
            <span className="text-[14px] text-[#b91c1c]">
              {todayScore?.tech_score}
            </span>
            <span className="text-[14px] text-[#78716c] ml-2">资金面</span>{" "}
            <span className="text-[14px] text-[#b91c1c]">
              {todayScore?.money_score}
            </span>
          </div>
          <div>
            <span className="text-[18px] text-[#292524] mr-2">{todayScore?.score_title}</span>
            <span className="text-[14px] text-[#78716c]">{todayScore?.score_content}</span>
          </div>
        </div>
      ) : null}
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
      <div className="w-full market-tip-wrap">
        <div className="text-[18px] font-semibold	text-[#b91c1c]">使用小贴士</div>
        <div className="text-[16px] text-[#78716c] mt-2">1. 该指标为资金面、技术面的平均分数。</div>
      </div>
    </>
  );
};

export default StockChart;
