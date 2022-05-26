import { generateDataFromUserFunction } from "../generateDataFromUserFunction/generateDataFromUserFunction";

export const generateFunctionData = (
	paramFunctions,
	userFunctions,
	samples,
	_domainUpperBound,
	_domainLowerBound,
	_rangeUpperBound,
	_rangeLowerBound,
) => {
	let group = {};
	let groups = [];
	let data = [];
	if (userFunctions === undefined) {
		return;
	} else {
		for (let i = 0; i < userFunctions.length; i++) {
			let func = userFunctions[i];
			data.push(
				generateDataFromUserFunction(
					func,
					samples,
					_domainUpperBound,
					_domainLowerBound,
					_rangeUpperBound,
					_rangeLowerBound,
				),
			);
			group = {
				group: i,
				data: generateDataFromUserFunction(
					func,
					samples,
					_domainUpperBound,
					_domainLowerBound,
					_rangeUpperBound,
					_rangeLowerBound,
				),
				...paramFunctions[i],
			};
			groups.push(group);
		}
	}
	return groups;
};
