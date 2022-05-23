export const renderHeightMarks = (
	selection,
	root,
	radius,
	textColor,
	fontSize,
) => {
	const heightNums = selection.append("g");
	heightNums
		.selectAll("text")
		.data(root.descendants())
		.enter()
		.filter((d) => !d.data.display)
		.append("text")
		.attr("x", (d) => d.x)
		.attr("y", (d) => d.y)
		.attr("dx", radius + radius / 2)
		.text((d) => d.height + 1)
		.attr("text-anchor", "middle")
		.attr("fill", textColor)
		.style("font-size", fontSize);
};
