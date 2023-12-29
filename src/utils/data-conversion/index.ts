export const countSubWordsWithMapping = (phrases) => {
  const countDict = {};
  const phraseMapping = {};
  const resultArray = [];

  // 遍历每个短语
  phrases.forEach(phrase => {
    let foundSubWord = false;

    // 检查字典中的每个现有单词是否是当前短语的子字符串
    Object.keys(countDict).forEach(subWord => {
      if (phrase.includes(subWord)) {
        countDict[subWord] += 1;
        phraseMapping[subWord].push(phrase);
        foundSubWord = true;
      }
    });

    // 如果当前短语不是任何现有单词的子字符串
    // 将其所有可能的子字符串添加到字典中
    if (!foundSubWord) {
      phrase.split(' ').forEach(subWord => {
        if (!(subWord in countDict)) {
          countDict[subWord] = 1;
          phraseMapping[subWord] = [phrase];
        }
      });
    }
  });

  // 创建结果数组
  for (const [word, count] of Object.entries(countDict)) {
    resultArray.push({
      word: word,
      count: count,
      mappingsWord: phraseMapping[word]
    });
  }

  // 根据出现次数排序结果数组
  resultArray.sort((a, b) => b.count - a.count);

  return resultArray;
}
