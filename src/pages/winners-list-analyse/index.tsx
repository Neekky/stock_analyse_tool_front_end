import React, { useEffect, useState } from 'react'
import { limitupApi } from "@/apis";
import { Table, Tag, DatePicker, message, Button } from 'antd';
import StockPlate from '../../components/stockPlate';
import StockKLine from '../../components/stockKLine';
import * as dayjs from 'dayjs';
import PlatePieChart from "../../components/platePieChart";

import './index.less'

import type { DatePickerProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<any> = [
    {
        title: '股票代码',
        dataIndex: '代码',
        key: '代码',
        render: (text: string) => text,
        width: 100,
        textWrap: 'word-break',
    },
    {
        title: '股票名称',
        dataIndex: '名称',
        key: '名称',
        render: (text: string) => text,
        width: 100,
        textWrap: 'word-break',

    },
    {
        title: '收盘价',
        dataIndex: '收盘价',
        key: '收盘价',
        render: (text: string) => text,
        sorter: (a, b) => a['收盘价'] - b['收盘价'],
        width: 20
    },
    {
        title: '成交额',
        dataIndex: '市场总成交额',
        key: '市场总成交额',
        render: (text: string) => text,
        sorter: (a, b) => a['市场总成交额'] - b['市场总成交额'],
        width: 20
    },
    {
        title: '解读',
        dataIndex: '解读',
        key: '解读',
        render: (text: string) => text,
        width: 20
    },
    {
        title: '上榜原因',
        dataIndex: `上榜原因`,
        key: `上榜原因`,
        render: (text: string) => text,
        width: 150
    },
    {
        title: '上榜后1日',
        dataIndex: `上榜后1日`,
        key: `上榜后1日`,
        render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text}</div>,
        sorter: (a, b) => a['上榜后1日'] - b['上榜后1日'],
        winth: 10
    },
    {
        title: '上榜后2日',
        dataIndex: `上榜后2日`,
        key: `上榜后2日`,
        render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text}</div>,
        sorter: (a, b) => a['上榜后2日'] - b['上榜后2日'],
        winth: 10
    },
    {
        title: '上榜后5日',
        dataIndex: `上榜后5日`,
        key: `上榜后5日`,
        render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text}</div>,
        sorter: (a, b) => a['上榜后5日'] - b['上榜后5日'],
        winth: 10
    },
    {
        title: '上榜后10日',
        dataIndex: `上榜后10日`,
        key: `上榜后10日`,
        render: (text: string) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text}</div>,
        sorter: (a, b) => a['上榜后10日'] - b['上榜后10日'],
        winth: 10
    },
];

export default function Index(props): any {

    const [limitUpData, setLimitUpData] = useState([]);

    const [date, setDate] = useState(dayjs());

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        pageGetLimitUpData(date);
    }, [date]);

    // 获取涨停股票数量
    const pageGetLimitUpData = async (queryDate: any) => {
        const dateParam = queryDate.format('YYYYMMDD');
        try {
            console.log(111, 2321312)

            const res = await limitupApi.getWinnersListData({
                start_date: dateParam,
                end_date: dateParam
            });

            console.log(res, 2321312)
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


    const onChange: DatePickerProps['onChange'] = (date: dayjs) => {
        setDate(date)
    };

    return (
        <div className="winners-wrapper">
            {contextHolder}
            {/* 板块情况分析 */}
            <div>
                板块分析：
            </div>
            <div>
                <PlatePieChart data={limitUpData} />
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
            <div class="multi-wrapper">
                <Table
                    key={date}
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
