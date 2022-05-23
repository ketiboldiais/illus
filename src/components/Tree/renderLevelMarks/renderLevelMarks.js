import { nodesByLevel } from "../nodesByLevel/nodesByLevel";
export const renderLevelMarks = (
	selection,
	root,
	svg,
	fontSize,
	textColor,
	levelLineColor,
) => {
	const levelNums = selection
		.append("g")
		.selectAll("text")
		.data(nodesByLevel(root.descendants()))
		.enter();
	levelNums
		.append("text")
		.attr("x", 0)
		.attr("y", (d) => d.y + 3)
		.attr("text-anchor", "middle")
		.attr("fill", textColor)
		.style("font-size", fontSize)
		.text((d) => d.depth + 1);
	levelNums
		.append("line")
		.attr("class", "level-line")
		.attr("x1", (d) => -svg.width + svg.width + 10)
		.attr("y1", (d) => d.y)
		.attr("x2", (d) => svg.width)
		.attr("y2", (d) => d.y)
		.attr("stroke", levelLineColor);
};
