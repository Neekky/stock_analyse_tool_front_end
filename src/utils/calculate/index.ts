export function calculateMA(dayCount: number, data: any) {
	var result = [];
	for (var i = 0, len = data.values.length; i < len; i++) {
		if (i < dayCount) {
			result.push('-');
			continue;
		}
		var sum = 0;
		for (var j = 0; j < dayCount; j++) {
			sum += +data.values[i - j][1];
		}
		result.push(sum / dayCount);
	}
	return result;
}

// 拆分数据
export function splitData(rawData: any) {
	const categoryData = [];
	const values = [];
	for (var i = 0; i < rawData.length; i++) {
		categoryData.push(rawData[i].splice(0, 1)[0]);
		values.push(rawData[i]);
	}
	return {
		categoryData: categoryData,
		values: values
	};
}

export function sortAndAddIndex(array: any[], type: string, sort: string = 'asc') {
	let origin = array;
	if (sort === 'asc') {
		origin = array.sort((a, b) => a?.[type] - b?.[type]);
	} else {
		origin = array.sort((a, b) => b?.[type] - a?.[type]);
	}

	for (let i = 0; i < origin.length; i++) {
		origin[i] = { ...origin[i], [`${type}_rank`]: i };
	}
	return origin;
}


export default {
	splitData,
	calculateMA,
	sortAndAddIndex
}