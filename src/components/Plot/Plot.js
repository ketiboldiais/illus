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
	precision = 100,
	domain = [-10, 10],
	range = [-10, 10],
	xAxisPosition = "center",
	xAxisColor = "",
	yAxisColor = "",
	yAxisPosition = "center",
	plotLineColor = "firebrick",
	strokeWidth = 2,
	width = 500,
	height = 500,
	containerWidth = 90,
	containerHeight = 90,
	margins = [50, 50, 50, 50],
}) => {
	const PlotFigure = useRef();
	const _svg = svg(width, height, margins);
	const plotLineColors = getPropertyValues(functions, "color");
	const userFunctions = getPropertyValues(functions, "f");
	const _domain = d3.ticks(domain[0], domain[1], precision);
	const _domainUpperBound = domain[0];
	const _domainLowerBound = domain[1];
	const _rangeUpperBound = range[0];
	const _rangeLowerBound = range[1];

	const xScale = d3.scaleLinear(
		[_domainLowerBound, _domainUpperBound],
		[_svg.width, 0],
	);

	const yScale = d3.scaleLinear(
		[_rangeLowerBound, _rangeUpperBound],
		[0, _svg.height],
	);

	const funcGroupData = generateFunctionData(
		functions,
		userFunctions,
		_domain,
	);
	const generate_d_attribute = (d) => {
		return d3
			.line()
			.x((d) => {
				return xScale(d.x);
			})
			.y((d) => {
				return yScale(d.y);
			});
	};
	const xAxis = d3.axisBottom(xScale).tickSizeInner(3).tickSizeOuter(0);
	const yAxis = d3.axisLeft(yScale).tickSizeInner(3).tickSizeOuter(0);

	useEffect(() => {
		const canvas = d3.select(PlotFigure.current).select("g.svgElement");

		const plot = canvas.append("g").attr("class", "plot");

		appendArrowDefinitions(plot, "black");

		const render_xAxis = plot
			.append("g")
			.attr("class", "plot-x-axis")
			.attr("transform", translate(0, _svg.height / 2))
			.call(xAxis);

		// elongate x-axis ticks
		render_xAxis.selectAll(".tick").selectAll("line").attr("y1", -3);
		// add x-axis arrow heads
		render_xAxis
			.select("path")
			.attr("marker-end", "url(#xArrowLeft)")
			.attr("marker-start", "url(#xArrowRight)");

		const render_yAxis = plot
			.append("g")
			.attr("class", "plot-y-axis")
			.attr("transform", translate(_svg.width / 2, 0))
			.call(yAxis);

		// elongate y-axis ticks
		render_yAxis.selectAll(".tick").selectAll("line").attr("x1", 3);
		// add y-axis arrow heads
		render_yAxis
			.select("path")
			.attr("marker-end", "url(#yArrowTop)")
			.attr("marker-start", "url(#yArrowBottom)");

		removeEndTicks(plot);

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
