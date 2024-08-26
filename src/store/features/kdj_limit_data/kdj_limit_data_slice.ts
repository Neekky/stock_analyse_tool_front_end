import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  kdjLimitData: any[];
  finishCount: number;
}

const initialState: CounterState = {
  kdjLimitData: [],
  finishCount: 0,
};

const counterSlice = createSlice({
  name: "kdj_limit_data",
  initialState,
  reducers: {
    updateData(state, action: PayloadAction<any>) {
      // kdjLimitData没数据时，才更新数据，处理useEffect的两次调用逻辑，或者定义了更新
      if (state.kdjLimitData.length <= 0) {
        // 更新数据
        state.kdjLimitData = action.payload.data;
      }
      if (state.kdjLimitData.length > 0 && action.payload?.isUpdate) {
        state.kdjLimitData = action.payload.data;
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
  },
});

export const { updateData, updateDataByCode, finishCountIncrease } =
  counterSlice.actions;
export default counterSlice.reducer;
