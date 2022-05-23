import { isObjectLiteral } from "../../utils/isObjectLiteral/isObjectLiteral.js";
import { isNull } from "../../utils/isNull/isNull.js";
export const generateBinaryTreeData = (rawData) => {
	let data = [];
	const root = { child: rawData[0][0], parent: "" };
	data.push(root);
	let leftChild;
	let rightChild;
	let leftNode;
	let rightNode;
	let parent;
	for (let i = 0; i < rawData.length; i++) {
		parent = rawData[i][0];
		leftChild = rawData[i][1][0];
		rightChild = rawData[i][1][1];
		if (isNull(leftChild)) {
			leftNode = { child: "", parent, display: "none" };
		} else {
			if (isObjectLiteral(leftChild)) {
				leftNode = { child: leftChild.val, parent, ...leftChild };
			} else {
				leftNode = { child: leftChild, parent };
			}
		}
		data.push(leftNode);
		if (isNull(rightChild)) {
			rightNode = { child: "", parent, display: "none" };
		} else {
			if (isObjectLiteral(rightChild)) {
				rightNode = { child: rightChild.val, parent, ...rightChild };
			} else {
				rightNode = { child: rightChild, parent };
			}
		}
		data.push(rightNode);
	}
	return data;
};
