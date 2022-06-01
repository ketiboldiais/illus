import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export const Base = ({
	id,
	width = 200,
	height = 200,
	containerWidth = 100,
	containerHeight = height/width,
	backgroundColor = "inherit",
	margins = [10, 10, 10, 10], // [top, right, bottom, left]
}) => {
	const svgRef = useRef(null);
	const figStyles = {
		display: 'flex',
		justifyContent: 'center',
	}
		const containerStyles = {
		display: "inline-block",
		position: "relative",
		width: `${containerWidth}%`,
		paddingBottom: `${containerWidth * containerHeight}%`,
		backgroundColor: "inherit",
		overflow: "hidden",
	};
	const svgStyles = {
		display: "inline-block",
		position: "absolute",
		top: 0,
		left: 0,
		backgroundColor: backgroundColor,
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

	const appendSvg = () => {
		// set up svg
		const svg = d3
			.select(svgRef.current)
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", viewBoxValue)
		svg.selectAll("*").remove();
		svg
			.append("g")
			.attr("class", "svgElement")
			.attr("transform", `translate(${marginLeft}, ${marginTop})`);
	};
	useEffect(() => {
		appendSvg();
	});
	return (
		
			<div ref={id} className="svgContainer" style={containerStyles}>
				<svg ref={svgRef} style={svgStyles} className="illus"></svg>
			</div>
		
	);
};
