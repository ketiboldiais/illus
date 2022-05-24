import React, { useRef, useEffect } from "react";
import { isObjectLiteral } from "../utils/isObjectLiteral/isObjectLiteral";
import csvData from "../demoData/congressData.csv";
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

export const StackedBarPlot = ({
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
	height = 400,
	containerWidth = 80,
	containerHeight = 70,
	margins = [70, 70, 70, 70],
}) => {
	const StackedBarPlotFigure = useRef();
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
	let congData = [];
	let datum = {};
	d3.csv(csvData, function (_data) {
		// for (let i = 0; i < _data.length; i++) {
			let year = _data["years            "];
			datum = { year };
			congData.push(datum);
		// }
	});

	useEffect(() => {
		const BarPlot = d3
			.select(StackedBarPlotFigure.current)
			.select("g.svgElement");
	});
	return (
		<Base
			id={StackedBarPlotFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
