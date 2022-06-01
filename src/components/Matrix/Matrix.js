import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { translate } from "../utils/translate/translate";
import { getPropertyValues } from "../utils/getPropertyValues/getPropertyValues";

const formatData = (arr, focusData) => {
	let data = [];
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[row].length; col++) {
			let element = { val: arr[row][col], row: row, col: col };
			if (focusData) {
				for (let i = 0; i < focusData.length; i++) {
					if (focusData[i][0] === row && focusData[i][1] === col) {
						element.focus = true;
					}
				}
			}
			data.push(element);
		}
	}
	return data;
};

export const Matrix = ({
	data = [[]],
	focus,
	width = 300,
	height = 300,
	containerWidth,
	containerHeight,
	margins = [60, 30, 60, 30],
	isIndexed = true,
}) => {
	const MatrixFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = formatData(data, focus);
	const rows = getPropertyValues(_data, "row");
	const columns = getPropertyValues(_data, "col");
	const xScale = d3
		.scaleBand()
		.domain(columns)
		.range([0, _svg.width])
		.padding(0.08);
	const yScale = d3
		.scaleBand()
		.domain(rows)
		.range([0, _svg.height])
		.padding(0.08);

	useEffect(() => {
		const canvas = d3.select(MatrixFigure.current).select("g.svgElement");
		const matrix = canvas.append("g").attr("class", "matrix");
		const xAxisGroup = matrix
			.append("g")
			.attr("class", "column-indices")
			.attr("transform", translate(0, -xScale.bandwidth() / 4))
			.call(d3.axisBottom(xScale).tickSize(0))
			.selectAll(".domain")
			.remove();

		const yAxisGroup = matrix
			.append("g")
			.attr("class", "row-indices")
			.attr(
				"transform",
				translate(-xScale.bandwidth() / 4, yScale.bandwidth() / 2),
			)
			.call(d3.axisLeft(yScale).tickSize(0))
			.selectAll(".domain")
			.remove();

		const matrixElement = matrix
			.selectAll("squares")
			.data(_data)
			.enter()
			.append("g")
			.attr("class", "matrix-element")
			.attr("transform", (d) => translate(xScale(d.col), yScale(d.row)));
		const matrixSquare = matrixElement
			.append("rect")
			.attr("class", (d) =>
				d.focus
					? "matrix-element-rectangle matrix-element-rectangle-focused"
					: "matrix-element-rectangle",
			)
			.attr("x", 0)
			.attr("y", xScale.bandwidth() / 2)
			.attr("width", xScale.bandwidth())
			.attr("height", yScale.bandwidth())
			.attr("opacity", 0.8);
		const matrixElementText = matrixElement
			.append("text")
			.attr("class", (d) =>
				d.focus
					? "matrix-element-text matrix-element-text-focused"
					: "matrix-element-text",
			)
			.attr("x", xScale.bandwidth() / 2)
			.attr("y", yScale.bandwidth())
			.attr("dy", "0.2em")
			.attr("text-anchor", "middle")
			.text((d) => d.val);
	});
	return (
		<Base
			id={MatrixFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
