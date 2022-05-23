import { setValue } from "../../utils/setValue/setValue";
export const generateBipartiteEdges = (data) => {
	let edges = [];
	let edge;
	let datum;
	let setLength;
	let val;
	for (let i = 0; i < data.length; i++) {
		datum = data[i];
		setLength = datum.link.length;
		val = setValue(datum.val, 1);
		if (setLength > 1) {
			for (let k = 0; k < setLength; k++) {
				let current = data[i].link[k];
				let next = data[i].link[(k + 1) % setLength];
				edge = { source: next, target: current, val };
			}
			edges.push(edge);
		} else {
			continue;
		}
	}
	return edges;
};
