export const removeEndTicks = (selection) => {
	const xTickCount =
		selection.selectAll("g.plot-x-axis .tick")._groups[0].length;
	const yTickCount =
		selection.selectAll("g.plot-y-axis .tick")._groups[0].length;
	selection.selectAll("g.plot-x-axis .tick line").each(function (d, i) {
		if (i === 0 || i === xTickCount - 1) this.remove();
	});
	selection.selectAll("g.plot-y-axis .tick line").each(function (d, i) {
		if (i === 0 || i === yTickCount - 1) this.remove();
	});
};
