import { stockklineApi } from "@/apis";
import { safeJsonParse } from "@/utils/common";
import { renderTrendWord } from "@/utils/render-func";
import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import "./index.less";
import { calculateEMA, myToFixed } from "@/utils/calculate";

export default function IndexCompilations(props) {
  const { indexData = {} } = props;

  // 指数K线开高收低数据
  const [indexKline, setIndexKline] = useState([]);

  // 指数K线见顶见底概率数据
  const [indexTBPercent, setIndexTBPercent] = useState([]);

  useEffect(() => {
    getIndexKLine();
    getIndexTopBottomPercent();
  }, []);

  const getIndexKLine = async () => {
    // 获取当前时间的60天之前日期
    const res = await stockklineApi.getIndexKLine({
      startDate: '2018-01-01',
      index: indexData.index,
    });
    console.log(indexData, 'indexData.index')
    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      const times: string[] = [];
      // 处理K线数据，按照[开盘价, 收盘价, 最低价, 最高价]的顺序。
      const kdata = data.map((ele) => {
        const { open, close, low, high, candle_end_time } = ele;
        const kitem = [candle_end_time, open, close, low, high];
        times.push(candle_end_time);
        return kitem;
      });
      setIndexKline(kdata);
    }
  };

  const getIndexTopBottomPercent = async () => {
    const res = await stockklineApi.getSzTopBottomPercent({
      csv_name: indexData.csvName
    });
    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);

      // 处理概率数据
      const percentData = data.map((ele) => {
        const { date, percent } = ele;
        const calPercent = percent.toFixed(2);
        const percentItem = [date, calPercent];
        return percentItem;
      });

      setIndexTBPercent(percentData);
    }
  };

  const calculateMA = (dayCount: number) => {
    const data: any = indexKline;
    const result: any[] = [];
    for (let i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum: number = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += +data[i - j][1];
      }
      result.push({value: sum / dayCount});
    }

    console.log(result, 'result is')
    return result;
  }

  // 配置图表的选项
  const getOption = () => ({
    animation: true,
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        // params 包含当前数据点的所有信息
        const paramsList: any[] = params.map(ele => {
          if (ele?.seriesName === "K线图") return `${ele?.seriesName}: <br /> 开${ele?.value[1]} <br /> 收${ele?.value[2]} <br /> 低${ele?.value[3]} <br /> 高${ele?.value[4]}`;

          return `<div>${ele?.seriesName}: ${Number(ele?.value)?.toFixed(2)} <div/>`
        })
        return paramsList.join('');
      },
      // formatter: (params) => {
      //   const { data, axisValue } = params[0];
      //   const { value } = params[1];

      //   return `
      //         日期: ${axisValue}<br/>
      //         概率: ${value}%<br/>
      //         开盘: ${data[1]}<br/>
      //         最高: ${data[4]}<br/>
      //         最低: ${data[3]}<br/>
      //         收盘: ${data[2]}<br/>
      //       `;
      // },
    },
    legend: {
      data: ['K线图', '顶底概率', 'EMA5', 'EMA10']
    },
    xAxis: {
      type: "category",
      data: indexKline.map((item) => item[0]), // 提取日期
      boundaryGap: true,
    },
    yAxis: [
      {
        type: "value",
        min: function (value) {
          return (value.min - 10).toFixed(0);
        },
        max: function (value) {
          return (value.max + 10).toFixed(0);
        },
        splitNumber: 4,
      },
      {
        type: "value",
        name: "顶底概率",
        axisLine: { onZero: false },
        min: -100,
        max: 100,
        scale: true,
      },
    ],
    series: [
      {
        name: "K线图",
        type: "candlestick",
        data: indexKline.map((item) => [item[1], item[2], item[3], item[4]]),
      },
      {
        name: "顶底概率",
        type: "line",
        data: indexTBPercent.map((item) => ({
          value: item[1],
        })),
        yAxisIndex: 1,
        smooth: true,
        symbol: "none",
      },
      {
        name: 'EMA5',
        type: 'line',
        data: calculateEMA(indexKline, 5),
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        lineStyle: {
          color: '#b91c1c'
        }
      },
      {
        name: 'EMA10',
        type: 'line',
        data: calculateEMA(indexKline, 10),
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        lineStyle: {
          color: '#4d7c0f'
        }
      },
    ],
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: 0,
        start: 60,
        end: 100,
      },
      {
        type: "inside",
        xAxisIndex: 0,
        start: 60,
        end: 100,
      },
    ],
  });

  return (
    <div className="icomp-wrap mx-auto mb-4">
      <div className="index-module mx-auto flex flex-col items-center">
        <h2 className="module-title w-full">{indexData.indexName}</h2>
        <div className="flex flex-row items-center justify-between flex-wrap container mx-auto">
          <div className="shrink-0">
            <div className="module-content">
              今日涨跌幅
              <span
                style={{
                  color: indexData?.scoreColor,
                }}
              >
                {` ${myToFixed(indexData?.["最新涨跌幅"], 3)}%`}
              </span>
            </div>
            <div className="module-content">
              当前连续
              <span
                style={{
                  color: indexData?.upDaysColor,
                }}
              >
                {indexData?.consecutive_up_days > 0
                  ? ` 上涨${indexData?.consecutive_up_days}天`
                  : ` 下跌${indexData?.consecutive_down_days}天`}
              </span>
            </div>
            <div className="module-content">
              当前趋势为
              <span
                style={{
                  color:
                    indexData?.["当前趋势"] === "上行趋势"
                      ? "#f46649"
                      : "#2aa491",
                }}
              >
                {` ${indexData?.["当前趋势"]}`}
              </span>
            </div>
            {indexData?.["是否剧烈振幅"] ? (
              <div className="module-content">
                今日剧烈震荡 {indexData?.["是否加速"]}
              </div>
            ) : null}
            <div className="module-content">
              当前
              <span
                style={{
                  color: indexData?.scoreColor,
                }}
              >
                {indexData?.isTopOrBottom}
              </span>
              的概率为
              <span className="text-[#f46649] text-500 mx-1.5">
                {indexData["反转数据"]?.percent}%
              </span>
            </div>
          </div>
          <div className="h-96 md:w-full custom:w-screen ">
            <ReactEcharts
              option={getOption()}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-[#333] text-lg font-medium mb-[8px]">市场建议</h2>
          <div className="text-gray-600 text-sm bg-slate-200 rounded-lg p-3">
            {renderTrendWord(
              indexData["反转数据"]?.percent,
              indexData["反转数据"]?.score
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
