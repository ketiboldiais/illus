export const getArrayMax = (array = []) => {
	if (array === []) {
		console.log("array is empty");
		return;
	} else {
		return Math.max.apply(null, array);
	}
}