import { RouterProvider } from "react-router-dom";
import { router } from "./route";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockData,
  updateTradeDate,
} from "@/store/features/realtime_stock_market_data/realtime_stock_market_data_slice";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { allInfoApi } from "@/apis";
import dayjs from "dayjs";

export default function App() {
  const dispatch: AppDispatch = useDispatch();

  const tradeDate = useSelector(
    (state: RootState) => state.realtime_stock.tradeDate
  );

  useEffect(() => {
    const now = dayjs();

    const today = now.format("YYYY-MM-DD");

    const afternoonThree = dayjs().hour(15).minute(0).second(0);

    const tradeDateStr = dayjs(tradeDate).format("YYYY-MM-DD");
    // 轮询的间隔时间
    const interval = setInterval(() => {
      dispatch(fetchStockData());

      // 非交易时间或三点之后，清除轮询
      if (today !== tradeDateStr || now.isAfter(afternoonThree)) {
        clearInterval(interval);
      }
    }, 6000);

    // 获取交易时间
    getTradeDate();

    // 清理函数，用于组件卸载时清除轮询
    return () => clearInterval(interval);
  }, []);

  const getTradeDate = async () => {
    const res = await allInfoApi.get_trade_date();
    dispatch(updateTradeDate(res.data));
  };

  return <RouterProvider router={router} />;
}
