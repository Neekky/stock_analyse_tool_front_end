import { useEffect, useState } from 'react'
import { thirdPartyApi } from "@/apis";
import { Tag } from 'antd';
import './index.less';

export default function Index(props) {
    const [plateList, setPlateList] = useState<any[]>([])
    const [tags, setTags] = useState<any[]>([])

    const { code, prefix } = props;

    useEffect(() => {
        if (!code || !prefix) return;
        thirdPartyApi.getStockPlateData(prefix, code).then((res: any) => {
            if (res?.success) {
                setPlateList(res?.result?.data || []);
            }
        });
    }, [code, prefix])

    useEffect(() => {
        const resTags: any[] = []
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
                <Tag className='stock-plate-tag' color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
        })}</div>
    )
}
