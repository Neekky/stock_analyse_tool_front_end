import Header from "./components/header";
import RealtimeMarket from "./components/realtime-market";
import './index.less';

export default function index() {
  return (
    <div className="flex items-center flex-col stock-market-wrap">
      <Header />

      {/* 股市实时状态 */}
      <div className="w-10/12 rounded-xl realtime-market-wrap bg-white">
        <RealtimeMarket />
      </div>
    </div>
  );
}
