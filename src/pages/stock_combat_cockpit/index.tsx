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

export default function Index() {
  const [trendData, setTrendData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [stockEbsLgData, setStockEbsLgData] = useState([]);

  // 沪深300的日期
  const [hs300Date, setHs300Date] = useState([]);

  // kdj的k值差
  const [kdjKValueDiff, setKdjKValueDiff] = useState([]);

  // 沪深300、微盘股各自的收盘价
  const [hs300ClosePrice, setHs300ClosePrice] = useState([]);
  const [microStockClosePrice, setMicroStockClosePrice] = useState([]);

  // 龙虎榜资金各路明细数据
  const [winnersVolDetail, setWinnersVolDetail] = useState([]);

  // 指数K线开高收低数据
  const [indexKline, setIndexKline] = useState([]);

  // 上证指数K线开高收低数据供股债利差使用
  const [indexKlineForEbsLg, setIndexKlineForEbsLg] = useState([]);
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
      getIndexKLine("2023-10-30");

      // 获取市场当日评分
      getTodayMarketScore();

      // 获取龙虎榜资金各路明细数据
      get_winner_volume_detail();

      // 获取股债利差数据
      getStockEbsLgData();

      // 获取上证指数K线开高收低数据供股债利差使用
      getIndexKLineForEbsLg();

      // 获取沪深300数据
      getMicroStockIndex();

      // 获取沪深300、尾盘股数据，并求kdj的k值差
      getHs300AndMicroStockKdjKValueDiff()
  }, []);

  // 获取沪深300、尾盘股数据，并求kdj的k值差
  const getHs300AndMicroStockKdjKValueDiff = async () => {
    const [hs300Data, microStockData] = await Promise.allSettled([
      getHs300Data(),
      getMicroStockIndex(),
    ]);

    // 如果两个数据都获取成功，则计算kdj的k值差
    if (hs300Data.status === 'fulfilled' && microStockData.status === 'fulfilled') {
      const hs300KdjKValue = calculateKDJ(hs300Data.value);
      const microStockKdjKValue = calculateKDJ(microStockData.value);

      // 计算kdj的k值差
      const kdjKValueDiff = hs300KdjKValue.map((item, index) => item.K - microStockKdjKValue[index].K);
      // 获取沪深300、微盘股各自的收盘价
      const hs300ClosePrice = hs300Data.value.map(item => item.close);
      const microStockClosePrice = microStockData.value.map(item => item.close);

      // 获取沪深300的日期
      const hs300Date = hs300Data.value.map(item => dayjs(item.date).format('YYYY-MM-DD'));

      console.log(hs300KdjKValue, microStockKdjKValue, 'hs300Date')
      // 存储kdj的k值差、沪深300、微盘股各自的收盘价
      setKdjKValueDiff(kdjKValueDiff);
      setHs300ClosePrice(hs300ClosePrice);
      setMicroStockClosePrice(microStockClosePrice);

      setHs300Date(hs300Date);
    }
  }


  // 获取沪深300数据
  const getHs300Data = async () => {
    const res = await stockklineApi.getIndexKLine({
      startDate: '2023-07-05',
      index: 'sh000300',
    });
    if (res.code === 200) {
      const data = safeJsonParse(res.data, []);
      return data;
    }
  }

  // 获取同花顺微盘股指数数据
  const getMicroStockIndex = async () => {
    const res = await thirdParty.getMicroStockIndex();

    // 1. 移除函数调用的包装
    const jsonStr = res.replace(/^quotebridge_v6_line_48_883418_01_last1800\((.*)\)$/, '$1');

    // 2. 解析JSON
    const data = JSON.parse(jsonStr);

    // 3. 解析K线数据
    const klineData = data.data.split(';').map(item => {
      if (!item) return null;

      const [
        date,          // 日期
        open,          // 开盘价
        high,          // 最高价
        low,           // 最低价
        close,         // 收盘价
        volume,        // 成交量
        amount,        // 成交额
      ] = item.split(',');

      return {
        date,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
        amount: parseFloat(amount)
      };
    }).filter(Boolean); // 过滤掉空值

    console.log({
      tradingTime: data.rt,          // 交易时间
      stockName: data.name,          // 股票名称
      issuePrice: data.issuePrice,   // 发行价
      klineData                      // K线数据
    }, 'res')

    return klineData;
  }

  // 获取龙虎榜资金各路明细数据
  const get_winner_volume_detail = async () => {
    const res = await stockklineApi.get_winner_volume_detail();
    if (res?.code === 200) {
      const parseData = JSON.parse(res.data);
      console.log(parseData, 'parseData')
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
      console.log(data, 'data')
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
          microStockClosePrice={microStockClosePrice}
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
