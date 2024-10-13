import Header from "./components/header";
import RealtimeMarket from "./components/realtime-market";
import EtfCompilations from "./components/etf-compilations";
import "./index.less";

export default function index() {
  return (
    <div className="flex items-center flex-col stock-market-wrap">
      <Header />

      {/* 股市实时状态 */}
      <div className="w-10/12 rounded-xl realtime-market-wrap bg-white">
        <RealtimeMarket />
      </div>

      <div className="flex justify-between w-10/12">
        <div className="w-1/2 p-2.5 mt-6 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="513100" etfName="纳指ETF" start={90} />
        </div>

        <div className="w-1/2 p-2.5 mt-6 ml-2.5 rounded-xl realtime-market-wrap bg-white">
          <EtfCompilations etfCode="159612" etfName="标普ETF" start={60} />
        </div>
      </div>

      <div className="flex justify-between w-10/12">

      <div className="w-10/12 p-2.5 mt-6 rounded-xl realtime-market-wrap bg-white">
        <EtfCompilations etfCode="513130" etfName="恒生科技ETF" start={70} />
      </div>

      <div className="w-10/12 p-2.5 mt-6 ml-2.5 rounded-xl realtime-market-wrap bg-white">
        <EtfCompilations etfCode="513520" etfName="华夏野村日经225ETF" start={80} />
      </div>
      </div>

    </div>
  );
}
