import { useRef, useEffect } from 'react'
import { stockklineApi } from '@/apis';
import { Calculate } from '@/utils';
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';

// echarts配置
const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';

export default function Index(props: any) {
  const { data } = props;
  const echartInstanceRef = useRef<EChartsType | null>(null);
  console.log(data, 1332);
  const echartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    echartInstanceRef.current = echarts.init(echartDivRef.current);
    getKLineData();
  }, [])

  const getKLineData = () => {
    const start_date = dayjs(new Date()).subtract(6, 'month').format('YYYYMMDD')
    // 获取K线数据
    console.log(data, start_date + 123, 1332);
    stockklineApi.getStockKLine({
      symbol: ('' + data.code).padStart(6, '0'),
      start_date: start_date,
      end_date: dayjs(new Date()).format('YYYYMMDD'),
    }).then(res => {
      const dealData: any[] = [];
      res.forEach((item: any) => {
        const date = dayjs(item['日期']).format('YYYY/MM/DD')
        const open = item['开盘']
        const close = item['收盘']
        const lowest = item['最低']
        const highest = item['最高']

        // 日期、开、高、低、收
        dealData.push([
          date,
          open,
          close,
          lowest,
          highest
        ])
      });
      const splitDataResult = Calculate.splitData(dealData);
      const echartsOptions:any = {
        title: {
          text: '上证指数',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: splitDataResult.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            data: splitDataResult.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor
            },
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? param.value + '' : '';
                }
              },
              data: [
                {
                  name: 'Mark',
                  coord: ['2013/5/31', 2300],
                  value: 2300,
                  itemStyle: {
                    color: 'rgb(41,60,85)'
                  }
                },
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }
            },
            markLine: {
              symbol: ['none', 'none'],
              data: [
                [
                  {
                    name: 'from lowest to highest',
                    type: 'min',
                    valueDim: 'lowest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  },
                  {
                    type: 'max',
                    valueDim: 'highest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  }
                ],
                {
                  name: 'min line on close',
                  type: 'min',
                  valueDim: 'close'
                },
                {
                  name: 'max line on close',
                  type: 'max',
                  valueDim: 'close'
                }
              ]
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: Calculate.calculateMA(5, splitDataResult),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: Calculate.calculateMA(10, splitDataResult),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA20',
            type: 'line',
            data: Calculate.calculateMA(20, splitDataResult),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: Calculate.calculateMA(30, splitDataResult),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          }
        ]
      };
      echartInstanceRef.current?.setOption(echartsOptions);
    })
  }

  return (
    <div>
      <div ref={echartDivRef} style={{ minHeight: "400px", width: "800px", marginTop: "10px" }}></div>
    </div>
  )
}
