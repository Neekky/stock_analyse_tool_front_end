import { allInfoApi } from "@/apis";
import { useEffect, useState } from "react";
import StockItem from "./components/stockItem";

export default function Index() {
  const [wcData, setWcData] = useState<any[]>([]);

  useEffect(() => {
    get_wencai_data();
  }, []);

  const get_wencai_data = async () => {
    const res = await allInfoApi.get_wencai_data("kdj金叉几天内有涨停");
    if (res.code === 200) {
      console.log(res.data, 12313);
      setWcData(res.data);
      const stockCode: string = res.data[0].code;
      get_profit_data(stockCode, stockCode.startsWith("6") ? "17" : "33");
    }
  };

  const get_profit_data = async (stockCode: string, marketId: string) => {
    const res = await allInfoApi.get_profit_data(stockCode, marketId);
    console.log(res, "同花顺");
  };

  return (
    <div>
      {wcData.map((ele) => (
        <StockItem key={ele.code} data={ele} />
      ))}
    </div>
  );
}
