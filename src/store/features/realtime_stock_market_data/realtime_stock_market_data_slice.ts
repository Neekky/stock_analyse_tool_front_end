// features/stockSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { stockklineApi } from "@/apis";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

/**
 * 异步获取实时股票市场数据
 *
 * @returns {Promise<any>} 返回一个 Promise，解析为股票数据响应对象
 *
 * @example
 * const dispatch = useDispatch();
 * dispatch(fetchStockData()).then(response => {
 *   console.log(response);
 * });
 */
export const fetchStockData = createAsyncThunk<any, void>(
  "realtime_stock_market/fetchData",
  async () => {
    let response: any[] = await stockklineApi.stockZhASpotEm(); // 假设这是你的函数

    // 过滤退市股
    response = response.filter((ele) => ele["今开"] > 0);

    // 计算股市的上涨下跌家数
    let up_count = 0;
    let down_count = 0;
    let flat_count = 0;

    // 计算涨跌分布
    let negTen = 0;
    let negSeven = 0;
    let negFive = 0;
    let negThree = 0;
    let negThreeInner = 0;
    let zero = 0;
    let threeInner = 0;
    let three = 0;
    let five = 0;
    let seven = 0;
    let ten = 0;

    response.forEach((stock) => {
      // 计算股市的上涨下跌家数
      const change = stock["涨跌幅"];

      if (change > 0) {
        up_count += 1;
      } else if (change < 0) {
        down_count += 1;
      } else {
        flat_count += 1;
      }

      // 计算涨跌分布

      if (change > 10) {
        ten += 1;
      } else if (change > 7) {
        seven += 1;
      } else if (change > 5) {
        five += 1;
      } else if (change > 3) {
        three += 1;
      } else if (change > 0) {
        threeInner += 1;
      } else if (change === 0) {
        zero += 1;
      } else if (change > -3) {
        negThreeInner += 1;
      } else if (change > -5) {
        negThree += 1;
      } else if (change > -7) {
        negFive += 1;
      } else if (change > -10) {
        negSeven += 1;
      } else {
        negTen += 1;
      }
    });

    const rise_fall_distribution = {
      negTen,
      negSeven,
      negFive,
      negThree,
      negThreeInner,
      zero,
      threeInner,
      three,
      five,
      seven,
      ten,
    };

    const stock_market_situation = {
      up_count,
      down_count,
      flat_count,
    };
    return {
      data: response,
      stock_market_situation,
      rise_fall_distribution,
    };
  }
);

// 定义 State 的类型
interface StockState {
  data: any | null; // 这里可以根据实际的数据类型进行修改
  loading: boolean;
  error: string | null | undefined;
  stock_market_situation: {
    up_count: number;
    down_count: number;
    flat_count: number;
  };
  rise_fall_distribution: {
    negTen: number;
    negSeven: number;
    negFive: number;
    negThree: number;
    negThreeInner: number;
    zero: number;
    threeInner: number;
    three: number;
    five: number;
    seven: number;
    ten: number;
  };
  tradeDate: string;
}

// 创建初始状态
const initialState: StockState = {
  data: null,
  stock_market_situation: {
    up_count: 0,
    down_count: 0,
    flat_count: 0,
  },
  rise_fall_distribution: {
    negTen: 0,
    negSeven: 0,
    negFive: 0,
    negThree: 0,
    negThreeInner: 0,
    zero: 0,
    threeInner: 0,
    three: 0,
    five: 0,
    seven: 0,
    ten: 0,
  },
  loading: false,
  error: null,
  tradeDate: dayjs().valueOf(),
};

// 创建 stockSlice
const stockSlice = createSlice({
  name: "realtime_stock_market", // Slice 的名称
  initialState, // 设置初始状态
  reducers: {
    updateTradeDate(state, action: PayloadAction<any>) {
      state.tradeDate = action.payload;
    },
  }, // 这里可以添加同步 reducer
  extraReducers: (builder) => {
    builder
      // 当 fetchStockData 处于 pending 状态时，设置 loading 为 true
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
      })
      // 当 fetchStockData 完成（fulfilled）时，更新状态为加载完成，保存数据
      .addCase(
        fetchStockData.fulfilled,
        (state, action: PayloadAction<any>) => {
          // action.payload 是获取到的数据
          state.loading = false;
          state.data = action.payload.data;
          state.stock_market_situation = action.payload.stock_market_situation;
          state.rise_fall_distribution = action.payload.rise_fall_distribution;
        }
      )
      // 当 fetchStockData 被拒绝（rejected）时，记录错误信息
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // 记录错误信息
      });
  },
});
export const { updateTradeDate } = stockSlice.actions;
export default stockSlice.reducer;
