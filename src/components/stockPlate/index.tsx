import React, { useEffect, useState } from 'react'
import { eastmoneyApi } from "@/apis";
import { Tag } from 'antd';

export default function Index(props) {
    const [plateList, setPlateList] = useState([])
    const [tags, setTags] = useState([])

    const { code, prefix } = props;

    useEffect(() => {
        eastmoneyApi.getStockPlateData(prefix, code).then((res: any) => {
            if (res?.success) {
                setPlateList(res?.result?.data || []);
            }
        });
    }, [])

    useEffect(() => {
        const resTags = []
        plateList.forEach((ele: any) => {
            if (!ele.BOARD_NAME.includes('含一字')) {
                resTags.push(ele.BOARD_NAME)
            }
        })
        setTags(resTags);
    }, [plateList])

    return (
        <div>
            {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
        })}</div>
    )
}
