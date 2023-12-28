import React, { useState } from 'react';
import { Drawer } from 'antd';

const Drawers = ({ isOpen }) => {
    const [visible, setVisible] = useState(isOpen);

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <div>
            <Drawer
                visible={visible}
                onClose={handleClose}
            >
            <div>123</div>
            </Drawer>
        </div>
    );
};

export default Drawers;
