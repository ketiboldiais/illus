export const generateNodes = (data, edges) => {
	let nodes = {};
	edges.forEach(function (link) {
		link.source =
			nodes[link.source] || (nodes[link.source] = { id: link.source });
		link.target =
			nodes[link.target] || (nodes[link.target] = { id: link.target });
	});
	data.forEach(function (element) {
		if (element.link.length === 1) {
			nodes[element.link[0]] = {
				id: element.link[0],
			};
		}
	});
	return nodes;
};
