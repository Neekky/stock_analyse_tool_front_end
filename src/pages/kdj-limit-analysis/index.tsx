import { useEffect, useState } from "react";
import Header from "./components/header";

import { DatePicker, Tabs } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import "dayjs/locale/zh-cn";

import type { TabsProps } from "antd";
import KdjTab from "./components/kdj-tab";
import LeadingTab from "./components/leading-tab";
import WinnersTab from "./components/winners-tab";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { thirdPartyApi } from "@/apis";
import "./index.less";

dayjs.locale("zh-cn");

export default function Index() {
  // 获取交易日期
  const tradeDate = useSelector(
    (state: RootState) => state.realtime_stock.tradeDate
  );

  // 选择日期
  const [date, setDate] = useState(dayjs(new Date()));

  const [twoDayCompareData, setTwoDayCompareData] = useState<any>({
    board_list: [],
  });

  useEffect(() => {
    setDate(dayjs(tradeDate));
  }, [tradeDate]);

  useEffect(() => {
    // 获取涨停板两日比较
    getTwoDayCompare(date);
  }, [date]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf("day");
  };

  // 获取两天的比较
  const getTwoDayCompare = async (date) => {
    const dateStr = dayjs(date).format("YYYYMMDD");
    const res = await thirdPartyApi.getLimitTowDayCompare(dateStr);
    console.log(res, dateStr, "2132");
    if (res.status_msg === "success") {
      setTwoDayCompareData(res.data);
    }
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "KDJ涨停优选",
      children: <KdjTab date={date} />,
    },
    {
      key: "2",
      label: "热点涨停优选",
      children: <LeadingTab date={date} />,
    },
    {
      key: "3",
      label: "龙虎榜优选",
      // forceRender: true,
      children: <WinnersTab date={date} />,
    },
  ];

  return (
    <div className="flex items-center	flex-col ">
      <Header />

      {/* 日期选择 */}
      <div className="w-10/12 flex items-center	justify-start p-[24px]">
        <span className="text-[15px] text-[#333] mr-2 font-medium">
          日期选择
        </span>
        <DatePicker
          format="YYYYMMDD"
          defaultValue={date}
          value={date}
          placeholder="选择日期"
          onChange={setDate}
          disabledDate={disabledDate}
        />
      </div>

      {/* 两日涨停板对比 */}
      {twoDayCompareData?.board_list?.length > 0 ? (
        <div className="w-10/12">
          {twoDayCompareData?.board_list?.map((ele) => {
            return (
              <div className="flex w-full my-2">
                {/* 昨日连板 */}
                <div className="w-1/2 bg-gray-200 py-2 px-8 rounded-md mr-2">
                  <div className="text-neutral-700 text-lg font-medium">
                    昨日{ele.yesterday_board}板 ( {ele.yesterday_list?.length || 0} )
                  </div>
                  <div className="flex flex-wrap">
                    {ele.yesterday_list?.map((item) => (
                      <div className="w-1/3 mt-2">
                        <span className="text-stone-800 inline-block mr-2 min-w-16">
                          {item.stock_name}
                        </span>
                        <span
                          style={{
                            color:
                              item.rate > 0
                                ? "rgb(220, 38, 38)"
                                : "rgb(6, 95, 70)",
                          }}
                          className="text-stone-800 mr-2 font-medium"
                        >
                          {Number(item.rate).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 箭头 */}
                <div className="kdj-limit-arrow" />

                {/* 今日连板 */}
                <div className="w-1/2 bg-red-200 py-2 px-8 rounded-md">
                  <div className="text-red-500 text-lg font-medium	">
                    今日{ele.today_board}板 ( {ele.today_list?.length || 0} )
                    <span className="ml-2 text-[#493f3f] text-base">
                      晋级率
                    </span>{" "}
                    <span className="text-[#493f3f] text-base">
                      {Math.round(
                        ((ele.today_list?.length || 0) / (ele.yesterday_list?.length || 0)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex flex-wrap">
                    {ele.today_list?.map((item) => (
                      <div className="w-1/3 mt-2">
                        <span className="text-stone-800 inline-block mr-2 min-w-16">
                          {item.stock_name}
                        </span>
                        <span
                          style={{
                            color:
                              item.rate > 0
                                ? "rgb(220, 38, 38)"
                                : "rgb(6, 95, 70)",
                          }}
                          className="text-stone-800 mr-2 font-medium"
                        >
                          {Number(item.rate).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 策略Tab选项卡 */}
      <div className="w-10/12 strategy-wrap">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
