import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { EChartsType } from "echarts";
import { dataConversion } from "@/utils";

export default function Index(props: any) {
  const { data } = props;

  // 用于保存 echart 实例的 ref
  const echartInstanceRef = useRef<EChartsType | null>(null);
  // 创建一个 ref 来引用 div 元素
  const echartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pieData = data;
    if (data[0]?.["涨停原因类别"]) {
      pieData = data?.map((ele) => ele?.["涨停原因类别"]?.split("+")) || [];
    }

    // 过滤掉包含ST的、为其它的数据
    const transdata = pieData
      ?.flat()
      .filter((info) => info?.indexOf("ST") === -1)
      .filter((info) => info !== '其它')
      .sort((a: any, b: any) => a?.length - b?.length);

    const dealData = dataConversion
      .countSubWordsWithMapping(transdata)
      .slice(0, 10);

    const res = dealData.map((ele) => ({
      name: ele.word,
      value: ele.count,
    }));

    const option: any = {
      title: {
        text: "涨停板块分析",
        subtext: "板块数量分部",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: res,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    if (echartDivRef.current) {
      echartInstanceRef.current = echarts.init(echartDivRef.current);
      echartInstanceRef.current?.setOption(option);
    }

    return () => {
      echartInstanceRef.current?.dispose();
    };
  }, [data]);

  return (
    <div>
      <div
        ref={echartDivRef}
        style={{ minHeight: "300px", width: "600px", marginTop: "10px" }}
      ></div>
    </div>
  );
}
