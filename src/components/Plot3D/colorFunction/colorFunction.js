import { hsl } from "d3";

export const colorFunction = (d) => {
	const c = hsl(d + 80, 0.7, 0.5).rgb();
	const red = parseInt(c.r);
	const green = parseInt(c.g);
	const blue = parseInt(c.b);
	return `rgb(${red}, ${green}, ${blue})`;
};
