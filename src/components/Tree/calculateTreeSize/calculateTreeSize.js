import { max } from "d3";
export const calculateTreeSize = (_root) => {
	const levelWidth = [1];
	const childCount = function (level, n) {
		if (n.children && n.children.length > 0) {
			if (levelWidth.length <= level + 1) {
				levelWidth.push(0);
			}
			levelWidth[level + 1] += n.children.length;
			n.children.forEach(function (d) {
				childCount(level + 1, d);
			});
		}
	};
	childCount(0, _root);
	const newHeight = max(levelWidth) * 15;
	return newHeight;
};
