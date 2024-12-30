import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import amount from "@/utils/amount";
import "../market-score/index.less"

const StockChart = ({ data, indexKline }) => {
  const chartRef = useRef(null);

  // 龙虎榜各路资金明细
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option: any = {
      title: {
        text: "龙虎榜资金历史明细",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
        formatter: function (params) {
          // params 包含当前数据点的所有信息
          const paramsList: any[] = params.map(ele => {
            if (ele?.seriesName === "上证指数") return `${ele?.seriesName} 开${ele?.value[1]} 收${ele?.value[2]} 低${ele?.value[3]} 高${ele?.value[4]}`;
            
            return `<div>${ele?.seriesName}: ${amount.convertToYi(ele?.value)} <span style="color: ${ele.color}; font-weight: bold">——</span> <div/>`
          })
          return paramsList.join('');
        },
      },
      legend: {
        data: ["总榜成交额", "总榜成交净额", "机构成交额", "机构成交净额", "游资成交额", "游资成交净额", "上证指数"],
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
          name: "总榜成交额",
          type: "line",
          data: data.map((item) => item.总榜成交),
          itemStyle: {
            color: "#d97706",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "总榜成交净额",
          type: "line",
          data: data.map((item) => item.总榜成交净值),
          itemStyle: {
            color: "#f59e0b",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "机构成交额",
          type: "line",
          data: data.map((item) => item.机构成交),
          itemStyle: {
            color: "#4d7c0f",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "机构成交净额",
          type: "line",
          data: data.map((item) => item.机构成交净值),
          itemStyle: {
            color: "#a3e635",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "游资成交额",
          type: "line",
          data: data.map((item) => item.游资成交),
          itemStyle: {
            color: "#b91c1c",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "游资成交净额",
          type: "line",
          data: data.map((item) => item.游资成交净值),
          itemStyle: {
            color: "#f87171",
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
      <div ref={chartRef} style={{ width: "100%", height: "700px" }} />
      <div className="w-full market-tip-wrap">
        <div className="text-[18px] font-semibold	text-[#b91c1c]">使用小贴士</div>
        <div className="text-[16px] text-[#78716c] mt-2">1. 观察各路资金变化情况</div>
      </div>
    </>
  );
};

export default StockChart;
