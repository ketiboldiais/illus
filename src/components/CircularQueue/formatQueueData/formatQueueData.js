import { isObjectLiteral } from "../../utils/isObjectLiteral/isObjectLiteral";

export const formatQueueData = (arr = []) => {
	let data = [];
	for (let i = 0; i < arr.length; i++) {
		if (isObjectLiteral(arr[i])) {
			data.push(arr[i]);
		} else {
			let queuer = { val: arr[i], data: 1 };
			data.push(queuer);
		}
	}
	return data;
};
