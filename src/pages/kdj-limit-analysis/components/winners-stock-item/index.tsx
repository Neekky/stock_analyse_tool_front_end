import { useCallback, useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import dayjs from "dayjs";
import "./index.less";
import thirdParty, { eventsMapColor } from "@/apis/thirdParty";
import { dataConversion } from "@/utils";
import amount from "@/utils/amount";

export default function Index(props) {
  const { data } = props;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const symbol = dataConversion.getExchangeByCode(data.stock_code);

    getEvents(`${data.stock_code}.${symbol}`);
  }, []);

  const getEvents = async (stock: string) => {
    const res = await thirdParty.getDfcfEventsByStock2(stock);

    if (res.success) {
      const flatData = dataConversion.flattenArray(res?.data);

      const filterData = dataConversion.filterWithinThreeMonths(
        flatData,
        "NOTICE_DATE"
      );
      setEvents(filterData);
      console.log(filterData, '龙虎榜信息', stock)
    }
  };

  const getOption = () => {
    // 数组倒置
    const reverseData = data?.financialData?.slice(0)?.reverse() || [];
    const categories = reverseData.map((item) => item.report); // 获取X轴刻度
    const netProfit = reverseData.map((item) => item.numberValue); // 净利润
    const yoyGrowth = reverseData.map((item) =>
      (item.numberYoy * 100).toFixed(2)
    ); // 同比增长率
    const qoqGrowth = reverseData.map((item) =>
      (item.numberMom * 100).toFixed(2)
    ); // 环比增长率

    return {
      media: [
        {
          query: {
            maxWidth: 600,
          },
          option: {
            // 针对小屏幕的配置
            title: {
              text: "",
            },
            grid: {
              left: "5%",
              right: "5%",
              bottom: "10%",
              top: "20%",
              containLabel: true, // 适应屏幕
            },
            xAxis: {
              axisLabel: {
                fontSize: 10, // 调整x轴文字大小
              },
            },
            yAxis: {
              axisLabel: {
                fontSize: 10, // 调整y轴文字大小
              },
            },
            series: [
              {
                // 针对小屏幕的特定设置，比如缩减数据点数量或调整样式
                type: "bar", // 示例类型
                barWidth: "50%", // 柱状图宽度
                // 其他设置
              },
            ],
          },
        },
      ],
      title: {
        text: "股票归母净利润分析",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["净利润", "同比增长率", "环比增长率"],
      },
      xAxis: {
        type: "category",
        data: categories,
      },
      yAxis: [
        {
          type: "value",
          name: "净利润",
          position: "left",
          axisLabel: {
            fontSize: 10,
            formatter: function (value) {
              return amount.profitToSymbol(value);
            },
          },
        },
        {
          type: "value",
          name: "增长率",
          position: "right",
          axisLabel: {
            formatter: "{value} %",
          },
        },
      ],
      series: [
        {
          name: "净利润",
          type: "bar",
          data: netProfit,
          barWidth: 20,
        },
        {
          name: "同比增长率",
          type: "line",
          yAxisIndex: 1,
          data: yoyGrowth,
        },
        {
          name: "环比增长率",
          type: "line",
          yAxisIndex: 1,
          data: qoqGrowth,
        },
      ],
    };
  };

  // k线图的echarts配置
  const getKlineoOption = useCallback(() => {
    return {
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
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
      legend: {
        // data: ["K线", "成交额"],
      },
      xAxis: {
        type: "category",
        data: data.kline.map((item) =>
          dayjs(item["日期"]).format("YYYY-MM-DD")
        ),
      },
      yAxis: [
        {
          type: "value",
          name: "成交额",
          // 关联成交量图，最好分开展示
          position: "left",
          axisLabel: {
            fontSize: 10,
            formatter: function (value) {
              return amount.normalToSymbol(value);
            },
          },
        },
        {
          type: "value",
          name: "K线",
          position: "right",
        },
      ],
      grid: [
        {
          left: "5%",
          right: "5%",
          bottom: "18%",
          top: "10%",
          containLabel: true, // 适应屏幕
        },
      ],
      series: [
        {
          name: "K线",
          type: "candlestick",
          data: data.kline.map((item) => [
            item["开盘"],
            item["收盘"],
            item["最低"],
            item["最高"],
          ]),
          yAxisIndex: 1,
          itemStyle: {
            color: "#ef232a",
            color0: "#14b143",
            borderColor: "#ef232a",
            borderColor0: "#14b143",
          },
        },
        {
          name: "成交额",
          type: "bar",
          yAxisIndex: 0,
          data: data.kline.map((item) => item["成交额"]),
          itemStyle: {
            color: "#4b8df8",
          },
        },
      ],
    };
  }, [data.kline]);

  return (
    <div
      className="stock-item-wrap"
      style={{ backgroundColor: data.newestProfitColor }}
    >
      {/* 股票基本数据展示 */}
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

      <div className="stock-info-wrap">
        <div className="mb-2.5 text-[15px] w-1/2 flex justify-start">
          <div className="text-[15px] text-[#333] mr-4">游资</div>{" "}
          {data.tags.length > 0 ? (
            <div className="mb-2.5 text-[15px] flex justify-center">
              {data.tags.map((ele) => {
                return (
                  <span
                    key={ele.name}
                    style={{ color: ele.color }}
                    className="mr-2"
                  >
                    {ele.name}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* 股票事件 */}
      {events.length > 0 ? (
        <div
          className="p-2 my-2 rounded-2xl"
          style={{ backgroundColor: data.eventsColor }}
        >
          <div className="text-[20px] text-[#333] font-semibold	">近一月大事提醒</div>
          {events.map((ele: any) => (
            <div
              key={ele.LEVEL1_CONTENT}
              className="stock-winner-events-wrap mt-2"
            >
              <div className="winner-events-date mr-1 h-5 leading-5 text-stone-700 w-24">
                {ele.NOTICE_DATE}
              </div>
              <div className="events-content ">
                <div
                  className="text-[16px] h-5 leading-5 mb-2	font-medium"
                  style={{ color: eventsMapColor[ele.SPECIFIC_EVENTTYPE] }}
                >
                  {ele.EVENT_TYPE}
                </div>
                {ele.LEVEL1_CONTENT ? (
                  <div className="text-stone-700 text-[14px]">
                    {ele.LEVEL1_CONTENT}
                  </div>
                ) : null}
                {ele.LEVEL2_CONTENT ? (
                  <div className="text-stone-700 text-[14px]">
                    {ele.LEVEL2_CONTENT}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* 归母净利润图表展示 */}
      <div className="h-72 md:w-full custom:w-screen mt-6 flex justify-center">
        <ReactEcharts
          option={getOption()}
          style={{ width: "80%", height: "100%" }}
        />
      </div>
      <div className="h-72 md:w-full custom:w-screen mt-6 flex justify-center">
        <ReactEcharts
          option={getKlineoOption()}
          style={{ width: "80%", height: "100%" }}
        />
      </div>
    </div>
  );
}
