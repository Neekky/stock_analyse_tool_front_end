export function calculateMA(dayCount: number, data: any) {
  const result: any[] = [];
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += +data.values[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}

// 拆分数据
export function splitData(rawData: any) {
  const categoryData: any[] = [];
  const values: any[] = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
  }
  return {
    categoryData: categoryData,
    values: values,
  };
}

export function sortAndAddIndex(
  array: any[],
  type: string,
  sort: string = "asc"
) {
  let origin = array;
  if (sort === "asc") {
    origin = array.sort((a, b) => a?.[type] - b?.[type]);
  } else {
    origin = array.sort((a, b) => b?.[type] - a?.[type]);
  }

  for (let i = 0; i < origin.length; i++) {
    origin[i] = { ...origin[i], [`${type}_rank`]: i };
  }
  return origin;
}

export function myToFixed(num, digits) {
  // 处理非数字或 NaN 的情况
  if (isNaN(num)) {
    return "NaN";
  }

  // 处理 Infinity 的情况
  if (!isFinite(num)) {
    return num.toString();
  }

  const sign = num < 0 ? "-" : "";
  const multiplier = Math.pow(10, digits);
  const rounded = Math.round(Math.abs(num) * multiplier) / multiplier;

  // 处理小数点后位数不足的情况
  return sign + rounded.toFixed(digits);
}

// chartUtils.js

/**
 * 计算EMA (指数移动平均线)
 * @param {Array} data - 原始数据数组，每个元素应该是一个包含收盘价的对象
 * @param {number} period - EMA周期
 * @param {string} [priceKey='close'] - 价格在数据对象中的键名
 * @returns {Array} - 包含EMA值的数组
 */
export function calculateEMA(data, period, priceKey = '2') {
  if (!Array.isArray(data) || data.length === 0 || period <= 0) {
    return [];
  }
  const ema = new Array(period - 1).fill(null);  // 填充初始值
  const k = 2 / (period + 1);
  
  // 计算第一个EMA值
  let sum = 0;
  for (let i = 0; i < period; i++) {
    if (data[i] && typeof data[i][priceKey] === 'number') {
      sum += data[i][priceKey];
    } else {
      return [];  // 如果数据无效，返回空数组
    }
  }
  ema.push(sum / period);

  // 计算剩余的EMA值
  for (let i = period; i < data.length; i++) {
    if (typeof data[i][priceKey] === 'number') {
      const newEma = (data[i][priceKey] - ema[ema.length - 1]) * k + ema[ema.length - 1];
      ema.push(newEma);
    } else {
      ema.push(ema[ema.length - 1]);  // 如果遇到无效数据，使用前一个EMA值
    }
  }
  return ema;
}



export default {
  calculateEMA,
  myToFixed,
  splitData,
  calculateMA,
  sortAndAddIndex,
};
