export class StockTrendPredictor {
  constructor(historicalData) {
    this.historicalData = this.validateAndSortData(historicalData);
  }

  private historicalData: any[] = [];

  validateAndSortData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid historical data");
    }

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  calculateRatio(upCount: number, downCount: number): number {
    const total = upCount + downCount;
    return total === 0 ? 0 : upCount / total;
  }

  calculateTrend(days = 5) {
    if (this.historicalData.length < days) {
      throw new Error(
        `Not enough historical data. Need at least ${days} days.`
      );
    }

    const recentData = this.historicalData.slice(-days);

    const upDownRatio = recentData.map((day) =>
      this.calculateRatio(day.upCount, day.downCount)
    );

    const limitUpDownRatio = recentData.map((day) =>
      this.calculateRatio(day.limitUpCount, day.limitDownCount)
    );

    const avgUpDownRatio =
      upDownRatio.reduce((sum, ratio) => sum + ratio, 0) / days;
    const avgLimitUpDownRatio =
      limitUpDownRatio.reduce((sum, ratio) => sum + ratio, 0) / days;

    return {
      avgUpDownRatio,
      avgLimitUpDownRatio,
      predictedTrend: this.interpretTrend(avgUpDownRatio, avgLimitUpDownRatio),
    };
  }

  interpretTrend(avgUpDownRatio, avgLimitUpDownRatio) {
    if (avgUpDownRatio > 0.55 && avgLimitUpDownRatio > 0.6) {
      return "Strong Upward";
    } else if (avgUpDownRatio > 0.5 && avgLimitUpDownRatio > 0.5) {
      return "Slight Upward";
    } else if (avgUpDownRatio < 0.45 && avgLimitUpDownRatio < 0.4) {
      return "Strong Downward";
    } else if (avgUpDownRatio < 0.5 && avgLimitUpDownRatio < 0.5) {
      return "Slight Downward";
    } else {
      return "Neutral";
    }
  }
}

// 使用示例
const historicalData = [
  {
    date: "2023-05-01",
    upCount: 2000,
    downCount: 1500,
    limitUpCount: 50,
    limitDownCount: 30,
  },
  {
    date: "2023-05-02",
    upCount: 2200,
    downCount: 1300,
    limitUpCount: 60,
    limitDownCount: 25,
  },
  // ... 更多历史数据
];

try {
  const predictor = new StockTrendPredictor(historicalData);
  const prediction = predictor.calculateTrend();
  console.log("Predicted trend:", prediction);
} catch (error: any) {
  console.error("Error:", error.message);
}

const validateAndSortData = (data) => {
  // 验证数据格式
  const validData = data.filter(
    (item) =>
      item.date &&
      typeof item.上涨家数 === "number" &&
      typeof item.下跌家数 === "number" &&
      typeof item.涨停数 === "number" &&
      typeof item.跌停数 === "number"
  );

  // 按日期排序
  return validData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const getConsecutiveUpDays = (data) => {
  const transData = validateAndSortData(data);

  let consecutiveDays = 0;
  for (let i = transData.length - 1; i >= 0; i--) {
    if (transData[i].上涨家数 > transData[i].下跌家数) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  return consecutiveDays;
};

export const predictTomorrow = (data, consecutiveDaysThreshold = 2) => {
    const consecutiveUpDays = getConsecutiveUpDays(data);

    if (consecutiveUpDays >= consecutiveDaysThreshold) {
      return {
        prediction: "下跌",
        confidence: Math.min(consecutiveUpDays / 5, 1), // 信心度，最高为1
        consecutiveUpDays: consecutiveUpDays,
      };
    } else {
      return {
        prediction: "可能上涨",
        confidence: 0.5, // 不确定的情况下，信心度为0.5
        consecutiveUpDays: consecutiveUpDays,
      };
    }
  }
