import { useState } from "react";
import Header from "./components/header";

import { DatePicker, Tabs } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import "dayjs/locale/zh-cn";

import './index.less';

import type { TabsProps } from "antd";
import KdjTab from "./components/kdj-tab";
import LeadingTab from "./components/leading-tab";

dayjs.locale("zh-cn");

export default function Index() {

  // 选择日期
  const [date, setDate] = useState(dayjs(new Date()));

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf("day");
  };

  const onChange = (key: string) => {
    console.log(key)
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "KDJ涨停优选",
      children: (
        <KdjTab date={date} />
      ),
    },
    {
      key: "2",
      label: "热点涨停优选",
      children: (
        <LeadingTab date={date} />
      ),
    },
    {
      key: "3",
      label: <div>Tab 3</div>,
      forceRender: true,
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="flex items-center	flex-col">
      <Header />

      {/* 日期选择 */}
      <div className="w-10/12 flex items-center	justify-start p-[24px]">
        <span className="text-[15px] text-[#333] mr-2 font-medium">
          日期选择
        </span>
        <DatePicker
          format="YYYYMMDD"
          defaultValue={date}
          placeholder="选择日期"
          onChange={setDate}
          disabledDate={disabledDate}
        />
      </div>

      {/* 策略Tab选项卡 */}
      <div className="w-10/12 strategy-wrap">

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
