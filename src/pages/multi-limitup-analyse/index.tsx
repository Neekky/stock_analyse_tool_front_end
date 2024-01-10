import { useCallback, useEffect, useMemo, useState } from "react";
import { limitupApi } from "@/apis";
import { Table, Tag, DatePicker, message, Button } from "antd";
import dayjs from "dayjs";
import PlatePieChart from "../../components/platePieChart";
import Drawers from "@/components/drawers";
import "./index.less";

import type { Dayjs } from "dayjs";
import type { DatePickerProps } from "antd";
import type { ColumnsType } from "antd/es/table";

export default function Index(): any {
  const [limitUpData, setLimitUpData] = useState([]);

  const [date, setDate] = useState(dayjs(new Date()));

  const [num, setNum] = useState("1");

  const [messageApi, contextHolder] = message.useMessage();

  // 股票详情
  const [stockInfo, setStockInfo] = useState<any>({});

  // 控制股票详情弹窗是否打开
  const [isOpen, setOpen] = useState(false);

  const wrapHandleViewDetail = useCallback((key: React.Key) => {

    const item = limitUpData.find(ele => ele['股票简称'] === key);
    console.log(item);
    setStockInfo(item);
    setOpen(true);

  }, [limitUpData]);

  const columns = useMemo<ColumnsType<any>>(() => {
    return [
      {
        title: "股票代码",
        dataIndex: "股票代码",
        key: "股票代码",
        render: (text: string) => {
          const prefix = text.substring(7, 9).toLocaleLowerCase();
          const code = text.substring(0, 6);
          const res = prefix + code;
          return (
            <a
              style={{ width: "40px" }}
              target="_blank"
              href={`https://quote.eastmoney.com/concept/${res}.html`}
            >
              {res}
            </a>
          );
        },
      },
      {
        title: "股票名称",
        dataIndex: "股票简称",
        key: "股票简称",
        render: (text: string) => text,
      },
      {
        title: "最新价",
        dataIndex: "最新价",
        key: "最新价",
        render: (text: string) => text,
        sorter: (a, b) => a["最新价"] - b["最新价"],
      },
      {
        title: "涨停开板次数",
        dataIndex: `涨停开板次数`,
        key: `涨停开板次数`,
        render: (text) => text,
      },
      // {
      //   title: '连板数',
      //   dataIndex: `连续涨停天数`,
      //   key: `连续涨停天数`,
      //   render: (text: string) => text,
      // },
      {
        title: "几天几板",
        dataIndex: `几天几板`,
        key: `几天几板`,
        render: (text: string) => text,
      },
      {
        title: "涨停原因类别",
        dataIndex: `涨停原因类别`,
        key: `涨停原因类别`,
        render: (text) => {
          const tags = text?.split("+") || [];

          return (
            <>
              {tags.map((tag) => {
                let color = tag.length > 5 ? "geekblue" : "green";
                if (tag === "loser") {
                  color = "volcano";
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
          <Button onClick={() => wrapHandleViewDetail(record.key)}>
            <a>详情</a>
          </Button>
      },
      // {
      //   title: '所属板块',
      //   dataIndex: `最终涨停时间`,
      //   key: `最终涨停时间`,
      //   render: (_: any, row: any) => {
      //     const text = row['股票代码'];
      //     const prefix = text.substring(7, 9);
      //     const code = text.substring(0, 6);
      //     return <StockPlate prefix={prefix} code={code} />
      //   },
      // },
    ];
  }, [limitUpData, ]);

  useEffect(() => {
    pageGetLimitUpData(date);
    limitupApi.get_limitup_diff(date.format("YYYYMMDD"));
  }, [date, num]);

  // 获取涨停股票数量
  const pageGetLimitUpData = async (queryDate: any) => {
    const dateParam = queryDate.format("YYYYMMDD");
    try {
      const res = await limitupApi.getLimitUpDataByNum({
        date: dateParam,
        num,
      });
      if (res.code !== 200) {
        messageApi.open({
          type: "error",
          content: "当日无数据",
        });
      } else {
        setLimitUpData(res.data.map((ele) => ({ ...ele, key: ele['股票简称']  })));
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "当日无数据",
      });
    }
  };

  const onChange: DatePickerProps["onChange"] = (date: Dayjs | any) => {
    setDate(date);
  };

  const updateNum = (data: string) => {
    if (data === num) return;
    setNum(data);
  };

  return (
    <div className="multi-wrapper">
      {contextHolder}
      <Drawers
        open={isOpen}
        stockInfo={stockInfo}
        onClose={() => setOpen(false)}
      />
      {/* 多板按钮选项 */}
      <Button
        type={num === "1" ? "primary" : "default"}
        className="header-btn"
        onClick={() => updateNum("1")}
      >
        一板
      </Button>
      <Button
        type={num === "2" ? "primary" : "default"}
        className="header-btn"
        onClick={() => updateNum("2")}
      >
        二板
      </Button>
      <Button
        type={num === "3" ? "primary" : "default"}
        className="header-btn"
        onClick={() => updateNum("3")}
      >
        三板
      </Button>
      <Button
        type={num === "4" ? "primary" : "default"}
        className="header-btn"
        onClick={() => updateNum("4")}
      >
        四板
      </Button>
      {/* 板块情况分析 */}
      <div className="header-3">板块分析：</div>
      <div>
        <PlatePieChart key={num} data={limitUpData} />
      </div>

      {/* 涨停数据查看 */}
      <div className="header-wrapper">
        {/* 涨停情况 */}
        <div>涨停数量： {limitUpData.length}</div>

        {/* 日历组件 */}
        <div className="datepicker">
          <DatePicker
            format="YYYYMMDD"
            defaultValue={date}
            placeholder="选择日期"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="multi-wrapper">
        <Table
          key={date.format("YYYYMMDD")}
          pagination={{
            defaultPageSize: 100,
          }}
          columns={columns}
          dataSource={limitUpData}
        />
      </div>
    </div>
  );
}
