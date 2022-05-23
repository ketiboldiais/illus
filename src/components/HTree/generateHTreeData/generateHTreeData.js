import { isObjectLiteral } from "../../utils/isObjectLiteral/isObjectLiteral";

export const generateHTreeData = (rawData) => {
	let data = [];
	let root = { child: rawData[0][0], parent: "" };
	data.push(root);
	let node;
	let parent;
	for (let i = 1; i < rawData.length; i++) {
		if (isObjectLiteral(rawData[i])) {
			data.push(rawData[i]);
		} else {
			parent = rawData[i][0];
			for (let j = 1; j < rawData[i].length; j++) {
				node = {
					child: rawData[i][j],
					parent: parent,
				};
				data.push(node);
			}
		}
	}
	return data;
};
