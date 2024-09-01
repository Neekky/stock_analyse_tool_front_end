import { useEffect, useState } from "react";
import Header from "./components/header";
import IndexCompilations from "./components/index-compilations";
import SubIndexCompilations from "./components/sub-index-compilations";
import { allInfoApi } from "@/apis";
import { INDEX_NAME_MAP } from "@/utils/common";
import './index.less';

export default function Index() {
  // 多指数数据
  const [indexData, setIndexData] = useState<any[]>([]);

  useEffect(() => {
    const indexList = [
      "sh000001",
      "sz399001",
      "sz399006",
      "sh000016",
      "sh000300",
      "sh000905",
      "sh000852",
    ];
    const fetchData = async () => {
      // 创建请求数组
      const requests = indexList.map((index) => getIndexStatusData(index));

      try {
        // 等待所有请求都完成
        const responses = await Promise.all(requests);

        // 提取结果
        const data = responses.map((response) => response);
        const filteredData = data.filter((item) => item !== null);
        setIndexData(filteredData);
        // 在这里可以继续执行后续的操作
        console.log("所有请求完成", responses, filteredData);
      } catch (error) {
        console.error("请求失败:", error);
      }
    };

    fetchData();
  }, []);

  const getIndexStatusData = async (index) => {
    try {
      const res = await allInfoApi.get_status_of_index(index);
      if (res.code === 200) {
        // 复制一份res.data
        const copyData = { ...res.data };

        // 是否见顶或见底
        copyData.isTopOrBottom =
          res.data?.["反转数据"]?.score > 0 ? "见顶" : "见底";

        // 字体动态颜色
        copyData.scoreColor =
          res.data?.["最新涨跌幅"] > 0 ? "#f46649" : "#2aa491";

        // 指数名称
        copyData.indexName = INDEX_NAME_MAP[res.data.index];

        copyData.upDaysColor =
          res.data?.consecutive_up_days > 0 ? "#f46649" : "#2aa491";
        return copyData;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };
  return (
    <div className="relative hero-home-wrap mx-auto bg-[#eaecf1]">
      <Header />
      <IndexCompilations ago={2250} indexData={indexData[0]} />
      <div className="sub-index-warp">
        {indexData.slice(1).map((ele, index) => (
          <SubIndexCompilations key={index} indexData={ele} />
        ))}
      </div>
    </div>
  );
}
