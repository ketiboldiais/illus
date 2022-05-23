import { generateDataFromUserFunction } from "../generateDataFromUserFunction/generateDataFromUserFunction";

export const generateFunctionData = (paramFunctions, userFunctions, domain) => {
	let group = {};
	let groups = [];
	let data = [];
	if (userFunctions === undefined) {
		return;
	} else {
		for (let i = 0; i < userFunctions.length; i++) {
			let func = userFunctions[i];
			data.push(generateDataFromUserFunction(func, domain));
			group = {
				group: i,
				data: generateDataFromUserFunction(func, domain),
				...paramFunctions[i],
			};
			groups.push(group);
		}
	}
	return groups;
}
