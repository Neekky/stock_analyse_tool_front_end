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

export default {
  myToFixed,
  splitData,
  calculateMA,
  sortAndAddIndex,
};
