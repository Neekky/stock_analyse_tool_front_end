import { allInfoApi } from "@/apis";
import React, { useEffect, useState } from "react";
import "./index.less";

const HotPlateRank = (props: any) => {
  const { setPid } = props;

  const [plateData, setPlateData] = useState([]);

  useEffect(() => {
    get_hot_plate_data("20240116");
  }, []);

  const get_hot_plate_data = async (date: string) => {
    const res = await allInfoApi.get_hot_plate_data(date);
    if (res.code === 200) {
      const data = JSON.parse(res.data);
      setPlateData(data);
      console.log(data);
    }
  };

  return (
    <div className="hot-plate-wrap">
      <div className="title">今日热点板块</div>
      <div className="plate-list-wrap">
        {plateData.map((ele: any) => {
          return (
            <div onClick={() => setPid(ele.code)} className="plate-item" key={ele.code}>
              <div className="rank-tag">{ele?.order}</div>
              <div className="item-name">{ele?.name}</div>
              {ele?.hot_tag && (
                <div className="hot-tag-wrap">{ele?.hot_tag}</div>
              )}
              {ele?.tag && <div className="tag-wrap">{ele?.tag}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotPlateRank;
