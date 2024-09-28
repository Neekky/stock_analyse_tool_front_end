import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  kdjLimitData: any[];
  leadingLimitData: any[];
  finishCount: number;
  leadingFinishCount: number;
  hasUpdateKDJStock: {
    [key: string]: boolean;
  };
  hasUpdateLeadingStock: {
    [key: string]: boolean;
  };
}

const initialState: CounterState = {
  kdjLimitData: [], // kdj涨停数据
  leadingLimitData: [], // 龙头涨停数据
  finishCount: 0,
  leadingFinishCount: 0,
  hasUpdateKDJStock: {},
  hasUpdateLeadingStock: {},
};

const counterSlice = createSlice({
  name: "kdj_limit_data",
  initialState,
  reducers: {
    // 刷新KDJ涨停数据
    refreshData(state) {
      console.log("执行几次")
      state.kdjLimitData = [];
      state.finishCount = 0;
      state.hasUpdateKDJStock = {};
    },

    // 刷新数据
    refreshLeadingData(state) {
      state.leadingLimitData = [];
      state.leadingFinishCount = 0;
      state.hasUpdateLeadingStock = {};
    },


  },
});

export const {
  refreshData,
  refreshLeadingData,
} = counterSlice.actions;
export default counterSlice.reducer;
