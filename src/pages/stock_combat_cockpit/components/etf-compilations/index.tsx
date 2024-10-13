import { stockklineApi } from "@/apis";
import { safeJsonParse } from "@/utils/common";
import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import "./index.less";

export default function EtfCompilations(props) {
  const { etfCode = '', etfName = '', start = 90 } = props;

  // 指数K线开高收低数据
  const [etfKline, setETFKline] = useState([]);

  useEffect(() => {
    getIndexKLine();
  }, []);

  const getIndexKLine = async () => {
    // 获取当前时间的60天之前日期
    const res = await stockklineApi.getETFKLine({
      symbol: etfCode
    });

    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      const times: string[] = [];
      // 处理K线数据，按照[开盘价, 收盘价, 最低价, 最高价]的顺序。
      const kdata = data.map((ele) => {
        const { 开盘, 收盘, 最低, 最高, 日期 } = ele;
        const kitem = [日期, 开盘, 收盘, 最低, 最高];
        times.push(日期);
        return kitem;
      });
      setETFKline(kdata);
    }
  };

  // 配置图表的选项
  const getOption = () => ({
    animation: true,
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const { data, axisValue } = params[0];
        return `
              日期: ${axisValue}<br/>
              开盘: ${data[1]}<br/>
              最高: ${data[4]}<br/>
              最低: ${data[3]}<br/>
              收盘: ${data[2]}<br/>
            `;
      },
    },
    xAxis: {
      type: "category",
      data: etfKline.map((item) => item[0]), // 提取日期
      boundaryGap: true,
    },
    yAxis: [
      {
        type: "value",
        min: function (value) {
          return (value.min - 0.1).toFixed(2);
        },
        max: function (value) {
          return (value.max + 0.1).toFixed(2);
        },
        splitNumber: 4,
      },
    ],
    series: [
      {
        name: "K线图",
        type: "candlestick",
        data: etfKline.map((item) => [item[1], item[2], item[3], item[4]]),
      },
    ],
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: 0,
        start,
        end: 100,
      },
      {
        type: "inside",
        xAxisIndex: 0,
        start,
        end: 100,
      },
    ],
  });

  return (
    <div className="etfcomp-wrap w-full mx-auto mb-4">
      <div className="index-module mx-auto flex flex-col items-center">
        <h2 className="module-title w-full">{etfName}</h2>
        <div className="flex flex-row items-center justify-between flex-wrap container mx-auto">
          <div className="h-96 md:w-full custom:w-screen ">
            <ReactEcharts
              option={getOption()}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
