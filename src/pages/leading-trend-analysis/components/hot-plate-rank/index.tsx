import { allInfoApi } from '@/apis';
import React, { useEffect } from 'react';

const HotPlateRank: React.FC = () => {

    useEffect(() => {
        get_hot_plate_data('20240115')
    }, []);

    const get_hot_plate_data = async (date: string) => {
        const res = await allInfoApi.get_hot_plate_data(date);

        console.log(res);
    }

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
};

export default HotPlateRank;
