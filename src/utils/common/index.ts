export function safeJsonStringify(obj, defaultValue = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      // 处理错误，例如忽略循环引用或自定义对象
      console.error('JSON stringify error:', error);
      return defaultValue; // 返回一个空对象
    }
  }
  
export function safeJsonParse(json, defaultValue = {}) {
    try {
      return JSON.parse(json);
    } catch (error) {
      // 处理解析错误，例如格式错误的 JSON
      console.error('JSON parse error:', error);
      return defaultValue; // 返回一个空对象
    }
  }