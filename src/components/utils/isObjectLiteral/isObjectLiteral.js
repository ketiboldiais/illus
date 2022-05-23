export const isObjectLiteral = (expression) => {
	let testCase = expression;

	const case1 = typeof expression !== "object" || expression === null;

	const case2 = () =>
		Object.getPrototypeOf((testCase = Object.getPrototypeOf(testCase))) ===
		null;

	return case1
		? false
		: (() => {
				while (!false) {
					if (case2()) break;
				}
				return Object.getPrototypeOf(expression) === testCase;
		  })();
};
