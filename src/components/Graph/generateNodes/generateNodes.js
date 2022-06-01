import { isObjectLiteral } from "../../utils/isObjectLiteral/isObjectLiteral";

export const generateNodes = (data, edges) => {
	let nodes = {};
	let _source, _target;
	edges.forEach(function (link) {
		console.log(link);
		if (isObjectLiteral(link.source)) {
			_source = { id: link.source.id, ...link.source };
			link.source = nodes[link.source] || (nodes[link.source.id] = _source);
		} else {
			_source = { id: link.source };
			link.source = nodes[link.source] || (nodes[link.source] = _source);
		}
		if (isObjectLiteral(link.target)) {
			_target = { id: link.target.id, ...link.target };
			link.target = nodes[link.target] || (nodes[link.target.id] = _target);
		} else {
			_target = { id: link.target };
			link.target = nodes[link.target] || (nodes[link.target] = _target);
		}
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
