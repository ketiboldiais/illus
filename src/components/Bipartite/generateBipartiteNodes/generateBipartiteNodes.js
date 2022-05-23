export const generateBipartiteNodes = (data, edges) => {
	let nodes = {};
	edges.forEach(function (link) {
		link.source =
			nodes[link.source] || (nodes[link.source] = { name: link.source });
		link.target =
			nodes[link.target] || (nodes[link.target] = { name: link.target });
	});
	data.forEach(function (element) {
		if (element.link.length === 1) {
			nodes[element.link[0]] = {
				name: element.link[0],
			};
		}
	});
	return Object.values(nodes);
};
