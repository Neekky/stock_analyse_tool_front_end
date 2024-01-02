import { useCallback, useEffect, useMemo, useState } from 'react'
import { limitupApi } from "@/apis";
import { Table, Tag, DatePicker, message, Button } from 'antd';
// import numeral from 'numeral';
// import StockPlate from '../../components/stockPlate';
// import StockKLine from '../../components/stockKLine';
import './index.less'
import dayjs from 'dayjs';
import PlatePieChart from "@/components/platePieChart";
import Drawers from "./components/drawers";

import type { DatePickerProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs as Dtype } from 'dayjs';

export default function Index(): any {
  /**
   * 用于分析涨停数据的组件。
   */
  const [limitUpData, setLimitUpData] = useState([]);

  /**
   * 过滤后的涨停数据。
   */
  const [limitUpFilterData, setLimitUpFilterData] = useState([]);

  const [date, setDate] = useState(dayjs(new Date()));

  const [messageApi, contextHolder] = message.useMessage();

  // 股票详情
  const [stockInfo, setStockInfo] = useState<any>({});

  // 控制股票详情弹窗是否打开
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    pageGetLimitUpData(date);
  }, [date]);

  const wrapHandleViewDetail = useCallback((key: React.Key) => {
    const item = limitUpData.find(ele => ele['股票简称'] === key);
    console.log(item);
    setStockInfo(item);
    setOpen(true);
  }, [limitUpData]);

  const columns = useMemo<ColumnsType<any>>(() => {
    return  [
      {
        title: '股票代码',
        dataIndex: '股票代码',
        key: '股票代码',
        render: (text: string) => {
          const prefix = text.substring(7, 9).toLocaleLowerCase();
          const code = text.substring(0, 6);
          const res = prefix + code;
          return <a target="_blank" href={`https://quote.eastmoney.com/concept/${res}.html`}>{res}</a>;
        },
      },
      {
        title: '股票名称',
        dataIndex: '股票简称',
        key: '股票简称',
        render: (text) => text,
      },
      {
        title: '最新价',
        dataIndex: '最新价',
        key: '最新价',
        render: (text) => text,
        sorter: (a, b) => a['最新价'] - b['最新价'],
      },
      // {
      //   title: '涨停封单额',
      //   dataIndex: `涨停封单额`,
      //   key: `涨停封单额`,
      //   render: (_text, row) => {
      //     const amount = row[`涨停封单量`];
      //     const price = row['最新价'];
      //     const res = (amount * price).toFixed(0)
      //     return numeral(res).format('0,0');
      //   },
      //   sorter: (a: any, b: any) => {
      //     const aAmount = a[`涨停封单量`];
      //     const aPrice = a['最新价'];
      //     const aRes = aAmount * aPrice;

      //     const bAmount = b[`涨停封单量`];
      //     const bPrice = b['最新价'];
      //     const bRes = bAmount * bPrice;
      //     return aRes - bRes;
      //   },
      // },
      // {
      //   title: '连板数',
      //   dataIndex: `连续涨停天数`,
      //   key: `连续涨停天数`,
      //   render: (text) => text,
      //   sorter: (a, b) => a[`连续涨停天数`] - b[`连续涨停天数`],
      // },
      {
        title: '几天几板',
        dataIndex: `几天几板`,
        key: `几天几板`,
        render: (text) => text,
      },
      // {
      //   title: '涨停开板次数',
      //   dataIndex: `涨停开板次数`,
      //   key: `涨停开板次数`,
      //   render: (text) => text,
      // },
      {
        title: '涨停因子排名',
        dataIndex: `排名`,
        key: `排名`,
        render: (text) => text,
        sorter: (a, b) => a[`排名`] - b[`排名`],
      },
      // {
      //   title: '最终涨停时间',
      //   dataIndex: `最终涨停时间`,
      //   key: `最终涨停时间`,
      //   render: (text) => text,
      // },
      {
        title: '涨停原因类别',
        dataIndex: `涨停原因类别`,
        key: `涨停原因类别`,
        render: (text) => {
          const tags = text?.split("+") || [];

          return (
            <>
              {tags?.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag className='reason-tag' color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          )
        },
        width: 200
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
      //   width: 400
      // },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
          <Button title="Sure to delete?" onClick={() => wrapHandleViewDetail(record.key)}>
            <a>详情</a>
          </Button>
      },
    ]
  }, [limitUpData, wrapHandleViewDetail]);

  // 获取涨停股票数量
  const pageGetLimitUpData = async (queryDate) => {
    const dateParam = queryDate.format('YYYYMMDD');
    try {
      const res = await limitupApi.getLimitUpData({
        date: dateParam,
        num: '0'
      });
      if (res.code !== 200) {
        messageApi.open({
          type: 'error',
          content: '当日无数据',
        });
      } else {
        const firstDealData = res.data?.map((ele) => ({ ...ele, key: ele['股票简称'] }));

        setLimitUpData(firstDealData)

        const secondDealData = firstDealData.slice(0).sort((a, b) => a['排名'] - b['排名']);

        setLimitUpFilterData(secondDealData);
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '当日无数据',
      });
    }
  }


  const onChange: DatePickerProps['onChange'] = (date: any | Dtype) => {
    setDate(date)
  };

  return (
    <div className="limitup-wrapper">
      {contextHolder}
      <Drawers
        open={isOpen}
        stockInfo={stockInfo}
        onClose={() => setOpen(false)}
      />
      <div className="analyse-area">
        {/* 板块情况分析 */}
        <div className="plate-analyse-area">
          <div>
            板块分析：
          </div>
          <div>
            <PlatePieChart data={limitUpData} />
          </div>
        </div>

        <div className="limitup-analyse-area">
          <div>
            涨停因子优化选股排名：
          </div>
          <div>
            {
              limitUpFilterData.slice(0, 5)?.map(ele => <div key={ele['股票简称']}>{ele['股票简称'] + ele['股票代码']}</div>)
            }
          </div>
        </div>
      </div>
      <div className="header-wrapper">
        {/* 涨停情况 */}
        <div>
          涨停数量： {limitUpData.length}
        </div>

        {/* 日历组件 */}
        <div className="datepicker">
          <DatePicker format="YYYYMMDD" defaultValue={date} placeholder="选择日期" onChange={onChange} />
        </div>
      </div>
      <div className="table-wrapper">
        <Table
          key={date.format('YYYYMMDD')}
          pagination={{
            defaultPageSize: 100
          }}
          columns={columns}
          dataSource={limitUpData} />
      </div>
    </div>
  )
}
