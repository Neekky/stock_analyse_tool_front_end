import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const StockChart = ({ data, indexKline = [] }) => {
  const chartRef = useRef(null);

  const chartRef2 = useRef(null);

  // 涨跌家数展示
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option: any = {
      title: {
        text: "大盘涨跌家数分析",
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
        data: ["上涨家数", "下跌家数", "上证指数"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.日期),
      },
      yAxis: [
        {
          type: "value",
          name: "家数",
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
          name: "上涨家数",
          type: "line",
          data: data.map((item) => item.上涨家数),
          itemStyle: {
            color: "#dc2626",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "下跌家数",
          type: "line",
          data: data.map((item) => item.下跌家数),
          itemStyle: {
            color: "#16a34a",
          },
          symbol: "none",
          yAxisIndex: 0,
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
  }, [data]);

  // 涨跌停家数展示，及比值
  useEffect(() => {
    const chart = echarts.init(chartRef2.current);

    const option: any = {
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
      title: {
        text: "大盘涨跌停数分析",
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
        data: ["涨停家数", "跌停家数", "跌停/涨停比值"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.日期),
      },
      yAxis: [
        {
          type: "value",
          name: "家数",
          position: "left",
          min: function (value) {
            return value.min;
          },
          max: function (value) {
            return value.max;
          },
          splitNumber: 6,
          yAxisIndex: 0,
        },
        {
          type: "value",
          name: "比值",
          position: "right",
          axisLabel: {
            formatter: "{value}",
          },
          yAxisIndex: 1,
        },
        {
          type: "value",
          name: "上证指数",
          position: "right",
          axisLabel: {
            formatter: "{value}",
          },
          yAxisIndex: 2,
          offset: 50,
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
          name: "涨停家数",
          type: "line",
          data: data.map((item) => item.涨停数),
          itemStyle: {
            color: "#dc2626",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "跌停家数",
          type: "line",
          data: data.map((item) => item.跌停数),
          itemStyle: {
            color: "#16a34a",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "跌停/涨停比值",
          type: "line",
          data: data.map((item) =>
            item.涨停数 !== 0 ? (item.跌停数 / item.涨停数).toFixed(2) : 0
          ),
          itemStyle: {
            color: "#eab308",
          },
          yAxisIndex: 1,
          symbol: "none",
        },
        {
          name: "上证指数",
          type: "candlestick",
          data: indexKline.map((item) => [item[1], item[2], item[3], item[4]]),
          yAxisIndex: 2,
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [data]);

  return (
    <>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
      <div
        ref={chartRef2}
        className="mt-6"
        style={{ width: "100%", height: "400px" }}
      />
      <div className="w-full">
        <div>使用小贴士</div>
        <div>1. 观察涨跌家数数据的切换，市场长期是震荡，可能为一绿一红交替，有规律。</div>
        <div>2. 通过涨跌停的比值，判断市场的题材是否强势，资金活跃度是否高涨</div>
      </div>
    </>
  );
};

export default StockChart;
