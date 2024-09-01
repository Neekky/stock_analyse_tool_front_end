import { RootState } from '@/store/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ReactEcharts from "echarts-for-react";

export default function Index() {
  // 市场实时涨跌家数行情
  const market_situation = useSelector(
    (state: RootState) => state.realtime_stock.stock_market_situation
  );

  // 市场实时涨跌分布
  const distribution = useSelector(
    (state: RootState) => state.realtime_stock.rise_fall_distribution
  );
  
      // 配置图表的选项
  const getOption = useCallback(
    () => ({
      animation: true,
      tooltip: {
        trigger: "axis",
        showContent: false,
      },
      xAxis: {
        type: "category",
        data: [
          ">10%",
          "10~7",
          "7~5",
          "5~3",
          "3~0",
          "0",
          "0~3",
          "3~5",
          "5~7",
          "7~10",
          ">10%",
        ],
        axisTick: {
          show: false, // 隐藏Y轴刻度
        },
      },
      yAxis: {
        show: false, // 隐藏整个Y轴
        axisLine: {
          show: false, // 隐藏Y轴线
        },
        axisTick: {
          show: false, // 隐藏Y轴刻度
        },
        axisLabel: {
          show: false, // 隐藏Y轴标签
        },
        splitLine: {
          show: false, // 隐藏分割线
        },
      },
      grid: { top: "45%" },
      title: { text: '大盘实时涨跌分布', top: '5%', left: 'center' },
      series: [
        {
          data: [
            {
              value: distribution.negTen,
              itemStyle: {
                color: "#2aa491",
              },
            },
            {
              value: distribution.negSeven,
              itemStyle: {
                color: "#2aa491",
              },
            },
            {
              value: distribution.negFive,
              itemStyle: {
                color: "#2aa491",
              },
            },
            {
              value: distribution.negThree,
              itemStyle: {
                color: "#2aa491",
              },
            },
            {
              value: distribution.negThreeInner,
              itemStyle: {
                color: "#2aa491",
              },
            },
            {
              value: distribution.zero,
              itemStyle: {
                color: "#a3a3a3",
              },
            },
            {
              value: distribution.threeInner,
              itemStyle: {
                color: "#f46649",
              },
            },
            {
              value: distribution.three,
              itemStyle: {
                color: "#f46649",
              },
            },
            {
              value: distribution.five,
              itemStyle: {
                color: "#f46649",
              },
            },
            {
              value: distribution.seven,
              itemStyle: {
                color: "#f46649",
              },
            },
            {
              value: distribution.ten,
              itemStyle: {
                color: "#f46649",
              },
            },
          ],
          label: {
            show: true,
            position: "top",
          },
          type: "bar",
        },
        {
          name: "Access From",
          type: "pie",
          center: ["80%", "25%"],
          radius: [0, "42%"],
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            position: "inner",
            show: true,
            fontSize: 12,
            formatter: (params) => params.data.name + params.data.value,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: market_situation.up_count,
              name: "涨家数",
              itemStyle: {
                color: "#f46649",
              },
            },
            {
              value: market_situation.down_count,
              name: "跌家数",
              itemStyle: {
                color: "#2aa491",
              },
            },
            {
              value: market_situation.flat_count,
              name: "平盘数",
              itemStyle: {
                color: "#a3a3a3",
              },
            },
          ],
        },
      ],
    }),
    [distribution, market_situation]
  );
  return (
    <div className="h-96 w-full">
    <ReactEcharts
      option={getOption()}
      style={{ width: "100%", height: "100%" }}
    />
  </div>

  )
}
