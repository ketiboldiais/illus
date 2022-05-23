export const generateLevels = (_nodes) => {
	let node;
	for (let i = 0; i < _nodes.length; i++) {
		node = _nodes[i];
		node.level = i;
	}
	return _nodes;
};
