const transformPoint = (point, yaw, pitch) => {
	let newPoint = [];
	let cosA = Math.cos(pitch);
	let sinA = Math.sin(pitch);
	let cosB = Math.cos(yaw);
	let sinB = Math.sin(yaw);
	newPoint[0] = cosB;
	newPoint[1] = 0;
	newPoint[2] = sinB;
	newPoint[3] = sinA * sinB;
	newPoint[4] = cosA;
	newPoint[5] = -sinA * cosB;
	newPoint[6] = -sinB * cosA;
	newPoint[7] = sinA;
	newPoint[8] = cosA * cosB;
	let x =
		newPoint[0] * point[0] +
		newPoint[1] * point[1] +
		newPoint[2] * point[2];
	let y =
		newPoint[3] * point[0] +
		newPoint[4] * point[1] +
		newPoint[5] * point[2];
	let z =
		newPoint[6] * point[0] +
		newPoint[7] * point[1] +
		newPoint[8] * point[2];
	return [x, y, z];
};

const heightFunction = (d) => {
	return [d];
};

const getHeights = (datum) => {
	let data = datum;
	let output = [];
	let xLength = data.length;
	let yLength = data[0].length;
	let t;
	let value;
	for (let x = 0; x < xLength; x++) {
		output.push((t = []));
		for (let y = 0; y < yLength; y++) {
			value = heightFunction(data[x][y], x, y);
			t.push(value);
		}
	}
	return output;
};

export const getTransformedData = (datum = [], displayWidth, yaw, pitch) => {
	let data = datum;
	let output = [];
	let zoom = Math.SQRT2;
	let t = [];
	let heights = getHeights(datum);
	let xLength = data.length;
	let yLength = data[0].length;
	for (let x = 0; x < xLength; x++) {
		output.push((t = []));
		for (let y = 0; y < yLength; y++) {
			t.push(
				transformPoint([
					((x - xLength / 2) / (xLength * zoom)) * displayWidth,
					heights[x][y],
					((y - yLength / 2) / (yLength * zoom)) * displayWidth,
				], yaw, pitch),
			);
		}
	}
	return output;
};
