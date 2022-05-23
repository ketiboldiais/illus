import React, { useRef, useEffect } from "react";
import "../_styles/base.css";
import * as d3 from "d3";

export const Base = ({
	id,
	width = 200,
	height = 200,
	containerWidth = 100,
	containerHeight = 100,
	margins = [10, 10, 10, 10], // [top, right, bottom, left]
}) => {
	const svgRef = useRef();
	const figStyles = {
		display: 'flex',
		justifyContent: 'center',
		flex: 1
	}
	const svgStyles = {
		display: "inline-block",
		position: "absolute",
		top: 0,
		left: 0,
	};
	const containerStyles = {
		display: "inline-block",
		position: "relative",
		width: `${containerWidth}%`,
		paddingBottom: `${containerHeight}%`,
		overflow: "hidden",
	};
	const marginTop = margins[0];
	const marginRight = margins[1];
	const marginBottom = margins[2];
	const marginLeft = margins[3];
	const svgWidth = width - marginLeft - marginRight;
	const svgHeight = height - marginTop - marginBottom;
	const viewBoxWidth = svgWidth + marginLeft + marginRight;
	const viewBoxHeight = svgHeight + marginTop + marginBottom;
	const viewBoxValue = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

	useEffect(() => {
		// set up svg
		const svg = d3
			.select(svgRef.current)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", viewBoxValue)
		svg.selectAll("*").remove();
		svg
			.append("g")
			.classed("svgElement", true)
			.attr("transform", `translate(${marginLeft}, ${marginTop})`);
	});
	return (
		<figure style={figStyles}>
			<div ref={id} className="svgContainer" style={containerStyles}>
				<svg ref={svgRef} style={svgStyles}></svg>
			</div>
		</figure>
	);
};
