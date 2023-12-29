import { useRef, useEffect } from 'react'
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { dataConversion } from "@/utils";

export default function Index(props: any) {
  const { data } = props;

  // 用于保存 echart 实例的 ref
  const echartInstanceRef = useRef<EChartsType | null>(null);
  // 创建一个 ref 来引用 div 元素
  const echartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pieData = data.map(ele => ele['涨停原因类别']?.split('+')) || [];
    const transdata = pieData?.flat();

    // const dealData = transdata.reduce(function (accumulator: any, currentValue: any) {
    //   return accumulator[currentValue] ? ++accumulator[currentValue] : accumulator[currentValue] = 1, accumulator
    // }, {});

    const dealData = dataConversion.countSubWordsWithMapping(transdata);

    const res = dealData.map(ele => ({
      name: ele.word,
      value: ele.count
    }))

    // const res = Object.entries(dealData)?.map(ele => ({ name: ele[0], value: ele[1] })).sort((a: any, b: any) => b.value - a.value).slice(0, 10);

    const option: any = {
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
    if (echartDivRef.current) {
      echartInstanceRef.current = echarts.init(echartDivRef.current);
      echartInstanceRef.current?.setOption(option);
    }

    return () => {
      echartInstanceRef.current?.dispose();
    }
  }, [data])

  return (
    <div>
      <div ref={echartDivRef} style={{ minHeight: "300px", width: "600px", marginTop: "10px" }}></div>
    </div>
  )
}
