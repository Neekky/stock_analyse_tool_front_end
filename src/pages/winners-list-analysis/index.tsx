import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { thirdPartyApi, limitupApi } from "@/apis";
import { Table, DatePicker, message, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import PlatePieChart from "../../components/platePieChart";
import { dataConversion } from "@/utils";
import Drawers from "@/components/drawers";
import "./index.less";
import type { ColumnsType } from "antd/es/table";


export default function Index(): any {
  const [limitUpData, setLimitUpData] = useState([]);

  const [date, setDate] = useState(dayjs(new Date()));

  const plateData = useRef<any[]>([]);

  const [platePieData, setPlatePieData] = useState<any[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  // 股票详情
  const [stockInfo, setStockInfo] = useState<any>({});

  // 控制股票详情弹窗是否打开
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    pageGetLimitUpData(date);
  }, [date]);

  useEffect(() => {
    const promises = limitUpData.map((ele: any) => {
      const code = ele["代码"];
      return getStockPlateData(code);
    });
    Promise.all(promises).then(() => {
      const pieData = plateData.current?.flat().map((ele) => ele?.BOARD_NAME).filter(ele => (
        ele.indexOf('昨日涨停') === -1 && 
        ele.indexOf('昨日连板') === -1 &&
        ele.indexOf('机构重仓') === -1 &&
        ele.indexOf('融资融券') === -1 &&
        ele.indexOf('国企改革') === -1 &&
        ele.indexOf('预亏预减') === -1 &&
        ele.indexOf('次新股') === -1 &&
        ele.indexOf('板块') === -1 &&
        ele.indexOf('预盈预增') === -1
      )) || [];
      setPlatePieData(pieData);
    });
  }, [limitUpData]);

  const wrapHandleViewDetail = useCallback((key: React.Key) => {
    const item = limitUpData.find(ele => ele['名称'] === key);
    setStockInfo(item);
    setOpen(true);
  }, [limitUpData]);

  const columns = useMemo<ColumnsType<any>>(() => {
    return [
      {
        title: "股票代码",
        dataIndex: "代码",
        key: "代码",
        render: (text: string) => text,
      },
      {
        title: "股票名称",
        dataIndex: "名称",
        key: "名称",
        render: (text: string, row) => {
          const code = row["代码"];
          const date = dayjs(row["上榜日"]).format("YYYY-MM-DD");
          const url = `https://data.eastmoney.com/stock/lhb,${date},${code}.html`;
          return (
            <a target="_blank" href={url}>
              {text}
            </a>
          );
        },
      },
      // {
      //     title: '收盘价',
      //     dataIndex: '收盘价',
      //     key: '收盘价',
      //     render: (text: string) => text,
      //     sorter: (a, b) => a['收盘价'] - b['收盘价'],
      // },
      {
        title: "当日涨跌幅",
        dataIndex: "涨跌幅",
        key: "涨跌幅",
        render: (text: string) => (
          <div style={{ color: Number(text) > 0 ? "red" : "green" }}>{text}%</div>
        ),
        sorter: (a, b) => a["涨跌幅"] - b["涨跌幅"],
      },
      // {
      //     title: '成交额',
      //     dataIndex: '市场总成交额',
      //     key: '市场总成交额',
      //     render: (text: string) => text,
      //     sorter: (a, b) => a['市场总成交额'] - b['市场总成交额'],
      // },
      {
        title: "解读",
        dataIndex: "解读",
        key: "解读",
        render: (text: string) => text,
      },
    
      // {
      //     title: '龙虎榜买入额',
      //     dataIndex: `龙虎榜买入额`,
      //     key: `龙虎榜买入额`,
      //     render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text ? `${text}元` : '无数据'}</div>,
      //     sorter: (a, b) => a['龙虎榜买入额'] - b['龙虎榜买入额'],
      // },
      {
        title: "龙虎榜净买额",
        dataIndex: `龙虎榜净买额`,
        key: `龙虎榜净买额`,
        render: (text: string) => (
          <div style={{ color: Number(text) > 0 ? "red" : "green" }}>
            {text ? `${text}元` : "无数据"}
          </div>
        ),
        sorter: (a, b) => a["龙虎榜净买额"] - b["龙虎榜净买额"],
      },
      // {
      //     title: '龙虎榜卖出额',
      //     dataIndex: `龙虎榜卖出额`,
      //     key: `龙虎榜卖出额`,
      //     render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text ? `${text}元` : '无数据'}</div>,
      //     sorter: (a, b) => a['龙虎榜卖出额'] - b['龙虎榜卖出额'],
      // },
      // {
      //     title: '龙虎榜成交额',
      //     dataIndex: `龙虎榜成交额`,
      //     key: `龙虎榜成交额`,
      //     render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text ? `${text}元` : '无数据'}</div>,
      //     sorter: (a, b) => a['龙虎榜成交额'] - b['龙虎榜成交额'],
      // },
      // {
      //     title: '上榜后1日',
      //     dataIndex: `上榜后1日`,
      //     key: `上榜后1日`,
      //     render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text ? `${text}%` : '无数据'}</div>,
      //     sorter: (a, b) => a['上榜后1日'] - b['上榜后1日'],
      // },
      {
        title: "上榜后2日",
        dataIndex: `上榜后2日`,
        key: `上榜后2日`,
        render: (text: string) => (
          <div style={{ color: Number(text) > 0 ? "red" : "green" }}>
            {text ? `${text}%` : "上榜不足2日"}
          </div>
        ),
        sorter: (a, b) => a["上榜后2日"] - b["上榜后2日"],
      },
      // {
      //     title: '上榜后5日',
      //     dataIndex: `上榜后5日`,
      //     key: `上榜后5日`,
      //     render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text ? `${text}%` : '无数据'}</div>,
      //     sorter: (a, b) => a['上榜后5日'] - b['上榜后5日'],
      // },
      // {
      //     title: '上榜后10日',
      //     dataIndex: `上榜后10日`,
      //     key: `上榜后10日`,
      //     render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text ? `${text}%` : '无数据'}</div>,
      //     sorter: (a, b) => a['上榜后10日'] - b['上榜后10日'],
      // },
      // {
      //   title: "上榜原因",
      //   dataIndex: `上榜原因`,
      //   key: `上榜原因`,
      //   render: (text: string) => text,
      //   width: 200,
      // },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
          <Button onClick={() => wrapHandleViewDetail(record.key)}>
            <a>详情</a>
          </Button>
      },
    ];
  }, [limitUpData, wrapHandleViewDetail]);

  const getStockPlateData = async (code: string) => {
    const prefix = dataConversion.getExchangeByCode(code);
    // 去除可转债票
    if (code.startsWith("11")) {
      return;
    }
    try {
      await thirdPartyApi.getStockPlateData(prefix, code).then((res: any) => {
        if (res?.success) {
          plateData.current?.push(res?.result?.data);
        }
      });
    } catch (error) {
      console.log(error, code, '获取股票板块数据失败');
    }
   
  };

  // 获取涨停股票数量
  const pageGetLimitUpData = async (queryDate: any) => {
    const dateParam = queryDate.format("YYYYMMDD");
    try {
      const res = await limitupApi.getWinnersListData({
        start_date: dateParam,
        end_date: dateParam,
      });

      if (res.code !== 200) {
        messageApi.open({
          type: "error",
          content: "当日无数据",
        });
      } else {
        setLimitUpData(res.data.map((ele) => ({ ...ele, key: ele['名称'] })));
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "当日无数据",
      });
    }
  };

  const onChange = (date: any | Dayjs) => {
    setDate(date);
  };

  return (
    <div className="winners-wrapper">
      {contextHolder}
      <Drawers
        open={isOpen}
        stockInfo={stockInfo}
        onClose={() => setOpen(false)}
      />
      {/* 板块情况分析 */}
      <div>板块分析：</div>
      <div>
        <PlatePieChart data={platePieData} />
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
          bordered
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
