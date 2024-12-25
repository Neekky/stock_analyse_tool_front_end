/**
 * 计算最新连续单边走势的天数
 * @param {Array} data - 按时间升序排列的数据数组，每个元素包含date, rise, fall
 * @returns {Object} - { trend: 'rise' | 'fall', count: Number }
 */
export const getCurrentTrendStreak = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { trend: null, count: 0 };
    }
    let currentTrend: any = null;
    // 从最新数据开始
    const latest: any = data[data.length - 1];
    if (latest.上涨家数 > latest.下跌家数) {
      currentTrend = '涨家数更多';
    } else if (latest.下跌家数 > latest.上涨家数) {
      currentTrend = '跌家数更多';
    } else {
      // 如果涨跌家数相等，则没有趋势
      return { trend: null, count: 0 };
    }
  
    let count = 1; // 包含最新一天
  
    // 从倒数第二天开始往前遍历
    for (let i = data.length - 2; i >= 0; i--) {
      const day = data[i];
      if (currentTrend === '涨家数更多' && day.上涨家数 > day.下跌家数) {
        count++;
      } else if (currentTrend === '跌家数更多' && day.下跌家数 > day.上涨家数) {
        count++;
      } else {
        break; // 趋势被打破，退出循环
      }
    }
  
    return { trend: currentTrend, count };
  }
  

  