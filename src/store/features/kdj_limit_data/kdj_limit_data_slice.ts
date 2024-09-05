import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  kdjLimitData: any[];
  leadingLimitData: any[];
  finishCount: number;
  leadingFinishCount: number;
}

const initialState: CounterState = {
  kdjLimitData: [], // kdj涨停数据
  leadingLimitData: [], // 龙头涨停数据
  finishCount: 0,
  leadingFinishCount: 0,
};

const counterSlice = createSlice({
  name: "kdj_limit_data",
  initialState,
  reducers: {
    // 刷新KDJ涨停数据
    refreshData(state) {
      state.kdjLimitData = [];
      state.finishCount = 0;
    },

    // 刷新数据
    refreshLeadingData(state) {
      state.leadingLimitData = [];
      state.leadingFinishCount = 0;
    },
    updateKdjData(state, action: PayloadAction<any>) {
      // kdjLimitData没数据时，才更新数据，处理useEffect的两次调用逻辑，或者定义了更新
      if (state.kdjLimitData.length <= 0) {
        // 更新数据
        state.kdjLimitData = action.payload.data;
      }

      // 强制重新赋值
      if (action.payload?.isUpdate) {
        state.kdjLimitData = action.payload.data;
      }
    },
    // 更新概念龙头涨停板数据
    updateLeadingData(state, action: PayloadAction<any>) {
      // leadingLimitData没数据时，才更新数据，处理useEffect的两次调用逻辑，或者定义了更新
      if (state.leadingLimitData.length <= 0) {
        // 更新数据
        state.leadingLimitData = action.payload.data;
      }

      // 强制重新赋值
      if (action.payload?.isUpdate) {
        state.leadingLimitData = action.payload.data;
      }
    },

    // 更新概念龙头的财务数据
    updateLeadingProfitDataByCode(
      state,
      action: PayloadAction<{
        data: any;
        code: number;
      }>
    ) {
      // 根据股票代码更新对应股票的财务数据
      const stockItemIndex = state.leadingLimitData.findIndex(
        (item) => item.code === action.payload.code
      );

      if (stockItemIndex !== -1) {
        state.leadingLimitData[stockItemIndex] = {
          ...state.leadingLimitData[stockItemIndex],
          financialData: action.payload.data,
        };
      }
    },

    updateDataByCode(
      state,
      action: PayloadAction<{
        data: any;
        code: number;
      }>
    ) {
      // 根据股票代码更新对应股票的财务数据
      const stockItemIndex = state.kdjLimitData.findIndex(
        (item) => item.code === action.payload.code
      );

      if (stockItemIndex !== -1) {
        state.kdjLimitData[stockItemIndex] = {
          ...state.kdjLimitData[stockItemIndex],
          financialData: action.payload.data,
        };
      }
    },

    finishCountIncrease(state) {
      state.finishCount += 1;
    },

    leadingFinishCountIncrease(state) {
      state.leadingFinishCount += 1;
    },
  },
});

export const {
  updateKdjData,
  updateLeadingData,
  updateLeadingProfitDataByCode,
  updateDataByCode,
  finishCountIncrease,
  leadingFinishCountIncrease,
  refreshData,
  refreshLeadingData,
} = counterSlice.actions;
export default counterSlice.reducer;
