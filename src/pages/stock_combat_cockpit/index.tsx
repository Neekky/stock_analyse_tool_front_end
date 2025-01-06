import Header from "./components/header";
import RealtimeMarket from "./components/realtime-market";
import EtfCompilations from "./components/etf-compilations";
import { useEffect, useState } from "react";
import { allInfoApi, stockklineApi } from "@/apis";
import UpDownTrend from "./components/up-down-trend";
import MarketScore from "./components/market-score";
import { safeJsonParse } from "@/utils/common";
import MarketVolume from "./components/market-volume";
import IndexCompilations from "./components/index-compilations";
import WinnersVolumDetail from "./components/winners-volume-detail";
import thirdParty from "@/apis/thirdParty";
import "./index.less";
import StockEbsLg from "./components/stock-ebs-lg";
import dayjs from 'dayjs';
import { calculateKDJ } from "@/utils/calculate";
import KdjKValueDiffLineChart from "./components/kdj-k-value-diff-line-chart";

// 硬编码的日期应该提取为配置
const DEFAULT_START_DATE = '2023-10-30';

export default function Index() {
  const [trendData, setTrendData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [stockEbsLgData, setStockEbsLgData] = useState([]);

  // 沪深300的日期
  const [hs300Date, setHs300Date] = useState([]);

  // kdj的k值差
  const [kdjKValueDiff, setKdjKValueDiff] = useState<number[]>([]);

  // 沪深300、中证2000各自的收盘价
  const [hs300ClosePrice, setHs300ClosePrice] = useState<number[]>([]);
  const [zzClosePrice, setZz2000ClosePrice] = useState<number[]>([]);

  // 龙虎榜资金各路明细数据
  const [winnersVolDetail, setWinnersVolDetail] = useState<any[]>([]);

  // 指数K线开高收低数据
  const [indexKline, setIndexKline] = useState<any[]>([]);

  // 上证指数K线开高收低数据供股债利差使用
  const [indexKlineForEbsLg, setIndexKlineForEbsLg] = useState<any[]>([]);

  // 市场当日评分
  const [marketTodayScore, setMarketTodayScore] = useState<null | object>(null);

  useEffect(() => {
      // 获取市场当日评分
      get_qkj_market_score();

      // 获取股市的涨跌趋势
      getTrend();

      // 获取市场当日成交
      get_qkj_market_volume();

      // 获取上证指数K线开高收低数据供股债利差使用
      getIndexKLine(DEFAULT_START_DATE);

      // 获取市场当日评分
      getTodayMarketScore();

      // 获取龙虎榜资金各路明细数据
      get_winner_volume_detail();

      // 获取股债利差数据
      getStockEbsLgData();

      // 获取上证指数K线开高收低数据供股债利差使用
      getIndexKLineForEbsLg();

      // 获取沪深300、中证2000数据，并求kdj的k值差
      getHs300AndZZ2000KdjKValueDiff();
  }, []);

  // 获取沪深300、中证2000数据，并求kdj的k值差
  const getHs300AndZZ2000KdjKValueDiff = async () => {
    const [hs300Data, zz2000Data] = await Promise.allSettled([
      getHs300Data(),
      getZz2000Data(),
    ]);

    // 如果所有数据都获取成功，则计算kdj的k值差
    if (hs300Data.status === 'fulfilled' && 
      zz2000Data.status === 'fulfilled') {

      // 沪深300数据进行截取，保持和中证2000数据长度一致
      const hs300DataOriginal = hs300Data.value.slice(2181);
      const zz2000DataOriginal = zz2000Data.value;
      
      const hs300KdjKValue = calculateKDJ(hs300DataOriginal);
      const zz2000KdjKValue = calculateKDJ(zz2000DataOriginal);

      // 计算kdj的k值差
      const kdjKValueDiff = hs300KdjKValue.map((item, index) => 
        Number(item.K) - Number(zz2000KdjKValue[index].K));

      // 获取沪深300、中证2000各自的收盘价
      const hs300ClosePrice = hs300DataOriginal.map(item => item.close);
      const zz2000ClosePrice = zz2000KdjKValue.map(item => item.close);

      // 获取沪深300的日期
      const hs300Date = hs300DataOriginal.map(item => 
        dayjs(item.date).format('YYYY-MM-DD'));

      
      // 存储kdj的k值差、沪深300、中证2000各自的收盘价
      setKdjKValueDiff(kdjKValueDiff);

      setHs300ClosePrice(hs300ClosePrice);

      setZz2000ClosePrice(zz2000ClosePrice);

      setHs300Date(hs300Date);
    }
  }

  // 获取沪深300数据
  const getHs300Data = async () => {
    const res = await allInfoApi.get_stock_zh_index_daily('sz399300');
    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      return data;
    }
  }

  // 获取中证2000数据
  const getZz2000Data = async () => {
    const res = await allInfoApi.get_stock_zh_index_daily('csi932000');
    const res2 = await thirdParty.getUsaRateHistory();
    console.log(res2, '查看利率数据');
    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      return data;
    }
  }

  // 获取龙虎榜资金各路明细数据
  const get_winner_volume_detail = async () => {
    const res = await stockklineApi.get_winner_volume_detail();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      setWinnersVolDetail(parseData);
    }
  }

  // 获取同花顺大盘当日评分数据
  const getTodayMarketScore = async () => {
    const res = await thirdParty.getQkjTodayScore();
    if (res?.status_msg === "ok") {
      const parseData = res.data;
      setMarketTodayScore(parseData);
    }
  };

  // 获取上证指数数据
  const getIndexKLine = async (date) => {
    // 获取当前时间的60天之前日期
    const res = await stockklineApi.getIndexKLine({
      startDate: date,
      index: "sh000001",
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
      setIndexKline(kdata);
    }
  };

  // 获取上证指数数据供股债利差使用
  const getIndexKLineForEbsLg = async () => {
    // 获取当前时间的60天之前日期
    const res = await stockklineApi.getIndexKLine({
      startDate: '2005-04-08',
      index: "sh000001",
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
      setIndexKlineForEbsLg(kdata);
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
    }
  };

  const get_qkj_market_volume = async () => {
    const res: any = await stockklineApi.get_qkj_market_volume();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      setVolumeData(parseData);
    }
  };

  // 获取股债利差数据
  const getStockEbsLgData = async () => {
    const res = await allInfoApi.get_stock_ebs_lg();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      // 将时间戳转换为 YYYY-MM-DD 格式
      const data = parseData.map((item) => ({
        ...item,
        日期: dayjs(item.日期).format('YYYY-MM-DD')
      }));
      setStockEbsLgData(data);
    }
  }

  return (
    <div className="flex items-center flex-col stock-market-wrap">
      <Header />

      {/* 股市实时状态 */}
      <div className="w-10/12 rounded-xl realtime-market-wrap bg-white">
        <RealtimeMarket />
      </div>

      {/* 股债利差 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <StockEbsLg
          indexKline={indexKlineForEbsLg}
          data={stockEbsLgData}
        />
      </div>

      {/* 沪深300、微盘股各自的收盘价以及kdj的k值差折线图 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <KdjKValueDiffLineChart
          kdjKValueDiff={kdjKValueDiff}
          hs300ClosePrice={hs300ClosePrice}
          zzClosePrice={zzClosePrice}
          hs300Date={hs300Date}
        />
      </div>
      {/* 大盘历史评分 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <MarketScore
          todayScore={marketTodayScore}
          data={scoreData}
          indexKline={indexKline.slice(182)}
        />
      </div>

      {/* 大盘状态 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <IndexCompilations />
      </div>

      {/* 大盘历史成交 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <MarketVolume data={volumeData} indexKline={indexKline.slice(174)} />
      </div>

      {/* 股市的涨跌趋势 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <UpDownTrend data={trendData} indexKline={indexKline.slice(174)} />
      </div>

      {/* 龙虎榜各路资金历史成交 */}
      <div className="w-10/12 mt-6 p-6 rounded-xl realtime-market-wrap bg-white">
        <WinnersVolumDetail data={winnersVolDetail} indexKline={indexKline} />
      </div>

      <div className="flex justify-between w-10/12">
        <div className="w-1/2 p-2.5 mt-6 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="513100" etfName="纳指ETF" start={95} />
        </div>

        <div className="w-1/2 p-2.5 mt-6 ml-2.5 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="513400" etfName="道琼斯ETF" start={80} />
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
