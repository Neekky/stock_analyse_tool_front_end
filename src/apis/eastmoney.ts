import { Axios } from "@/utils"; // 导入 api

export default new (class User extends Axios {
    // 获取涨停板数据
    // num为连板数
    getStockPlateData(prefix: string, code: string) {
        const url = `https://datacenter.eastmoney.com/securities/api/data/get?type=RPT_F10_CORETHEME_BOARDTYPE&sty=BOARD_NAME&filter=(SECUCODE=%22${code}.${prefix}%22)&client=PC`
        return this.get(url);
    }
})();