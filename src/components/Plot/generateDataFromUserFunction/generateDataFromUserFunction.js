export const generateDataFromUserFunction = (
	f,
	samples,
	_domainUpperBound,
	_domainLowerBound,
	_rangeUpperBound,
	_rangeLowerBound,
) => {
	let dataset = [];
	let x, y;
	for (let i = -samples; i < samples; i++) {
		x = (i / samples) * _domainUpperBound;
		y = f(x);
		if (
			y >= 2 * _rangeUpperBound ||
			y <= 2 * _rangeLowerBound ||
			isNaN(y)
		) {
			y = null;
		}
		dataset.push({ x, y });
	}
	// for (let i = 0; i <= domain.length - 1; i++) {
	// 	if (typeof f !== "function") {
	// 		x = f;
	// 		y = domain[i];
	// 	} else {
	// 		x = domain[i];
	// 		y = f(x);
	// 	}
	// 	if (isNaN(y) || !isFinite(y)) {
	// 		continue;
	// 	} else {
	// 		dataset.push({ x: x, y: y });
	// 	}
	// }
	return dataset;
};
