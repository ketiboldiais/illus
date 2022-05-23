export const generateDataFromUserFunction = (f, domain) => {
	let dataset = [];
	let x, y;
	for (let i = 0; i <= domain.length - 1; i++) {
		if (typeof f !== "function") {
			x = f;
			y = domain[i];
		} else {
			x = domain[i];
			y = f(x);
		}
		if (isNaN(y) || !isFinite(y)) {
			continue;
		} else {
			dataset.push({ x: x, y: y });
		}
	}
	return dataset;
};
