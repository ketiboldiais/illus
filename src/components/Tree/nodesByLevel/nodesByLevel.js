export const nodesByLevel = (nodeList) => {
	const arr = [];
	let depth = nodeList[0].depth;
	arr.push(nodeList[0]);
	for (let i = 0; i < nodeList.length; i++) {
		if (nodeList[i].depth > depth) {
			arr.push(nodeList[i]);
			depth = nodeList[i].depth;
		}
	}
	return arr;
};
