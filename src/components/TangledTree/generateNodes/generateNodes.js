export const generateNodes = (_levels) => {
	let nodes = _levels.reduce((a, x) => a.concat(x), []);
	let node, i;
	let nodeIndex = {};
	for (i = 0; i < nodes.length; i++) {
		node = nodes[i];
		nodeIndex[node.id] = node;
	}
	for (i = 0; i < nodes.length; i++) {
		node = nodes[i];
		node.parents = (node.parents === undefined ? [] : node.parents).map(
			(p) => nodeIndex[p],
		);
	}
	return nodes;
};