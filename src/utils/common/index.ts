export function safeJsonStringify(obj, defaultValue = "{}") {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    // 处理错误，例如忽略循环引用或自定义对象
    console.error("JSON stringify error:", error);
    return defaultValue; // 返回一个空对象
  }
}

export function safeJsonParse(json, defaultValue = {}) {
  try {
    return JSON.parse(json);
  } catch (error) {
    // 处理解析错误，例如格式错误的 JSON
    console.error("JSON parse error:", error);
    return defaultValue; // 返回一个空对象
  }
}

export const INDEX_NAME_MAP = {
  sh000001: "上证指数",
  sz399001: "深证成指",
  sz399006: "创业板指",
  sh000016: "上证50",
  sh000903: "中证100",
  sz399330: "深证100",
  sh000300: "沪深300",
  sh000905: "中证500",
  sh000906: "中证800",
  sh000852: "中证1000",
};
