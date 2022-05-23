import { getTransformedData } from "../getTransformedData/getTransformedData";
export const renderSurface = (
	dataVals,
	displayWidth,
	displayHeight,
	yaw,
	pitch,
) => {
	let originalData = dataVals;
	let data = getTransformedData(dataVals, displayWidth, yaw, pitch);
	let xLength = data.length;
	let yLength = data[0].length;
	let d0 = [];
	let depth;
	let x, y;
	let M1, M2, L1, L2, L3, L4, L5, L6;
	let path;
	for (x = 0; x < xLength - 1; x++) {
		for (y = 0; y < yLength - 1; y++) {
			depth =
				data[x][y][2] +
				data[x + 1][y][2] +
				data[x + 1][y + 1][2] +
				data[x][y + 1][2];
			M1 = (data[x][y][0] + displayWidth / 2).toFixed(10);
			M2 = (data[x][y][1] + displayHeight / 2).toFixed(10);
			L1 = (data[x + 1][y][0] + displayWidth / 2).toFixed(10);
			L2 = (data[x + 1][y][1] + displayHeight / 2).toFixed(10);
			L3 = (data[x + 1][y + 1][0] + displayWidth / 2).toFixed(10);
			L4 = (data[x + 1][y + 1][1] + displayHeight / 2).toFixed(10);
			L5 = (data[x][y + 1][0] + displayWidth / 2).toFixed(10);
			L6 = (data[x][y + 1][1] + displayHeight / 2).toFixed(10);
			path = `M ${M1},${M2} L${L1},${L2}, L${L3},${L4} L${L5},${L6} Z`;
			d0.push({ path, depth, data: originalData[x][y] });
		}
	}
	d0.sort((a, b) => b.depth - a.depth);
	return d0;
};
