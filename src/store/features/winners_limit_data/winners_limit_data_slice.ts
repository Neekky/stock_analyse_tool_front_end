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

    updateWinnersData(state, action: PayloadAction<any>) {
      // winnersData没数据时，才更新数据，处理useEffect的两次调用逻辑，或者定义了更新
      if (state.winnersData.length <= 0) {
        // 更新数据
        state.winnersData = action.payload.data;
      }

      // 强制重新赋值
      if (action.payload?.isUpdate) {
        state.winnersData = action.payload.data;
      }
    },

    updateDataByCode(
      state,
      action: PayloadAction<{
        data: any;
        code: string;
      }>
    ) {
      // 根据股票代码更新对应股票的财务数据
      const stockItemIndex = state.winnersData.findIndex(
        (item) => item.stock_code === action.payload.code
      );

      if (stockItemIndex !== -1) {
        state.winnersData[stockItemIndex] = {
          ...state.winnersData[stockItemIndex],
          financialData: action.payload.data,
        };
      }
    },

    finishCountIncrease(state) {
      state.finishCount += 1;
    },
  },
});

export const {
  updateWinnersData,
  updateDataByCode,
  finishCountIncrease,
  refreshData,
  updateWinnersRealtimeList
} = counterSlice.actions;
export default counterSlice.reducer;
