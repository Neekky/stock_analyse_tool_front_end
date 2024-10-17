import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const StockChart = ({ data }) => {
  const chartRef = useRef(null);

  const chartRef2 = useRef(null);

  // 涨跌家数展示
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
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
        data: ["上涨家数", "下跌家数"],
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
      ],
      series: [
        {
          name: "上涨家数",
          type: "line",
          data: data.map((item) => item.上涨家数),
          itemStyle: {
            color: "#dc2626",
          },
        },
        {
          name: "下跌家数",
          type: "line",
          data: data.map((item) => item.下跌家数),
          itemStyle: {
            color: "#16a34a",
          },
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

    const option = {
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
        },
        {
          type: "value",
          name: "比值",
          position: "right",
          axisLabel: {
            formatter: "{value}",
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
        },
        {
          name: "跌停家数",
          type: "line",
          data: data.map((item) => item.跌停数),
          itemStyle: {
            color: "#16a34a",
          },
        },
        {
          name: "跌停/涨停比值",
          type: "line",
          yAxisIndex: 1,
          data: data.map((item) =>
            item.涨停数 !== 0 ? (item.跌停数 / item.涨停数).toFixed(2) : 0
          ),
          itemStyle: {
            color: "#eab308",
          },
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
    </>
  );
};

export default StockChart;
