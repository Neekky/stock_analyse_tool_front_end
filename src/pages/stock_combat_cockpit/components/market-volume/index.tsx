import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import amount from "@/utils/amount";

const StockChart = ({ data, indexKline }) => {
  const chartRef = useRef(null);

  // 涨跌家数展示
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option: any = {
      title: {
        text: "市场历史成交额",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
        formatter: function(params) {
          // params 包含当前数据点的所有信息
          return `
            当日成交额: ${amount.convertToYi(params[0].value)} <br/>
            近60日平均成交额: ${amount.convertToYi(params[1].value)} <br/>
            上证指数 <br/>
            开盘: ${params[2].value[1]} <br/>
            收盘: ${params[2].value[2]} <br/>
            最低: ${params[2].value[3]} <br/>
            最高: ${params[2].value[4]} <br/>
          `;
        }
      },
      legend: {
        data: ["当日成交额", "近60日平均成交额","上证指数"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.日期),
      },
      yAxis: [
        {
          type: "value",
          name: "成交额",
          position: "left",
          axisLabel: {
            formatter: function (value) {
              return amount.convertToYi(value);
            },
          },
          yAxisIndex: 0,
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
          yAxisIndex: 1,
        },
      ],
      series: [
        {
          name: "当日成交额",
          type: "line",
          data: data.map((item) => item.当日成交额),
          itemStyle: {
            color: "#dc2626",
          },
          yAxisIndex: 0,
        },
        {
          name: "近60日平均成交额",
          type: "line",
          data: data.map((item) => item.近60日平均成交额),
          itemStyle: {
            color: "#2563eb",
          },
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
  }, [data, indexKline]);

  return (
    <>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </>
  );
};

export default StockChart;
