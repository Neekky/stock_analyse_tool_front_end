import { selectStockModelApi } from "@/apis";
import { useEffect, useState } from "react";
import StockItem from "./components/stockItem";
import Header from "./components/header";
import { useSelector, useDispatch } from "react-redux";
import { updateData } from "@/store/features/kdj_limit_data/kdj_limit_data_slice";
import { RootState } from "@/store/store";
import { dataConversion } from "@/utils";

export default function Index() {
  const [isFinish, setIsfinish] = useState(false);

  // 定义store相关的hooks
  const kdjData = useSelector(
    (state: RootState) => state.kdj_limit.kdjLimitData
  );

  const finishCount = useSelector(
    (state: RootState) => state.kdj_limit.finishCount
  );
  const dispatch = useDispatch();

  useEffect(() => {
    get_limit_kdj_model_data({ date: "20240826" });
  }, []);

  useEffect(() => {
    if (finishCount === kdjData.length && kdjData.length > 0 && !isFinish) {
      // 数据转换
      const copyKdjData = kdjData.map(ele => {
        const newestProfitYoy = ele?.financialData?.[0]?.numberYoy || 0;
        const newestProfitValue = ele?.financialData?.[0]?.numberValue || 0;
        return {
        ...ele,
        newestProfitYoy, 
        newestProfitColor: newestProfitValue > 0 ? '#ff004417' : '#90e29f38'
        }
      });
      // 所有股票的数据都已经获取完毕，进行归母净利润增长排序
      const result = dataConversion.quickSort(copyKdjData, 'newestProfitYoy', 'desc');
      console.log(result, '2312')

      dispatch(updateData({data: result, isUpdate: true}));
      setIsfinish(true);
    }
  }, [finishCount, kdjData.length, isFinish]);

  const get_limit_kdj_model_data = async (data) => {
    const res = await selectStockModelApi.get_limit_kdj_model_data(data);
    if (res.code === 200) {
      dispatch(updateData({data: res.data}));
    }
  };

  return (
    <div className="flex items-center	flex-col">
      <Header />

     <div className="w-10/12">
        {kdjData.map((ele, index) => (
          <StockItem
            key={ele.code + ele["涨停封单量"]}
            index={index}
            data={ele}
          />
        ))}
      </div>
    </div>
  );
}
