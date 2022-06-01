import React, { useRef, useEffect } from "react";
import { isObjectLiteral } from "../utils/isObjectLiteral/isObjectLiteral";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { translate } from "../utils/translate/translate";

const formatData = (arr = []) => {
	let data = [];
	for (let i = 0; i < arr.length; i++) {
		if (isObjectLiteral(arr[i])) {
			data.push(arr[i]);
		} else {
			let queuer = { val: arr[i] };
			data.push(queuer);
		}
	}
	return data;
};

export const Queue = ({
	data = [],
	width = 300,
	height = 300,
	containerWidth,
	containerHeight = 0.5,
	margins = [20, 20, 20, 20],
}) => {
	const queueFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = formatData(data);
	const frameCount = _data.length;
	const xScale = d3
		.scaleBand()
		.domain(d3.range(frameCount))
		.range([0, _svg.width])
		.paddingInner(0.1);
	const yScale = d3
		.scaleBand()
		.domain(d3.range(frameCount))
		.range([_svg.height, 0]);

	useEffect(() => {
		const canvas = d3.select(queueFigure.current).select("g.svgElement");
		const queueGroup = canvas
			.selectAll("g.queuers")
			.data(_data)
			.enter()
			.append("g")
			.attr("class", "queuer")
			.attr("transform", (d, i) => translate(xScale(i), 0));
		const queuerRectangle = queueGroup
			.append("rect")
			.attr("width", xScale.bandwidth())
			.attr("height", yScale.bandwidth())
			.attr("fill", "white")
			.attr("stroke", "black");
		const queuerText = queueGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.attr("x", xScale.bandwidth() / 2)
			.attr("y", yScale.bandwidth() / 2)
			.attr("dy", "0.4em")
			.text((d) => d.val);
		const indexRectangle = queueGroup
			.append("rect")
			.attr("width", xScale.bandwidth())
			.attr("height", yScale.bandwidth() / 2)
			.attr("y", yScale.bandwidth())
			.attr("fill", "white")
			.attr("stroke", "black");
		const indexRectangleText = queueGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.attr("x", xScale.bandwidth() / 2)
			.attr("y", yScale.bandwidth() + yScale.bandwidth() / 3)
			.text((d, i) => i);
	});
	return (
		<Base
			id={queueFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
