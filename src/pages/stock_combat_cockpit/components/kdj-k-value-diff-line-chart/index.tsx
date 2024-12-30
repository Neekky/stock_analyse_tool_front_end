import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./index.less";

const StockEbsLg = ({ kdjKValueDiff, hs300ClosePrice, microStockClosePrice, hs300Date }) => {

  const chartRef = useRef(null);
  // 涨跌家数展示
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option: any = {
      title: {
        text: "大小盘股KDJ的K值差",
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
        data: ["沪深300收盘价", "微盘股收盘价", "KDJ的K值差"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: hs300Date?.map((item) => item),
      },
      yAxis: [
        {
          type: "value",
          name: "收盘价",
          position: "left",
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
        {
          type: "value",
          name: "K值差",
          position: "right",
          min: 'dataMin',
          max: 'dataMax',
        },
        
      ],
      series: [
        {
          name: "沪深300收盘价",
          type: "line",
          data: hs300ClosePrice,
          itemStyle: {
            color: "#dc2626",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "微盘股收盘价",
          type: "line",
          data: microStockClosePrice,
          itemStyle: {
            color: "#6366f1",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "KDJ的K值差",
          type: "line",
          data: kdjKValueDiff?.map((item) => item.toFixed(2)),
          itemStyle: {
            color: "#0284c7",
          },
          yAxisIndex: 1,
          symbol: "none",
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
  }, [kdjKValueDiff, hs300ClosePrice, microStockClosePrice]);

  return (
    <>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
      <div className="w-full market-tip-wrap">
        <div className="text-[18px] font-semibold	text-[#b91c1c]">使用小贴士</div>
        <div className="text-[16px] text-[#78716c] mt-2">沪深300(kdj-k值)-微盘股(kdj-k值)。</div>
        <div className="text-[16px] text-[#78716c] mt-2">1. 当折现数值从小到大时，价值股占优。当数值从大到小时，小盘股占优。</div>
      </div>
    </>
  );
};

export default StockEbsLg;
