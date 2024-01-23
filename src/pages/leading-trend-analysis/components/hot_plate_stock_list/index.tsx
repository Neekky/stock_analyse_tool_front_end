import { allInfoApi } from "@/apis";
import { useEffect, useState } from "react";
import "./index.less";

const HotPlateStockList = (props: any) => {
  const { id, allStockData } = props;

  const [plateData, setPlateData] = useState([]);

  useEffect(() => {
    console.log(id, 'id变化');
    get_hot_plate_stock_data(id);
  }, [id, allStockData.length]);

  // 获取热点板块龙头股
  const get_hot_plate_stock_data = async (pid: string) => {
    const res = await allInfoApi.get_hot_plate_stock_data(pid);
    console.log(res, '热点板块龙头股')
    if (res.code === 200) {
      console.log(res);
      const data = res.data;
      const finalNormalData = data.normal.map((ele: any) => {
        const stock = allStockData.find(
          (item: any) => item["代码"] === ele.stockCode
        );
        return {
          ...ele,
          ...stock,
        };
      });
      setPlateData(finalNormalData);
    }
  };

  return <div className="hot-plate-stock-wrap">
    <div className="title">热点板块龙头股</div>
    <div className="stock-list-wrap">
      {plateData.map((ele: any) => {
        return (
          <div className="stock-item" key={ele.stockCode + ele?.upTimes + ele?.tag}>
            <div className="item-name">{ele?.['名称']}</div>
            <div className="item-code">{ele?.stockCode}</div>
            <div className="item-price">{ele.price}</div>
            <div className="item-rate">{ele.rate}</div>
          </div>
        );
      })}
    </div>
  </div>;
};

export default HotPlateStockList;
