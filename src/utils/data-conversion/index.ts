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

export default {
	countSubWordsWithMapping,
  getExchangeByCode
}
