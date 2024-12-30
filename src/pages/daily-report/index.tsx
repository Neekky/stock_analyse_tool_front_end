import { useSelector } from "react-redux";
import Header from "./components/header";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { allInfoApi, stockklineApi, thirdPartyApi } from "@/apis";
import { getCurrentTrendStreak } from "./model/utils";
import "./index.less";
import dayjs from "dayjs";

// 添加类型定义
interface PlateData {
  code: string;
  name: string;
  // 添加其他需要的属性
}

export default function DailyReport() {
  // 市场实时涨跌家数行情
  const market_situation = useSelector(
    (state: RootState) => state.realtime_stock.stock_market_situation
  );

  // 获取交易日期
  const tradeDate = useSelector(
    (state: RootState) => state.realtime_stock.tradeDate
  );

  const [trendData, setTrendData] = useState<any>({});

  const [highPerformeData, setHighPerformeData] = useState<any>([]);

  // 当日热点板块
  const [hotPlateData, setHotPlateData] = useState<any>([]);

  // 今日前三资金流入板块
  const [topThreeInflowPlates, setTopThreeInflowPlates] = useState<any>([]);

  const [recentHotBlock, setRecentHotBlock] = useState<any>([]);

  useEffect(() => {
    getTrend();
    getTwoDayCompare(dayjs(tradeDate));
    getHotPlate();
    getTopThreeInflowPlates();
    getRecentHotBlock();
  }, []);

  // 获取涨跌数据
  const getTrend = async () => {
    const res: any = await stockklineApi.get_upward_and_downward_trend();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      const trend = getCurrentTrendStreak(parseData);
      setTrendData(trend);
    }
  };

  // 获取高位连板股
  const getTwoDayCompare = async (date) => {
    const dateStr = dayjs(date).format("YYYYMMDD");
    const res = await thirdPartyApi.getLimitTowDayCompare(dateStr);
    if (res.status_msg === "success") {
      const highPerforme = res.data.board_list.filter(
        (ele) => ele.today_board > 4 && ele.today_list?.length > 0
      );
      setHighPerformeData(highPerforme);
    }
  };

  // 获取当日最新的热点板块
  const getHotPlate = async () => {
    try {
      const res = await thirdPartyApi.getHotPlateData();
      if (res?.status_msg !== "success" || !res?.data?.plate_list?.length) {
        console.warn("获取热点板块数据失败或数据为空");
        return;
      }

      const topThreePlates = res.data.plate_list.slice(0, 3);

      // 请求热门板块下的龙头股
      const plateDetailsPromises = topThreePlates.map(async (plate: PlateData) => {
        try {
          const detail = await allInfoApi.get_hot_plate_stock_data(plate.code);
          return {
            plate_code: plate.code,
            plate_name: plate.name,
            stocks: detail?.data || []
          };
        } catch (error) {
          console.error(`获取板块 ${plate.name} 详情失败:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(plateDetailsPromises);

      // 取出结果
      const plateDetails = results
        .map(result =>
          result.status === 'fulfilled' && result.value ? result.value : null
        )
        .filter(Boolean);

      // 更新状态（假设你需要存储板块详情）
      if (plateDetails.length > 0) {
        const copyHotPlateData = [...topThreePlates];
        // 将数据根据plate.code，塞到hotPlateData中
        plateDetails.forEach(ele => {
          const index = copyHotPlateData.findIndex(item => item.code === ele.plate_code);
          if (index !== -1) {
            copyHotPlateData[index].stocks = ele.stocks;
          }
        });

        setHotPlateData(copyHotPlateData);
      }
    } catch (error) {
      console.error("获取热点板块数据失败:", error);
      // 可以添加错误状态管理
      setHotPlateData([]);
    }
  };

  // 获取今日前三资金流入板块
  const getTopThreeInflowPlates = async () => {
    try {
      const originresult = await thirdPartyApi.get_inflow_plate_data();
      const res = originresult.data;

      // 如果获取失败，或者数据为空，则终止
      if (res?.status_msg !== 'ok' || !res?.data?.data_list?.length) {
        console.warn('获取前三资金流入板块数据失败或数据为空');
        return;
      }

      // 获取前三资金流入板块
      const topThreeInflowPlates = res.data.data_list.slice(0, 3);
      console.log(topThreeInflowPlates, '查看明细');
      // 获取板块下的龙头股
      const plateDetailsPromises = topThreeInflowPlates.map(async (plate) => {
        try {
          const plateCode = plate.code;

          const detail = await allInfoApi.get_hot_plate_stock_data(plateCode);

          return {
            plate_code: plateCode,
            plate_name: plate.name,
            stocks: detail?.data || []
          };
        } catch (error) {
          console.error(`获取板块 ${plate.name} 详情失败:`, error);
          return null;
        }
      });
      const results = await Promise.allSettled(plateDetailsPromises);

      // 取出结果
      const plateDetails = results
        .map(result =>
          result.status === 'fulfilled' && result.value ? result.value : null
        )
        .filter(Boolean);

      // 将数据根据plateCode，塞到topThreeInflowPlates中
      if (plateDetails.length > 0) {
        const copyTopThreeInflowPlates = [...topThreeInflowPlates];
        plateDetails.forEach(ele => {
          const index = copyTopThreeInflowPlates.findIndex(item => item.name === ele.plate_name);
          if (index !== -1) {
            copyTopThreeInflowPlates[index].stocks = ele.stocks;
          }
        });
        setTopThreeInflowPlates(copyTopThreeInflowPlates);
      }
    } catch (error) {
      console.error("获取前三资金流入板块数据失败:", error);
    }
  }

  // 获取今日的涨幅排名板块
  const getRecentHotBlock = async () => {
    try {
      const originresult = await thirdPartyApi.getZFPlateData();
      const res = originresult.data;
      if (res?.status_msg !== 'ok' || !res?.data?.data_list?.length) {
        console.warn('获取今日的涨幅排名板块数据失败或数据为空');
        return;
      }
      const recentHotBlock = res.data.data_list.slice(0, 3);
      // 获取板块下的龙头股
      const plateDetailsPromises = recentHotBlock.map(async (plate) => {
        const plateCode = plate.code;
        const detail = await allInfoApi.get_hot_plate_stock_data(plateCode);
        return {
          plate_code: plateCode,
          plate_name: plate.name,
          stocks: detail?.data || []
        };
      });

      const results = await Promise.allSettled(plateDetailsPromises);

      // 取出结果
      const plateDetails = results
        .map(result =>
          result.status === 'fulfilled' && result.value ? result.value : null
        )
        .filter(Boolean);

      if (plateDetails.length > 0) {
        const copyRecentHotBlock = [...recentHotBlock];
        plateDetails.forEach(ele => {
          const index = copyRecentHotBlock.findIndex(item => item.code === ele.plate_code);
          if (index !== -1) {
            copyRecentHotBlock[index].stocks = ele.stocks;
          }
        });
        setRecentHotBlock(copyRecentHotBlock);
      }

    } catch (error) {
      console.error("获取今日的涨幅排名板块数据失败:", error);
    }
  }

  return (
    <div className="w-full flex items-center flex-col absolute">
      <Header />

      <div className="content-wrap">
        {/* 大盘基本情况分析 */}
        <p className="text-lg">
          今日大盘，上涨家数
          <span className="text-red-600 mx-2">
            {market_situation?.up_count}
          </span>
          家，下跌家数
          <span className="text-green-600 mx-2">
            {market_situation?.down_count}
          </span>
          家。 当前{" "}
          <span
            className={`${trendData?.trend === "涨家数更多"
              ? "text-red-600"
              : "text-green-600"
              }`}
          >
            {`${trendData?.trend} `}
          </span>
          ，连续{trendData?.trend?.slice(0, 1)} {trendData?.count} 天。
          {/* 如果下跌家数大于4500，提示机会文案 */}
          {market_situation?.down_count > 4500 ? <span className="text-lg text-red-600">
            今日下跌家数超过4500，短线涨停板模式存在机会！可同时观察是否连续下跌多天，近期成交量是否高于万亿。
          </span> : ""}
        </p>



        {highPerformeData?.length > 0 ? (
          <p className="text-xl my-3">
            当前市场最高板 {highPerformeData[0].today_board} 板
          </p>
        ) : <p className="text-xl my-3">当前市场最高板未超过4板</p>}

        <div className="text-lg">
          {highPerformeData?.map((ele) => (
            <div className="high-p-stock-wrap text-lg mt-2" key={ele.today_board}>
              <div className="mr-2">
                <span className="text-red-600 mr-2">{ele?.today_board}</span>板股：
              </div>
              {ele?.today_list?.map((stock) => (
                <div key={stock.stock_name} className="mr-4">
                  <span className="text-zinc-600">{stock.stock_name}</span>
                  <span className="ml-2 text-red-600">
                    {Number(stock.rate).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 今日前三热点板块，及其龙头个股 */}
        {hotPlateData?.length > 0 ? (
          <div className="text-lg mt-2">
            今日前三热点板块，及其龙头个股：
            {hotPlateData?.map((ele) => (
              <div className="flex flex-row mt-2" key={ele.name}>
                <div className="text-zinc-600 mr-2">{ele.name}：</div>
                <div className="flex flex-row">
                  {ele?.stocks?.lead?.map((stock) => (
                    <div key={stock.stockName} className="text-zinc-600 mr-2">
                      {stock.stockName}
                      <span className="mx-2 text-red-600">{stock?.days || `人气龙头${stock?.lead}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* 今日前三资金流入板块 */}
        {topThreeInflowPlates?.length > 0 ? (
          <div className="text-lg mt-2">
            今日前三资金流入板块：
            {topThreeInflowPlates?.map((ele) => (
              <div className="flex flex-row mt-2" key={ele.code}>
                <div className="text-zinc-600 mr-2">{ele.name}：</div>
                <div className="flex flex-row">
                  {ele?.stocks?.lead?.map((stock) => (
                    <div key={stock.stockName} className="text-zinc-600 mr-2">
                      {stock.stockName}
                      <span className="mx-2 text-red-600">{stock?.days || `人气龙头${stock?.lead}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* 今日的涨幅排名板块 */}
        {recentHotBlock?.length > 0 ? (
          <div className="text-lg mt-2">
            今日的涨幅前三板块：
            {recentHotBlock?.map((ele) => (
              <div className="flex flex-row mt-2" key={ele.code}>
                <div className="text-zinc-600 mr-2">{ele.name}：</div>
                <div className="flex flex-row">
                  {ele?.stocks?.lead?.map((stock) => (
                    <div key={stock.stockName} className="text-zinc-600 mr-2">
                      {stock.stockName}
                      <span className="mx-2 text-red-600">{stock?.days || `人气龙头${stock?.lead}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
