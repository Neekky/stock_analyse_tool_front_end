import ReactEcharts from "echarts-for-react";
import "./index.less";

const StockChart = (props) => {
  const { data } = props;

  const getOption = () => {
    // 处理数据
    const times = data.realtimeData.map((item) => item.时间);
    const prices = data.realtimeData.map((item) => item.成交价);
    const volumes = data.realtimeData.map((item) => item.手数);
    const volumeColors = data.realtimeData.map((item) => {
      if (item.买卖盘性质 === "买盘") return "red";
      if (item.买卖盘性质 === "卖盘") return "green";
      return "gray";
    });

    const option = {
      tooltip: {
        trigger: "axis",
      },
      xAxis: [
        {
          type: "category",
          data: times,
          boundaryGap: false,
          axisLabel: {
            formatter: (value) => {
              return value.slice(0, 5); // 格式化时间
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "成交手数",
          position: "left",
        },
        {
          type: "value",
          name: "价格",
          position: "right",
        },
      ],
      series: [
        {
          name: "价格",
          type: "line",
          data: prices,
          smooth: true,
          yAxisIndex: 1,
        },
        {
          name: "成交手数",
          type: "bar",
          data: volumes,
          itemStyle: {
            color: (params) => volumeColors[params.dataIndex],
          },
        },
      ],
      grid: {
        top: "10%",
        bottom: "15%",
        left: "10%",
        right: "10%",
        containLabel: true, // 适应屏幕
      },
      legend: {
        data: ["成交手数", "价格"],
      },
    };
    return option;
  };

  return (
    <div className="rt-wrap">
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
      <ReactEcharts
        option={getOption()}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default StockChart;
