import React from 'react';
import { Drawer } from 'antd';

interface StockDetailsProps {
    stockInfo: any;
    open: boolean;
    onClose: () => void;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stockInfo, open, onClose }) => {
    return (
        <Drawer
            title="Stock Details"
            open={open}
            onClose={onClose}
            width={400}
        >
            <p>Stock Name: {stockInfo.name}</p>
            <p>Stock Symbol: {stockInfo.symbol}</p>
        </Drawer>
    );
};

export default StockDetails;
