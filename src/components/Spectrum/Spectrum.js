import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";

export const Spectrum = ({
	data = [],
	width = 300,
	height = 150,
	containerWidth,
	containerHeight,
	alternateBy = 1,
	colors = ["#e0fffe", "#f9fffe"],
	fontFamily = "system-ui",
	fontSize = 10,
	lineColor = "grey",
	spectrumHeight = 15,
	textPadding = 2,
	orient = "horizontal",
	margins = [10, 10, 10, 10],
}) => {
	const SpectrumFigure = useRef();
	const colorStopX1 = 0;
	const _textPadding = textPadding * 10;
	const colorStopX2 = orient === "horizontal" ? 100 : 0;
	const colorStopY1 = 0;
	const colorStopY2 = orient === "horizontal" ? 0 : 100;
	const _svg = svg(width, height, margins);
	const minVal = d3.min(data, (d, i) => (d.val ? d.val : i));
	const maxVal = d3.max(data, (d, i) => (d.val ? d.val : i));
	const xScale = d3
		.scaleLinear()
		.domain([0, maxVal])
		.range([0, _svg.width]);
	const bandScale = d3
		.scaleBand()
		.domain(d3.map(data, (d, i) => (d.val ? d.val : i)))
		.rangeRound([0, _svg.width]);

	useEffect(() => {
		const canvas = d3
			.select(SpectrumFigure.current)
			.select("g.svgElement")
			.attr("class", "spectrum");
		const grad = canvas
			.append("defs")
			.append("linearGradient")
			.attr("id", "grad")
			.attr("x1", `${colorStopX1}%`)
			.attr("x2", `${colorStopX2}%`)
			.attr("y1", `${colorStopY1}%`)
			.attr("y2", `${colorStopY2}%`);
		grad
			.selectAll("stop")
			.data(colors)
			.enter()
			.append("stop")
			.style("stop-color", (d) => d)
			.attr("offset", (d, i) => {
				return `${100 * (i / (colors.length - 1))}%`;
			});
		const rectGroup = canvas
			.selectAll("g.rects")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "spectrum-rectangle-group");
		rectGroup
			.append("line")
			.attr("stroke", lineColor)
			.attr("x1", (d, i) => (d.val ? xScale(d.val) : xScale(i)))
			.attr("y1", spectrumHeight)
			.attr("x2", (d, i) => (d.val ? xScale(d.val) : xScale(i)))
			.attr("y2", (d, i) => {
				if (i % alternateBy === 0) {
					return bandScale.bandwidth() + _textPadding / 2;
				} else {
					return bandScale.bandwidth() - _textPadding / 2;
				}
			});
		rectGroup
			.append("text")
			.attr("font-family", fontFamily)
			.attr("font-size", fontSize)
			.attr("class", "spectrum-label")
			.attr("text-anchor", "middle")
			.attr("x", (d, i) => (d.val ? xScale(d.val) : xScale(i)))
			.attr("y", (d, i) => {
				if (i % alternateBy === 0) {
					return bandScale.bandwidth() + _textPadding;
				} else {
					return bandScale.bandwidth();
				}
			})
			.text((d) => (d.id ? d.id : d));
		const rectangle = canvas
			.append("rect")
			.attr("width", _svg.width)
			.attr("height", spectrumHeight)
			.attr("fill", "url(#grad)")
			.attr("stroke", "url(#grad)");
	});
	return (
		<Base
			id={SpectrumFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
