import Header from "./components/header";
import RealtimeMarket from "./components/realtime-market";
import EtfCompilations from "./components/etf-compilations";
import "./index.less";
import { useEffect, useState } from "react";
import { stockklineApi } from "@/apis";
import UpDownTrend from "./components/up-down-trend";
import MarketScore from "./components/market-score";
import { safeJsonParse } from "@/utils/common";

export default function Index() {
  const [trendData, setTrendData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);

  // 指数K线开高收低数据
  const [indexKline, setIndexKline] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      get_qkj_market_score(),
      getTrend(),
      get_qkj_market_volume(),
      getIndexKLine()
    ]);
    getTrend();
  }, []);

  // 获取上证指数数据
  const getIndexKLine = async () => {
    // 获取当前时间的60天之前日期
    const res = await stockklineApi.getIndexKLine({
      startDate: '2024-07-26',
      index: 'sh000001',
    });
    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      const times: string[] = [];
      // 处理K线数据，按照[开盘价, 收盘价, 最低价, 最高价]的顺序。
      const kdata = data.map((ele) => {
        const { open, close, low, high, candle_end_time } = ele;
        const kitem = [candle_end_time, open, close, low, high];
        times.push(candle_end_time);
        return kitem;
      });
    console.log(kdata, 'indexxxx')

      setIndexKline(kdata);
    }
  };

  const getTrend = async () => {
    const res: any = await stockklineApi.get_upward_and_downward_trend();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      setTrendData(parseData);
    }
  };

  const get_qkj_market_score = async () => {
    const res: any = await stockklineApi.get_qkj_market_score();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      setScoreData(parseData);
      console.log(parseData, "score");
    }
  };

  const get_qkj_market_volume = async () => {
    const res: any = await stockklineApi.get_qkj_market_volume();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      setVolumeData(parseData);
    }
  };

  return (
    <div className="flex items-center flex-col stock-market-wrap">
      <Header />

      {/* 股市实时状态 */}
      <div className="w-10/12 rounded-xl realtime-market-wrap bg-white">
        <RealtimeMarket />
      </div>

      {/* 股市的涨跌趋势 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <UpDownTrend data={trendData} />
      </div>

      {/* 大盘历史评分 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <MarketScore data={scoreData} indexKline={indexKline} />
      </div>

      <div className="flex justify-between w-10/12">
        <div className="w-1/2 p-2.5 mt-6 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="513100" etfName="纳指ETF" start={95} />
        </div>

        <div className="w-1/2 p-2.5 mt-6 ml-2.5 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="159612" etfName="标普ETF" start={80} />
        </div>
      </div>
      <div className="flex justify-between w-10/12">
        <div className="w-10/12 p-2.5 mt-6 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="513130" etfName="恒生科技ETF" start={80} />
        </div>

        <div className="w-10/12 p-2.5 mt-6 ml-2.5 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations
            etfCode="513520"
            etfName="华夏野村日经225ETF"
            start={85}
          />
        </div>
      </div>
    </div>
  );
}
