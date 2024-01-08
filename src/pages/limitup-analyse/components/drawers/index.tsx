import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
// import numeral from 'numeral';
import StockPlate from "@/components/stockPlate";
import StockKLine from "@/components/stockKLine";
import "./index.less";
import { dataConversion } from "@/utils";

interface StockDetailsProps {
  stockInfo: any;
  open: boolean;
  onClose: () => void;
}

const StockDetails: React.FC<StockDetailsProps> = (props: any) => {
  const { stockInfo, open, onClose } = props;

  // 提取股票代码
  const stockCode = stockInfo["股票代码"] || stockInfo["code"] || "";

  // 提取股票名称
  const stockName = stockInfo["股票简称"] || stockInfo["名称"] || "";

  let prefix = stockCode?.substring(7, 9);

  // 如果没有前缀，就根据股票代码获取
  if (!prefix) {
    prefix = dataConversion.getExchangeByCode(stockInfo.code);
  }

  let code = stockCode?.substring(0, 6);

  if (!code) {
    code = stockInfo.code;
  }

  // 提取上榜原因
  const reason = stockInfo["上榜原因"] || "";

  const [drawerOpen, setDrawerOpen] = useState(open);

  useEffect(() => {
    setDrawerOpen(open);
  }, [open]);

  return (
    <Drawer
      title={`${stockName} · 数据详情`}
      open={drawerOpen}
      onClose={onClose}
      width={1200}
    >
      {/* 股票K线 */}
      <StockKLine data={stockInfo} />
      <div className="gap"></div>

      {/* 所属板块 */}
      <h3 className="drawers-title">所属板块</h3>
      <StockPlate prefix={prefix} code={code} />

      <div className="gap"></div>

      {/* 上榜原因 */}
      {reason ? (
        <>
          <h3 className="drawers-title">上榜原因</h3>
          <p>{reason}</p>
        </>
      ) : null}


    </Drawer>
  );
};

export default StockDetails;
