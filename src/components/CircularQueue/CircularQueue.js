import React, { useRef, useEffect } from "react";
import "./CircularQueue.css";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { translate } from "../utils/translate/translate";
import { setValue } from "../utils/setValue/setValue";
import { attrs } from "../utils/attrs/attrs";
import { formatQueueData } from "./formatQueueData/formatQueueData";

export const CircularQueue = ({
	data = [],
	width = 160,
	height = 160,
	containerWidth = 30,
	containerHeight = 30,
	margins = [80, 55, 80, 55],
	isIndexed = true,
	outerRadius = null,
	innerRadius = null,
	elementFillColor = "",
	elementStrokeColor = "",
	elementTextColor = "",
	indexTextColor = "",
	strokeWidth = "",
}) => {
	const circularQueueFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = formatQueueData(data);
	const pieData = d3.pie().value((d) => d.data)(_data);
	const _outerRadius = setValue(outerRadius, _svg.width / 2);
	const _innerRadius = setValue(innerRadius, _svg.width);
	const arc = d3.arc().innerRadius(_innerRadius).outerRadius(_outerRadius);
	const indexArc = d3
		.arc()
		.innerRadius(_innerRadius)
		.outerRadius(_outerRadius * 2.8);

	useEffect(() => {
		const canvas = d3
			.select(circularQueueFigure.current)
			.select("g.svgElement");
		const pie = canvas.append("g");
		attrs(pie, {
			class: "circular-queue",
			transform: translate(_svg.width / 2, 0),
		});
		const queuer = pie
			.selectAll("piePaths")
			.data(pieData)
			.enter()
			.append("g")
			.attr("class", "queuer");
		const queuerPaths = queuer.append("path");
		attrs(queuerPaths, {
			class: "queuer-path",
			d: (d) => arc(d),
			fill: elementFillColor,
			stroke: elementStrokeColor,
			"stroke-width": strokeWidth,
		});
		const queuerLabel = queuer.append("text").text((d) => d.data.val);
		attrs(queuerLabel, {
			class: "queuer-data-text",
			dy: "0.3em",
			"text-anchor": "middle",
			transform: (d) => `translate(${arc.centroid(d)})`,
			fill: elementTextColor,
		});

		if (isIndexed) {
			const queuerIndexText = pie
				.selectAll("indices")
				.data(pieData)
				.enter()
				.append("text")
				.text((d, i) => i);
			attrs(queuerIndexText, {
				class: "queuer-index-text",
				"text-anchor": "middle",
				dy: "0.35em",
				fill: indexTextColor,
				transform: (d) => `translate(${indexArc.centroid(d)})`,
			});
		}
	});
	return (
		<Base
			id={circularQueueFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
