import { useState, useEffect } from 'react';
import { stockklineApi } from '@/apis';
import dayjs from 'dayjs';

const IncCalculate = (props: any) => {
    const { code, date } = props;

    const [onday, setOnday] = useState(0);
    const [today, setToday] = useState(0);
    const [todayDate] = useState(dayjs(new Date()).format('YYYYMMDD'));

    useEffect(() => {
        getKLineData()
    }, [code, date])

    const getKLineData = () => {
        const start_date = dayjs(date).format('YYYYMMDD');
        const end_date = todayDate;
        // 获取K线数据
        stockklineApi.getStockKLine({
            symbol: ('' + code).padStart(6, '0'),
            start_date,
            end_date,
            is_head_end: '1'
        }).then(res => {
            console.log(res, 213213)
            setOnday(res[0]?.['涨跌幅']);
            setToday(res[1]?.['涨跌幅']);
            console.log('res', res);
        });
    }

    return (
        <div>
            <div>当日涨跌幅：<span style={{ color: onday > 0 ? 'red' : 'green' }}>{onday}%</span></div>
            {date !== todayDate ? <div>今日涨跌幅：<span style={{ color: today > 0 ? 'red' : 'green' }}>{today}%</span></div> : null}
        </div>
    );
};

export default IncCalculate;
