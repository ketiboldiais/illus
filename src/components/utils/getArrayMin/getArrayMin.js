export const getArrayMin = (array = []) => {
	if (array === []) {
		console.log("array is empty");
		return;
	} else {
		return Math.min.apply(null, array);
	}
};
