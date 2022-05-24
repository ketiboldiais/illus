import React, { useRef, useEffect } from "react";
import { isObjectLiteral } from "../utils/isObjectLiteral/isObjectLiteral";
import { getPropertyValues } from "../utils/getPropertyValues/getPropertyValues";
import { usData } from "./US";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";

export const HexMap = ({
	data = [],
	width = 440,
	height = 300,
	fontFamily="system-ui",
	textColor = "white",
	strokeColor = "firebrick",
	fillColor = "tomato",
	containerWidth = 100,
	containerHeight = 100,
	margins = [10, 10, 10, 10],
}) => {
	const _hexmapREF = useRef(null);
	const _svg = svg(width, height, margins);
	const stateNames = getPropertyValues(data, "state");
	console.log(stateNames);

	const projection = d3.geoMercator().scale(350).translate([850, 440]);
	const path = d3.geoPath().projection(projection);

	const render = () => {
		if (_hexmapREF) {
			const canvas = d3.select(_hexmapREF.current).select("g.svgElement");
			const _hexmap = canvas.append("g").attr("class", "hexmap");
			_hexmap
				.append("g")
				.selectAll("path")
				.data(usData.features)
				.join("path")
				.attr("class", (d) => {
					if (stateNames.includes(d.properties.state_name)) {
						const _state = data.find(
							(item) => item.state === d.properties.state_name,
						);
						return "state-"+_state.class;
					} else {
						return "state";
					}
				})
				.attr("fill", fillColor)

				.attr("d", path)
				.attr("stroke", strokeColor);
			// labels
			_hexmap
				.append("g")
				.selectAll("labels")
				.data(usData.features)
				.join("text")
				.attr("x", function (d) {
					return path.centroid(d)[0];
				})
				.attr("y", function (d) {
					return path.centroid(d)[1];
				})
				.text(function (d) {
					return d.properties.iso3166_2;
				})
				.attr("text-anchor", "middle")
				.attr('font-family', fontFamily)
				.attr("alignment-baseline", "central")
				.style("font-size", 11)
				.style("fill", textColor);
		}
	};

	useEffect(() => {
		render();
	}, [_hexmapREF.current]);
	return (
		<Base
			id={_hexmapREF}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
