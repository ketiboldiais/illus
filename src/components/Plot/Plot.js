import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { getPropertyValues } from "../utils/getPropertyValues/getPropertyValues";
import { generateFunctionData } from "./generateFunctionData/generateFunctionData";
import { appendArrowDefinitions } from "./appendArrowDefinitions/appendArrowDefinitions";
import { removeEndTicks } from "../utils/removeEndTicks/removeEndTicks";
import { translate } from "../utils/translate/translate";

export const Plot = ({
	functions = [],
	domain = [-10, 10],
	range = [-10, 10],
	samples=500,
	width = 400,
	height = 400,
	containerWidth = 100,
	containerHeight = 100,
	fontFamily = "system-ui",
	fontSize = 11,
	axesColor = "#606060",
	plotLineColor = "tomato",
	strokeWidth = 2,
	margins = [50, 50, 50, 50],
}) => {
	const PlotFigure = useRef();
	const _svg = svg(width, height, margins);
	const userFunctions = getPropertyValues(functions, "f");
	const _domainLowerBound = domain[0];
	const _domainUpperBound = domain[1];
	const _rangeLowerBound = range[0];
	const _rangeUpperBound = range[1];

	const xScale = d3.scaleLinear(
		[_domainLowerBound, _domainUpperBound],
		[0, _svg.width],
	);

	const yScale = d3.scaleLinear(
		[_rangeLowerBound, _rangeUpperBound],
		[_svg.height, 0],
	);

	const funcGroupData = generateFunctionData(
		functions,
		userFunctions,
		samples,
		_domainUpperBound,
		_domainLowerBound,
		_rangeUpperBound,
		_rangeLowerBound
	);
	const generate_d_attribute = (d) => {
		return d3
			.line()
			.y((d) => {
				return yScale(d.y);
			})
			.defined(function (d) {
				return d.y !== null;
			})
			.x((d) => {
				return xScale(d.x);
			});
	};
	const xAxis = d3.axisBottom(xScale).tickSizeInner(3).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).tickSizeInner(3).tickSizeOuter(0);

	useEffect(() => {
		const canvas = d3.select(PlotFigure.current).select("g.svgElement");

		const plot = canvas.append("g").attr("class", "plot");

		appendArrowDefinitions(plot, axesColor);

		const render_xAxis = plot
			.append("g")
			.attr("class", "plot-x-axis")
			.attr("transform", translate(0, _svg.height / 2))
			.call(xAxis);

		// elongate x-axis ticks
		render_xAxis
			.selectAll(".tick")
			.selectAll("line")
			.attr("y1", -3)
			.attr("stroke", axesColor);
		// add x-axis arrow heads
		render_xAxis
			.select("path")
			.attr("stroke", axesColor)
			.attr("marker-end", "url(#xArrowLeft)")
			.attr("marker-start", "url(#xArrowRight)");

		const render_yAxis = plot
			.append("g")
			.attr("class", "plot-y-axis")
			.attr("transform", translate(_svg.width / 2, 0))
			.call(yAxis);

		// elongate y-axis ticks
		render_yAxis
			.selectAll(".tick")
			.selectAll("line")
			.attr("x1", 3)
			.attr("stroke", axesColor);
		// add y-axis arrow heads
		render_yAxis
			.select("path")
			.attr("stroke", axesColor)
			.attr("marker-end", "url(#yArrowTop)")
			.attr("marker-start", "url(#yArrowBottom)");

		removeEndTicks(plot);

		plot
			.selectAll("text")
			.attr("font-family", fontFamily)
			.attr('font-size', fontSize)
			.attr("fill", axesColor);

		const plotBoundary = plot
			.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", _svg.width)
			.attr("height", _svg.height);
		for (let i = 0; i < funcGroupData.length; i++) {
			plot
				.append("path")
				.datum(funcGroupData[i].data)
				// .attr('foo', d => console.log(d))
				.attr("shape-rendering", "geometric-precision")
				.attr("clip-path", "url(#chart-area)")
				.attr("fill", "none")
				.attr(
					"stroke",
					funcGroupData[i].color ? funcGroupData[i].color : plotLineColor,
				)
				.attr("stroke-width", strokeWidth)
				.attr("d", generate_d_attribute());
		}
	});
	return (
		<Base
			id={PlotFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
