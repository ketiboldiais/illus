import React, { useRef, useEffect } from "react";
import { isObjectLiteral } from "../utils/isObjectLiteral/isObjectLiteral";
import { setConditionalValue } from "../utils/setConditionalValue/setConditionalValue";
import { setValue } from "../utils/setValue/setValue";
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
			let stackFrame = { val: arr[i] };
			data.push(stackFrame);
		}
	}
	return data;
};

export const Stack = ({
	data = [],
	width = 350,
	height = 170,
	fontFamily="system-ui",
	frameWidth = 70,
	frameHeight = 20,
	containerWidth,
	containerHeight,
	margins = [10, 10, 10, 10],
}) => {
	const stackFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = formatData(data);
	const frameCount = _data.length;
	const scale = d3
		.scaleBand()
		.domain(_data)
		.range([0, frameCount * 25]);

	useEffect(() => {
		// set up group
		const canvas = d3.select(stackFigure.current).select("g.svgElement");
		const frameGroup = canvas
			.selectAll("g.frame")
			.data(_data)
			.enter()
			.append("g")
			.attr("class", "stack-frame")
			.attr("transform", (d) => translate(_svg.width / 2, scale(d)));
		const frameRectangle = frameGroup
			.append("rect")
			.attr("class", "stack-frame-rectangle")
			.attr("x", (d) =>
				setConditionalValue(d.popped, frameWidth / 2, -frameWidth / 2),
			)
			.attr("y", 0)
			.attr("fill", (d) => setValue(d.fill, "white"))
			.attr("stroke", (d) => setValue(d.stroke, "black"))
			.attr("opacity", (d) => setValue(d.popped, 1))
			.attr("height", frameHeight)
			.attr("width", frameWidth);
		const frameText = frameGroup
			.append("text")
			.attr('font-family', fontFamily)
			.attr("class", "stack-frame-text")
			.attr("text-anchor", "middle")
			.attr("x", (d) => setConditionalValue(d.popped, frameWidth, 0))
			.attr("y", frameHeight / 2)
			.attr("dy", 5)
			.text((d) => `${d.val}`);
	});
	return (
		<Base
			id={stackFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
