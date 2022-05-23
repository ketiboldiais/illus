import { setValue } from "../../utils/setValue/setValue";
import { ticks } from "d3";
const functions = [
	{
		f: (x, y) => x ** 2 - y ** 2,
		xDomain: [-20, 20],
		xRange: [-20, 20],
		yDomain: [-20, 20],
		yRange: [-20, 20],
		xPrecision: 100,
		yPrecision: 100,
	},
	{
		f: (x, y) => x ** 2 - y ** 2,
		xDomain: [-20, 20],
		xRange: [-20, 20],
		yDomain: [-20, 20],
		yRange: [-20, 20],
		xPrecision: 100,
		yPrecision: 100,
	},
];

export const generatePlotPoints = (functionEntry) => {
	let f = functionEntry.f;
	let scale = setValue(functionEntry.scale, 1);
	let xDomain = setValue(functionEntry.xDomain, [-20, 20]);
	let yDomain = setValue(functionEntry.yDomain, [-20, 20]);
	let xDomainLowerBound = xDomain[0];
	let xDomainUpperBound = xDomain[1];
	let yDomainLowerBound = yDomain[0];
	let yDomainUpperBound = yDomain[1];

	let output = [];
	for (let x = xDomainLowerBound; x < xDomainUpperBound; x++) {
		let f0 = [];
		output.push(f0);
		for (let y = yDomainLowerBound; y < yDomainUpperBound; y++) {
			f0.push(f(x, y) * scale);
		}
	}
	return output;
};
