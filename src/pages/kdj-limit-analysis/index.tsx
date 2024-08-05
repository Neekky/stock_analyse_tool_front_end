import { allInfoApi } from "@/apis";
import { useEffect, useState } from "react";

export default function Index() {
  const [wcData, setWcData] = useState([]);

  useEffect(() => {
    get_wencai_data();
  }, []);

  const get_wencai_data = async () => {
    const res = await allInfoApi.get_wencai_data("kdj金叉几天内有涨停，无质押");
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

  return <div>{}</div>;
}
