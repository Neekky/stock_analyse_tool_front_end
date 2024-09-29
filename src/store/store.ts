import { configureStore } from '@reduxjs/toolkit';

// 导入你的 reducer
import realtime_stock_market_data_slice from './features/realtime_stock_market_data/realtime_stock_market_data_slice';

const store = configureStore({
  reducer: {
    realtime_stock: realtime_stock_market_data_slice,
    // 添加其他的 reducer
  },
});

export default store;

// 推断 RootState 和 AppDispatch 的类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
