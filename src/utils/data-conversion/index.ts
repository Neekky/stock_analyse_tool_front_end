import dayjs from "dayjs";

const countSubWordsWithMapping = (phrases: any[] = []) => {
  const countDict: any = {};
  const phraseMapping: any = {};
  const resultArray: any[] = [];
  
  // 遍历每个短语
  phrases.filter(tag => tag).forEach(phrase => {
    let foundSubWord = false;

    // 检查字典中的每个现有单词是否是当前短语的子字符串
    Object.keys(countDict)?.forEach(subWord => {
      if (phrase?.includes(subWord)) {
        countDict[subWord] += 1;
        phraseMapping[subWord]?.push(phrase);
        foundSubWord = true;
      }
    });

    // 如果当前短语不是任何现有单词的子字符串
    // 将其所有可能的子字符串添加到字典中
    if (!foundSubWord) {
      phrase?.split(' ')?.forEach(subWord => {
        if (!(subWord in countDict)) {
          countDict[subWord] = 1;
          phraseMapping[subWord] = [phrase];
        }
      });
    }
  });

  // 创建结果数组
  for (const [word, count] of Object.entries(countDict)) {
    resultArray?.push({
      word: word,
      count: count,
      mappingsWord: phraseMapping[word]
    });
  }

  // 根据出现次数排序结果数组
  resultArray?.sort((a, b) => b?.count - a?.count);
  return resultArray;
}

const getExchangeByCode = (code: string) => {
  if (code?.length === 6) {
    if (code.startsWith('60') || code.startsWith('900') || code.startsWith('688')) {
      return 'SH'
    } else if (code.startsWith('00') || code.startsWith('30') || code.startsWith('200')) {
      return 'SZ'
    } else if (code.startsWith('8') || code.startsWith('43')) {
      return 'BJ'
    }
  }
  return '';
}

// desc降序， asc升序
const quickSort = (arr: any[], key: string, order: 'asc' | 'desc' = 'asc') => {
  if (!Array.isArray(arr) || arr.length <= 1) return arr;

  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  const lessThanPivot: any[] = [];
  const greaterThanPivot: any[] = [];
  
  for (let i = 0; i < arr.length; i++) {
      if (i === pivotIndex) continue;

      if (order === 'asc') {
          if (arr[i][key] < pivot[key]) {
              lessThanPivot.push(arr[i]);
          } else {
              greaterThanPivot.push(arr[i]);
          }
      } else if (order === 'desc') {
          if (arr[i][key] > pivot[key]) {
              lessThanPivot.push(arr[i]);
          } else {
              greaterThanPivot.push(arr[i]);
          }
      } else {
          throw new Error("排序必须是升序或者降序");
      }
  }

  return [...quickSort(lessThanPivot, key, order), pivot, ...quickSort(greaterThanPivot, key, order)];
}

const flattenArray = (arr) => {
  // 检查输入是否为数组
  if (!Array.isArray(arr)) {
    return [];
  }

  // 使用 reduce 方法递归扁平化数组
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      // 如果当前值是数组,递归调用 flattenArray
      return acc.concat(flattenArray(val));
    } else if (val !== undefined) {
      // 只添加非 undefined 的值
      return acc.concat(val);
    }
    // 忽略 undefined 值
    return acc;
  }, []);
}

/**
 * 筛选出距今3个月以内的元素
 * @param {Array} array - 包含日期属性的对象数组
 * @param {string} dateProperty - 日期属性的名称
 * @returns {Array} - 筛选后的数组
 */
const filterWithinThreeMonths = (array, dateProperty) => {
  const threeMonthsAgo = dayjs().subtract(1, 'month');
  const threeMonthsNext = dayjs().add(1, 'month');
  
  return array.filter(item => {
    const itemDate = dayjs(item[dateProperty]);
    return itemDate.isAfter(threeMonthsAgo) && itemDate.isBefore(threeMonthsNext);
  });
}

export default {
  filterWithinThreeMonths,
	countSubWordsWithMapping,
  getExchangeByCode,
  quickSort,
  flattenArray
}
