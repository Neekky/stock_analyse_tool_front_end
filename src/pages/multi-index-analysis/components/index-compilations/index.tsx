import { stockklineApi } from "@/apis";
import { safeJsonParse } from "@/utils/common";
import { renderTrendWord } from "@/utils/render-func";
import dayjs from "dayjs";
import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import './index.less';

export default function IndexCompilations(props) {
  const { indexData = {}, ago = 40 } = props;

  // 指数K线开高收低数据
  const [indexKline, setIndexKline] = useState([]);

  useEffect(() => {
    getIndexKLine();
  }, []);

  const getIndexKLine = async () => {
    // 获取当前时间的60天之前日期
    const startDate = dayjs().subtract(ago, "day").format("YYYY-MM-DD");
    const res = await stockklineApi.getIndexKLine({
      startDate,
      index: indexData.index,
    });

    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      const times: string[] = [];
      console.log(data, 12131);
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
      data: indexKline.map((item) => item[0]), // 提取日期
      boundaryGap: true,
    },
    yAxis: {
      type: "value",
      min: function (value) {
        return (value.min - 10).toFixed(0);
      },
      max: function (value) {
        return (value.max + 10).toFixed(0);
      },
      splitNumber: 4,
    },
    series: [
      {
        name: "K-Line",
        type: "candlestick",
        data: indexKline.map((item) => [item[1], item[2], item[3], item[4]]),
      },
    ],
  });

  return (
    <div
      className="icomp-wrap mx-auto mb-4"
      data-aos="zoom-y-out"
      data-aos-delay={600}
    >
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
                {` ${indexData?.["最新涨跌幅"]?.toFixed(3)}%`}
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
          <div className="h-56 md:w-3/4 custom:w-screen ">
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
