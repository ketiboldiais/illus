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
			let datum = { x: arr[i][0], y: arr[i][1] };
			data.push(datum);
		}
	}
	return data;
};

export const ScatterPlot = ({
	data,
	xMin = null,
	xMax = null,
	yMin = null,
	yMax = null,
	xAxisTickCount = 5,
	yAxisTickCount = 5,
	axisPadding = 0,
	radialMagnitude = false,
	circleRadius = 5,
	xAxisLabel = "x",
	yAxisLabel = "y",
	width = 500,
	height = 500,
	containerWidth,
	containerHeight,
	margins = [40, 40, 40, 40],
}) => {
	const scatterPlotFigure = useRef();
	const scatterPlotData = formatData(data);
	const _svg = svg(width, height, margins);
	const _xMin = setValue(
		xMin,
		getArrayMin(getPropertyValues(scatterPlotData, "x")),
	);
	const _xMax = setValue(
		xMax,
		getArrayMax(getPropertyValues(scatterPlotData, "x")),
	);
	const _yMin = setValue(
		getArrayMin(getPropertyValues(scatterPlotData, "y")),
	);
	const _yMax = setValue(
		getArrayMax(getPropertyValues(scatterPlotData, "y")),
	);
	const scaleX = d3
		.scaleLinear()
		.domain([_xMin, _xMax])
		.range([0, _svg.width]);
	const scaleY = d3
		.scaleLinear()
		.domain([_yMin, _yMax])
		.range([_svg.height, 0]);
	const scaleSqrt = d3.scaleSqrt().domain([0, _yMax]).range([0, 10]);
	const xAxis = d3.axisBottom().scale(scaleX).ticks(xAxisTickCount);
	const yAxis = d3.axisLeft().scale(scaleY).ticks(yAxisTickCount);
	useEffect(() => {
		const scatterPlot = d3
			.select(scatterPlotFigure.current)
			.select("g.svgElement");
		const circleGroups = scatterPlot
			.selectAll("g.circles")
			.data(scatterPlotData)
			.enter()
			.append("g")
			.attr("class", "scatter-plot-circle");
		const circles = circleGroups
			.append("circle")
			.attr("cx", (d) => scaleX(d.x))
			.attr("cy", (d) => scaleY(d.y))
			.attr("r", (d) => (radialMagnitude ? scaleSqrt(d.y) : circleRadius));
		const xAxisGroup = scatterPlot
			.append("g")
			.attr("class", "axis scatter-plot-x-axis")
			.attr("transform", translate(0, _svg.height - axisPadding));

		const xAxisRender = xAxisGroup.call(xAxis);
		xAxisRender.selectAll("text").classed("axis-text x-axis-text", true);
		xAxisRender.selectAll("line").classed("axis-line x-axis-line", true);
		xAxisRender.selectAll("path").classed("axis-path x-axis-path", true);
		const _xAxisLabel = xAxisRender
			.append("text")
			.attr("class", "axis-label x-axis-label")
			.attr("text-anchor", "start")
			.attr("x", _svg.width + 5)
			.attr("dy", "1em")
			.text(xAxisLabel);

		const yAxisGroup = scatterPlot
			.append("g")
			.attr("class", "axis scatter-plot-y-axis")
			.attr("transform", translate(axisPadding, 0));
		const yAxisRender = yAxisGroup.call(yAxis);
		yAxisRender.selectAll("text").classed("axis-text y-axis-text", true);
		yAxisRender.selectAll("line").classed("axis-line y-axis-line", true);
		yAxisRender.selectAll("path").classed("axis-path y-axis-path", true);
		const _yAxisLabel = yAxisRender
			.append("text")
			.attr("class", "axis-label y-axis-label")
			.attr("text-anchor", "end")
			.attr("dy", "-1em")
			.text(yAxisLabel);
	});
	return (
		<Base
			id={scatterPlotFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
