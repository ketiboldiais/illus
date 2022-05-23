export const linkNodes = (_nodes) => {
	let links = [];
	_nodes.forEach((d) => {
		d.parents.forEach((p) =>
			links.push({ source: d, bundle: d.bundle, target: p }),
		);
	});
	return links;
};
