import React, { useRef, useEffect, useState } from 'react'
import * as echarts from 'echarts';

export default function Index(props: any) {
  const { data } = props;
  const myChart = useRef(null);

  const echartDom = useRef();

  useEffect(() => {
    const pieData = data.map(ele => ele['涨停原因类别']?.split('+')) || [];
    const transdata = pieData?.flat();


    const dealData = transdata.reduce(function (accumulator: any, currentValue: any) {
      return accumulator[currentValue] ? ++accumulator[currentValue] : accumulator[currentValue] = 1, accumulator
    }, {});

    console.log(dealData, 'dealData')

    const res = Object.entries(dealData)?.map(ele => ({ name: ele[0], value: ele[1] })).sort((a, b) => b.value - a.value).slice(0, 10);

    const option = {
      title: {
        text: '涨停板块分析',
        subtext: '板块数量分部',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: res,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.current = echarts.init(echartDom.current);
    myChart.current?.setOption(option);
  }, [data])

  return (
    <div>
      <div ref={echartDom} style={{ minHeight: "300px", width: "600px", marginTop: "10px" }}></div>
    </div>
  )
}