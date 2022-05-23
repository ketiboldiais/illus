import { isObjectLiteral } from "../../utils/isObjectLiteral/isObjectLiteral";

export const generateTreeData = (rawData) => {
	let data = [];
	for (let i = 0; i < rawData.length; i++) {
		if (isObjectLiteral(rawData[i])) {
			data.push(rawData[i]);
		} else {
			let node = {
				child: rawData[i][0],
				parent: rawData[i][1],
			};
			data.push(node);
		}
	}
	return data;
};
