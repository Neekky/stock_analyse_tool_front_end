import { stockklineApi, thirdPartyApi } from "@/apis";
import { safeJsonParse } from "@/utils/common";
import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import "./index.less";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";

export default function IndexCompilations() {
  // 获取交易日期
  const tradeDate = useSelector(
    (state: RootState) => state.realtime_stock.tradeDate
  );

  // 选择日期
  const [date, setDate] = useState(dayjs(new Date()));

  // 指数K线开高收低数据
  const [indexKline, setIndexKline] = useState([]);

  // 指数K线见顶见底概率数据
  const [indexTBPercent, setIndexTBPercent] = useState([]);

  const [, setConnectingPlate] = useState([]);

  // 初始进入，更新为交易日期
  useEffect(() => {
    setDate(dayjs(tradeDate));
  }, [tradeDate]);

  useEffect(() => {
    pageGetConnectingPlate(date.format("YYYYMMDD"))
  }, [date]);

  useEffect(() => {
    Promise.allSettled([getIndexKLine(), getIndexTopBottomPercent()]);
  }, []);

  const pageGetConnectingPlate = async (dateStr) => {
    const res = await thirdPartyApi.getConnectingPlate(dateStr);

    if (res?.status_msg === "success") {
      setConnectingPlate(res.data);
    }
  }

  const getIndexKLine = async () => {
    // 获取当前时间的60天之前日期
    const res = await stockklineApi.getIndexKLine({
      startDate: "2018-01-01",
      index: "sh000001",
    });

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
      csv_name: "/index_top_bottom_percent.csv"
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

  // 配置图表的选项
  const getOption = () => ({
    title: {
      text: "上证指数趋势预测",
    },
    animation: true,
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const { data, axisValue } = params[0];
        const { value } = params[1];
        
        return `
              日期: ${axisValue}<br/>
              概率: ${value}%<br/>
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
        name: "见顶见底概率",
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
        name: "见顶见底概率",
        type: "line",
        data: indexTBPercent.map((item) => ({
          value: item[1],
        })),
        yAxisIndex: 1,
        smooth: true,
        symbol: "none",
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
    <>
      <ReactEcharts
        option={getOption()}
        style={{ width: "100%", height: "400px" }}
      />
      <div className="w-full index-tip-wrap">
        <div className="text-[18px] font-semibold	text-[#b91c1c]">
          使用小贴士
        </div>
        <div className="text-[16px] text-[#78716c] mt-2">
          1. 折现0轴之上为上行趋势，0轴之下为下行趋势
        </div>
        <div className="text-[16px] text-[#78716c] mt-2">
          2. 折现触底达100%后，观察指数接下来是否继续大跌，有回调时可上车
        </div>
        <div className="text-[16px] text-[#78716c] mt-2">
          3. 折现触顶达100%后，观察指数接下来是否上涨无力，有回调时进行清仓
        </div>
      </div>
    </>
  );
}
