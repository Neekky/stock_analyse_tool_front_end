
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

/**
* 深拷贝一个对象或数组。
* @param obj - 需要拷贝的对象或数组。
* @param cache - 用于处理循环引用的缓存。
* @returns 深拷贝后的对象或数组。
*/
export const deepClone = <T>(obj: T, cache: WeakMap<object, unknown> = new WeakMap()): T => {
   // 处理基本数据类型及 null
   if (obj === null || typeof obj !== 'object') {
       return obj;
   }

   // 处理循环引用
   if (cache.has(obj)) {
       return cache.get(obj) as T;
   }

   // 创建一个新对象或数组
   const newObj = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
   
   // 将新对象记录到缓存中
   cache.set(obj, newObj);

   // 递归拷贝每个属性
   for (const key in obj) {
       if (Object.prototype.hasOwnProperty.call(obj, key)) {
           (newObj as any)[key] = deepClone((obj as any)[key], cache);
       }
   }

   return newObj as T;
}

// 标准化数据（将数据转换到0-1区间）
export const normalize = (data, key) => {
  if (!data.length) return [];
  
  const values = data.map(d => d[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return data.map(d => (d[key] - min) / (max - min));
}

