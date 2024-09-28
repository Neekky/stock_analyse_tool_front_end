import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  winnersData: any[];
  winnersRealtimeList: any[];
  finishCount: number;
  hasUpdateRealTimeStock: {
    [key: string]: boolean
  };
}

const initialState: CounterState = {
  winnersData: [], // 龙虎榜涨停数据
  winnersRealtimeList: [], // 最新交易日的实时数据
  finishCount: 0,
  hasUpdateRealTimeStock: {}, // 记录已更新过实时数据的股票
};

const counterSlice = createSlice({
  name: "winners_data",
  initialState,
  reducers: {
    // 刷新龙虎榜数据
    refreshData(state) {
      state.winnersData = [];
      state.finishCount = 0;
      state.hasUpdateRealTimeStock = {};
    },

    updateWinnersRealtimeList(state, action: PayloadAction<any>) {
      if (state.hasUpdateRealTimeStock[action.payload.code]) return

      // 更新过的代码，加缓存
      state.hasUpdateRealTimeStock[action.payload.code] = true;

      // 加入新值
      state.winnersRealtimeList.push(action.payload)
    },
 
  },
});

export const {
  refreshData,
  updateWinnersRealtimeList
} = counterSlice.actions;
export default counterSlice.reducer;
