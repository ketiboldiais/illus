export const renderDepthMarks = (selection, root, radius) => {
	const DepthNums = selection.append("g");
	DepthNums.selectAll("text")
		.data(root.descendants())
		.enter()
		.filter((d) => !d.data.display)
		.append("text")
		.attr("x", (d) => d.x)
		.attr("y", (d) => d.y)
		.attr("dx", -radius - radius / 2)
		.text((d) => d.depth)
		.attr("text-anchor", "middle")
		.attr("fill", "grey")
		.style("font-size", "0.7rem");
};
