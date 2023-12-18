import { useEffect, useState } from 'react'
import { limitupApi } from "@/apis";
import { Table, Tag, DatePicker, message, Button } from 'antd';
import StockPlate from '../../components/stockPlate';
import StockKLine from '../../components/stockKLine';
import * as dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import PlatePieChart from "../../components/platePieChart";

import './index.less'

import type { DatePickerProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<any> = [
  {
    title: '股票代码',
    dataIndex: '股票代码',
    key: '股票代码',
    render: (text: string) => {
      const prefix = text.substring(7, 9).toLocaleLowerCase();
      const code = text.substring(0, 6);
      const res = prefix + code;
      return <a style={{ width: '40px' }} target="_blank" href={`https://quote.eastmoney.com/concept/${res}.html`}>{res}</a>;
    },
    width: 10,
  },
  {
    title: '股票名称',
    dataIndex: '股票简称',
    key: '股票简称',
    render: (text: string) => text,
    width: 10,

  },
  {
    title: '最新价',
    dataIndex: '最新价',
    key: '最新价',
    render: (text: string) => text,
    sorter: (a, b) => a['最新价'] - b['最新价'],
    width: 20
  },
  {
    title: '涨停开板次数',
    dataIndex: `涨停开板次数`,
    key: `涨停开板次数`,
    render: (text) => text,
    width: 20
  },
  {
    title: '连板数',
    dataIndex: `连续涨停天数`,
    key: `连续涨停天数`,
    render: (text: string) => text,
    width: 20
  },
  {
    title: '几天几板',
    dataIndex: `几天几板`,
    key: `几天几板`,
    render: (text: string) => text,
    width: 40
  },
  {
    title: '涨停原因类别',
    dataIndex: `涨停原因类别`,
    key: `涨停原因类别`,
    render: (text) => {
      const tags = text.split("+")
      return (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    width: 60

  },
  {
    title: '所属板块',
    dataIndex: `最终涨停时间`,
    key: `最终涨停时间`,
    render: (_: any, row: any) => {
      const text = row['股票代码'];
      const prefix = text.substring(7, 9);
      const code = text.substring(0, 6);
      return <StockPlate prefix={prefix} code={code} />
    },
    width: 150
  },
];

export default function Index(): any {

  const [limitUpData, setLimitUpData] = useState([]);

  const [date, setDate] = useState(dayjs(new Date()));

  const [num, setNum] = useState('1');

  const [messageApi, contextHolder] = message.useMessage();


  useEffect(() => {
    pageGetLimitUpData(date);
  }, [date, num]);

  // 获取涨停股票数量
  const pageGetLimitUpData = async (queryDate: any) => {
    const dateParam = queryDate.format('YYYYMMDD');
    try {
      const res = await limitupApi.getLimitUpDataByNum({
        date: dateParam,
        num
      });
      if (res.code !== 200) {
        messageApi.open({
          type: 'error',
          content: '当日无数据',
        });
      } else {
        setLimitUpData(res.data.map((ele, i) => ({ ...ele, key: i })))
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '当日无数据',
      });
    }
  }


  const onChange: DatePickerProps['onChange'] = (date: Dayjs | any) => {
    setDate(date)
  };

  const updateNum = (data: string) => {
    if (data === num) return;
    setNum(data);
  }

  return (
    <div className="multi-wrapper">
      {contextHolder}
      {/* 多板按钮选项 */}
      <Button type={num === '1' ? 'primary' : 'default'} className="header-btn" onClick={() => updateNum('1')}>一板</Button>
      <Button type={num === '2' ? 'primary' : 'default'} className="header-btn" onClick={() => updateNum('2')}>二板</Button>
      <Button type={num === '3' ? 'primary' : 'default'} className="header-btn" onClick={() => updateNum('3')}>三板</Button>
      <Button type={num === '4' ? 'primary' : 'default'} className="header-btn" onClick={() => updateNum('4')}>四板</Button>
      {/* 板块情况分析 */}
      <div>
        板块分析：
      </div>
      <div>
        <PlatePieChart key={num} data={limitUpData} />
      </div>

      {/* 涨停数据查看 */}
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
      <div className="multi-wrapper">
        <Table
          key={date.format('YYYYMMDD')}
          pagination={{
            defaultPageSize: 100
          }}
          expandable={{
            expandedRowRender: (record) => <StockKLine data={record} />,
          }}
          scroll={{ x: 1700 }}
          columns={columns}
          dataSource={limitUpData} />
      </div>
    </div>
  )
}
