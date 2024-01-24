import { allInfoApi } from "@/apis";
import { useEffect, useState } from "react";
import "./index.less";
import { Amount } from "@/utils";

const HotPlateStockList = (props: any) => {
  const { id, allStockData } = props;

  const [plateData, setPlateData] = useState([]);

  useEffect(() => {
    console.log(id, "id变化");
    get_hot_plate_stock_data(id);
  }, [id, allStockData.length]);

  // 获取热点板块龙头股
  const get_hot_plate_stock_data = async (pid: string) => {
    const res = await allInfoApi.get_hot_plate_stock_data(pid);
    console.log(res, "热点板块龙头股");
    if (res.code === 200) {
      console.log(res);
      const data = res.data;
      const finalNormalData = data.normal.map((ele: any) => {
        const stock = allStockData.find(
          (item: any) => item["代码"] === ele.stockCode
        );
        return {
          ...ele,
          ...stock,
        };
      });

      // 对数据进行去重，根据stockCode进行重复数据判断
      const dealData = finalNormalData?.reduce((acc: any, cur: any) => {
        const hasEle = acc.find((ele: any) => ele.stockCode === cur.stockCode);
        if (!hasEle) {
          acc.push(cur);
        }
        return acc;
      }, []);
      console.log(dealData, "dealData");
      setPlateData(dealData);
    }
  };

  return (
    <div className="hot-plate-stock-wrap">
      <div className="title">热点板块龙头股</div>
      {/* 表头 */}
      <div className="table-header">
        <div className="table-item header-price">最新价</div>
        <div className="table-item header-rate">涨跌幅</div>
        <div className="table-item header-market">流通市值</div>
        <div className="table-item header-exchange">换手率</div>
        <div className="table-item header-sixty-rate">60日涨跌幅</div>
      </div>
      <div className="stock-list-wrap">
        {plateData.map((ele: any) => {
          return (
            <div
              className="stock-item"
              key={ele.stockCode + ele?.upTimes + ele?.tag}
            >
              <div className="stock-basic-info">
                <div className="item-name">{ele?.["名称"]}</div>
                <div className="item-code">{ele?.stockCode}</div>
                <div className="item-tags">
                  {ele?.tag ? <div className="tag-wrap">{ele?.tag}</div> : null}
                  {ele?.upTimes ? (
                    <div className="tag-wrap">领涨 {ele?.upTimes} 次</div>
                  ) : null}
                  {ele?.days ? (
                    <div className="tag-wrap">{ele?.days}</div>
                  ) : null}
                </div>
              </div>

              <div className="info-item-basic item-price">
                {ele?.["最新价"]}
              </div>
              <div className="info-item-basic item-rate">
                {ele?.["涨跌幅"]}%
              </div>
              <div className="info-item-basic item-market">
                {Amount.formatLargeAmount(ele?.["流通市值"])}
              </div>
              <div className="info-item-basic item-exchange">
                {ele?.["换手率"]}%
              </div>
              <div style={{color: ele?.["60日涨跌幅"] < 0 ? '#11a43b' : '#f03e11'}} className="info-item-basic item-sixty-rate">
                {ele?.["60日涨跌幅"]}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotPlateStockList;
