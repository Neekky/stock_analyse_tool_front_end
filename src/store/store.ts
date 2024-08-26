import { configureStore } from '@reduxjs/toolkit';

// 导入你的 reducer
import kdj_limit_data_reducer from './features/kdj_limit_data/kdj_limit_data_slice';

const store = configureStore({
  reducer: {
    kdj_limit: kdj_limit_data_reducer,
    // 添加其他的 reducer
  },
});

export default store;

// 推断 RootState 和 AppDispatch 的类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
