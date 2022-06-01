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

const setXAxis = (xScale, xTickCount) => {
	return d3
		.axisBottom()
		.scale(xScale)
		.ticks(xTickCount)
		.tickFormat(d3.format("d"));
};

const setYAxis = (yScale, yTickCount) => {
	return d3.axisLeft().scale(yScale).ticks(yTickCount);
};

const formatData = (arr = []) => {
	let data = [];
	for (let i = 0; i < arr.length; i++) {
		if (isObjectLiteral(arr[i])) {
			data.push(arr[i]);
		} else {
			let datum = {
				x: arr[i][0],
				y: arr[i][1],
				group: setValue(arr[i][2], "group"),
			};
			data.push(datum);
		}
	}
	return data;
};

export const LinePlot = ({
	data,
	xMin = null,
	xMax = null,
	yMin = null,
	yMax = null,
	lineWidth = 2,
	xAxisTickCount = 5,
	yAxisTickCount = 5,
	axisPadding = 0,
	legend = {},
	radialMagnitude = false,
	circleRadius = 5,
	xAxisLabel = "x",
	yAxisLabel = "y",
	width = 500,
	height = 300,
	containerWidth,
	containerHeight,
	marginTop = 40,
	marginRight = 40,
	marginBottom = 40,
	marginLeft = 40,
	margins = [marginTop, marginRight, marginBottom, marginLeft],
}) => {
	const LinePlotFigure = useRef();
	const linePlotData = formatData(data);
	const linePlotDataGroups = d3.group(linePlotData, (d) => d.group);
	const legendKeys = Object.keys(legend);
	const _svg = svg(width, height, margins);

	const _xMin = setValue(
		xMin,
		getArrayMin(getPropertyValues(linePlotData, "x")),
	);
	const _xMax = setValue(
		xMax,
		getArrayMax(getPropertyValues(linePlotData, "x")),
	);
	const _yMin = setValue(
		getArrayMin(getPropertyValues(linePlotData, "y")),
	);
	const _yMax = setValue(
		getArrayMax(getPropertyValues(linePlotData, "y")),
	);

	const xScale = d3
		.scaleLinear()
		.domain([_xMin, _xMax])
		.range([0, _svg.width]);
	const yScale = d3
		.scaleLinear()
		.domain([_yMin, _yMax])
		.range([_svg.height, 0]);
	const sqrtScale = d3.scaleSqrt().domain([0, _xMax]).range([0, 10]);

	useEffect(() => {
		const LinePlot = d3
			.select(LinePlotFigure.current)
			.select("g.svgElement");

		const trendLines = LinePlot.selectAll("trendline")
			.data(linePlotDataGroups)
			.enter()
			.append("path")
			.attr("class", "trendline")
			.attr("fill", "none")
			.attr("d", (d) =>
				d3
					.line()
					.x((d) => xScale(d.x))
					.y((d) => yScale(d.y))(d[1]),
			)
			.attr("stroke-width", lineWidth)
			.attr("stroke", (d) => legend[d[0]]);

		const xAxisGroup = LinePlot.append("g")
			.attr("class", "axis x-axis")
			.attr("transform", translate(0, _svg.height));
		const renderedXAxis = xAxisGroup.call(
			setXAxis(xScale, xAxisTickCount),
		);

		const yAxisGroup = LinePlot.append("g")
			.attr("class", "axis y-axis")
			.attr("transform", translate(0, 0));
		const renderedYAxis = yAxisGroup.call(
			setYAxis(yScale, yAxisTickCount),
		);
	});
	return (
		<Base
			id={LinePlotFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
