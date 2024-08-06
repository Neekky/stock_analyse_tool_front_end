import './index.less'

export default function Index(props) {
  const { data } = props;
  return (
    <div className="stock-item-wrap">
      <div><span className='text-[15px] text-[#ff2244]'>股票简称</span> {data.股票简称}</div>
      <div><span className='text-[15px] text-[#ff2244]'>涨停封单量占成交量比</span> {data.涨停封单量占成交量比}</div>
    </div>
  );
}
