import { RouterProvider } from "react-router-dom";
import { router } from "./route";
import { useDispatch } from "react-redux";
import { fetchStockData } from "@/store/features/realtime_stock_market_data/realtime_stock_market_data_slice";
import { useEffect } from "react";
import { AppDispatch } from "@/store/store";

export default function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // 轮询的间隔时间
    const interval = setInterval(() => {
      dispatch(fetchStockData());
    }, 3000);

    // 清理函数，用于组件卸载时清除轮询
    return () => clearInterval(interval);
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
