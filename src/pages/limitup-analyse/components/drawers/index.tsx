import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
// import numeral from 'numeral';
import StockPlate from "@/components/stockPlate";
import StockKLine from "@/components/stockKLine";
import "./index.less";

interface StockDetailsProps {
  stockInfo: any;
  open: boolean;
  onClose: () => void;
}

const StockDetails: React.FC<StockDetailsProps> = (props: any) => {
  const { stockInfo, open, onClose } = props;

  const stockCode = stockInfo["股票代码"];
  const prefix = stockCode?.substring(7, 9);
  const code = stockCode?.substring(0, 6);

  const [drawerOpen, setDrawerOpen] = useState(open);

  useEffect(() => {
    setDrawerOpen(open);
  }, [open]);

  return (
    <Drawer
      title={`${stockInfo["股票简称"]} · 数据详情`}
      open={drawerOpen}
      onClose={onClose}
      width={1200}
    >
      <StockKLine data={stockInfo} />
      <div className="gap"></div>
      <StockPlate prefix={prefix} code={code} />
    </Drawer>
  );
};

export default StockDetails;
