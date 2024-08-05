import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import HotPlateRank from "./components/hot-plate-rank";
import HotPlateStockList from "./components/hot_plate_stock_list";
import "./index.less";
import { allInfoApi } from "@/apis";

export default function Index(): any {
  const [pid, setPid] = useState("");

  const [allStockData, setAllStockData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStockData();
  }, []);

  const getAllStockData = async () => {
    const res = await allInfoApi.get_all_stock_data();
    if (res.code === 200) {
      const data = JSON.parse(res.data);
      setAllStockData(data);
      setPid(data[0].code);
    }
    setLoading(false);
  };

  return (
    <div className="leading-trend-wrapper">
      {/* {contextHolder} */}
      {/* 上层 */}
      {loading ? (
        <div className="loading-wrap">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="operate-btns">
            <Button className="opt-btn">热点概览</Button>
            <Button className="opt-btn">龙头搜集</Button>
          </div>
          <div className="trend-top">
            {/* 今日热点板块 */}
            <HotPlateRank setPid={setPid} />

            {/* 热点板块龙头股，夹带自我排名 */}
            <HotPlateStockList allStockData={allStockData} id={pid} />
          </div>

          {/* 中层 */}
          <div>{/* 股票走势 */}</div>
        </>
      )}
    </div>
  );
}
