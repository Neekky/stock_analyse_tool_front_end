// import { useCallback, useEffect, useMemo, useState } from "react";
// import { message } from "antd";
import HotPlateRank from "./components/hot-plate-rank";
import "./index.less";

export default function Index(): any {
//   const [messageApi, contextHolder] = message.useMessage();

  return <div className="leading-trend-wrapper">
    {/* {contextHolder} */}
    {/* 上层 */}
    <div>
        {/* 今日热点板块 */}
        <HotPlateRank />

        {/* 热点板块龙头股，夹带自我排名 */}
        <div></div>
    </div>

    {/* 中层 */}
    <div>
        {/* 股票走势 */}
    </div>
    </div>;
}
