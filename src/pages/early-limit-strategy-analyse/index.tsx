import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, DatePicker, message, Button } from 'antd';
import type { DatePickerProps } from 'antd';
import type { Dayjs as Dtype } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { limitupApi } from '@/apis';
import dayjs from 'dayjs';
import IncCalculate from './components/inc-calculate';

const EarlyLimitStrategyAnalyse: React.FC = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const [date, setDate] = useState(dayjs(new Date()));

    const [limitData, setLimitData] = useState([]);

    // 股票详情
    const [, setStockInfo] = useState<any>(null);

    // 控制股票详情弹窗是否打开
    const [, setOpen] = useState(false);

    useEffect(() => {
        pageGetEarlyLimit(date);
        // stockInfoApi.get_stock_fundamentals('杭州高新').then(res => {
        //     console.log(res, 'stockInfoApi.get_stock_fundamentals');
        //     const a = JSON.parse(res.fundTxt)
        //     const b = JSON.parse(res.capacity)
        //     console.log(a);
        //     console.log(b);
        // });
    }, [date]);

    const wrapHandleViewDetail = useCallback((key: React.Key) => {
        const item = limitData.find(ele => ele['股票简称'] === key);
        setStockInfo(item);
        setOpen(true);
    }, [limitData]);

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '股票代码',
                dataIndex: '股票代码',
                key: '股票代码',
                render: (text: string) => {
                    const prefix = text?.substring(7, 9).toLocaleLowerCase();
                    const code = text?.substring(0, 6);
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
            {
                title: '竞价涨幅',
                dataIndex: '竞价涨幅',
                key: '竞价涨幅',
                render: (text) => <div style={{ color: Number(text) > 0 ? 'red' : 'green' }}>{text}%</div>,
                sorter: (a, b) => a['竞价涨幅'] - b['竞价涨幅'],
            },
            {
                title: '集合竞价评级',
                dataIndex: '集合竞价评级',
                key: '集合竞价评级',
                render: (text) => <div style={{ color: text === '看多' ? 'red' : 'green' }}>{text}</div>,
            },
            {
                title: '当日收盘涨幅',
                dataIndex: '股票简称',
                key: '股票简称',
                render: (_, row) => {
                    return <IncCalculate code={row.code} date={date} />
                },
            },
            {
                title: '竞价异动原因',
                dataIndex: '竞价异动原因',
                key: '竞价异动原因',
                render: (text) => text,
            },

            {
                title: '操作',
                dataIndex: 'operation',
                render: (_, record: { key: React.Key }) =>
                    <Button title="Sure to delete?" onClick={() => wrapHandleViewDetail(record.key)}>
                        <a>详情</a>
                    </Button>
            },
        ]
    }, [wrapHandleViewDetail, date]);

    const onChange: DatePickerProps['onChange'] = (date: any | Dtype) => {
        setDate(date)
    };

    // 
    const pageGetEarlyLimit = async (queryDate) => {
        const dateParam = queryDate.format('YYYYMMDD');
        try {
            const res = await limitupApi.getEarlyLimitData({
                date: dateParam,
            });

            if (res.code !== 200) {
                messageApi.open({
                    type: 'error',
                    content: '当日无数据',
                });
            } else {
                const firstDealData = res.data?.map((ele) => ({ ...ele, key: ele['股票简称'] }));
                console.log(firstDealData, 'firstDealData is')
                setLimitData(firstDealData)
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: '当日无数据',
            });
        }
    }

    return (
        <div className='early-limit-wrapper'>
            {contextHolder}
            <div className="header-wrapper">
                {/* 涨停情况 */}
                <div>
                    涨停数量： {limitData.length}
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
                    dataSource={limitData} />
            </div>
        </div>
    );
};

export default EarlyLimitStrategyAnalyse;
