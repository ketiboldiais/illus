import React, { useRef, useEffect } from "react";
import { isObjectLiteral } from "../utils/isObjectLiteral/isObjectLiteral";
import { translate } from "../utils/translate/translate";
import { svg } from "../utils/svg/svg";
import { setValue } from "../utils/setValue/setValue";
import { getArrayMax } from "../utils/getArrayMax/getArrayMax";
import { getArrayMin } from "../utils/getArrayMin/getArrayMin";
import { getPropertyValues } from "../utils/getPropertyValues/getPropertyValues";
import { Base } from "../base/Base";
import * as d3 from "d3";

const formatData = (arr = []) => {
	let data = [];
	for (let i = 0; i < arr.length; i++) {
		if (isObjectLiteral(arr[i])) {
			data.push(arr[i]);
		} else {
			let datum = {
				x: arr[i][0],
				y: arr[i][1],
				label: setValue(arr[i][2], ""),
			};
			data.push(datum);
		}
	}
	return data;
};

export const BarPlot = ({
	data,
	xMin = null,
	xMax = null,
	yMin = null,
	yMax = null,
	colorWeight = [],
	xTickRotate = 0,
	xAxisTickCount = 5,
	yAxisTickCount = 5,
	axisPadding = 0,
	legend = {},
	radialMagnitude = false,
	circleRadius = 5,
	xAxisLabel = "x",
	yAxisLabel = "y",
	width = 500,
	height = 450,
	containerWidth,
	containerHeight,
	margins = [70, 70, 70, 70],
}) => {
	const BarPlotFigure = useRef();
	const _data = formatData(data);
	const _svg = svg(width, height, margins);

	const _xMin = setValue(xMin, getArrayMin(getPropertyValues(_data, "x")));
	const _xMax = setValue(xMax, getArrayMax(getPropertyValues(_data, "x")));
	const _yMin = setValue(getArrayMin(getPropertyValues(_data, "y")));
	const _yMax = setValue(getArrayMax(getPropertyValues(_data, "y")));

	const xScale = d3
		.scaleBand()
		.domain(getPropertyValues(_data, "x"))
		.range([0, _svg.width], 0.05)
		.padding(0.05);
	const yScale = d3
		.scaleLinear()
		.domain([0, _yMax])
		.range([_svg.height, 0]);
	const color = colorWeight
		? d3.scaleLinear().domain([_yMin, _yMax]).range(colorWeight)
		: "salmon";
	const xAxis = d3.axisBottom().scale(xScale);
	const yAxis = d3.axisLeft().scale(yScale);

	useEffect(() => {
		const BarPlot = d3
			.select(BarPlotFigure.current)
			.select("g.svgElement");

		const bars = BarPlot.selectAll("rectangles")
			.data(_data)
			.enter()
			.append("g")
			.attr("class", "bar-plot-bar");
		const rectangles = bars
			.append("rect")
			.attr("fill", (d) => color(d.y))
			.attr("x", (d) => xScale(d.x))
			.attr("y", (d) => yScale(d.y))
			.attr("height", (d) => _svg.height - yScale(d.y))
			.attr("width", xScale.bandwidth());

		const xAxisGroup = BarPlot.append("g")
			.attr("class", "x-axis")
			.attr("transform", translate(0, _svg.height));
		const yAxisGroup = BarPlot.append("g").attr("class", "y-axis");

		const xAxisRendered = xAxisGroup.call(xAxis);
		if (xTickRotate) {
			xAxisGroup
				.selectAll(".tick")
				.select("text")
				.attr("text-anchor", "start")
				.attr("transform", `rotate(${xTickRotate})`)
				.attr("dx", "0.6em");
		}
		const yAxisRendered = yAxisGroup.call(yAxis);
		// add x-label if provided by user
		if (xAxisLabel) {
			const labelXPosition = _svg.width + margins[1] / 4;
			const labelYPosition = margins[2] / 7;
			const _xAxisLabel = xAxisGroup
				.select("g")
				.append("g")
				.attr("transform", translate(labelXPosition, labelYPosition));
			_xAxisLabel
				.append("text")
				.attr("class", "axis-label x-axis-label")
				.text(xAxisLabel);
		}
		// add y-label if provided by user
		if (yAxisLabel) {
			const ylabelXPosition = 0;
			const ylabelYPosition = -_svg.height - margins[0] / 5;
			const _yAxisLabel = yAxisGroup
				.select("g")
				.append("g")
				.attr("transform", translate(ylabelXPosition, ylabelYPosition));
			_yAxisLabel
				.append("text")
				.attr("class", "axis-label y-axis-label")
				.text(yAxisLabel);
		}
	});
	return (
		<Base
			id={BarPlotFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
