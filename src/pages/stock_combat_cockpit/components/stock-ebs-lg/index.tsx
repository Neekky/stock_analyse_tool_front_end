import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./index.less";

const StockEbsLg = ({ data, indexKline }) => {
  const chartRef = useRef(null);
  // 涨跌家数展示
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option: any = {
      title: {
        text: "股债利差",
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
        data: ["沪深300指数", "股债利差", "股债利差均线"],
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data?.map((item) => item.日期),
      },
      yAxis: [
        {
          type: "value",
          name: "指数",
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
          name: "利差",
          position: "right",
          min: 'dataMin',
          max: 'dataMax',
        },
        
      ],
      series: [
        {
          name: "沪深300指数",
          type: "line",
          data: data?.map((item) => item.沪深300指数),
          itemStyle: {
            color: "#dc2626",
          },
          yAxisIndex: 0,
          symbol: "none",
        },
        {
          name: "股债利差",
          type: "line",
          data: data?.map((item) => item.股债利差),
          itemStyle: {
            color: "#6366f1",
          },
          yAxisIndex: 1,
          symbol: "none",
        },
        {
          name: "股债利差均线",
          type: "line",
          data: data?.map((item) => item.股债利差均线),
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
  }, [data, indexKline]);

  return (
    <>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
      <div className="w-full market-tip-wrap">
        <div className="text-[18px] font-semibold	text-[#b91c1c]">使用小贴士</div>
        <div className="text-[16px] text-[#78716c] mt-2">股债利差 = (1 / 指数市盈率)-10 年国债收益率。</div>
        <div className="text-[16px] text-[#78716c] mt-2">1. 股债利差走势与股票走势大致呈反比关系。</div>
        <div className="text-[16px] text-[#78716c] mt-2">2. 当股债利差曲线处于高位时，说明股票的相对吸引力较大。例如，如果股债利差达到历史较高水平，这可能意味着股票市场被低估，而债券市场相对高估。此时，对于投资者来说，是增加股票资产配置比例的一个潜在时机。</div>
        <div className="text-[16px] text-[#78716c] mt-2">3. 如果股债利差曲线持续上升，可能预示着股市即将迎来上涨行情或者债券市场将要走弱；如果股债利差曲线持续下降，可能意味着股市面临调整压力或者债券市场会走强。</div>
      </div>
    </>
  );
};

export default StockEbsLg;
