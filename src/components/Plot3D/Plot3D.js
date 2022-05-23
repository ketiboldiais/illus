import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { generatePlotPoints } from "./generatePlotPoints/generatePlotPoints";
import { renderSurface } from "./renderSurface/renderSurface";
import { colorFunction } from "./colorFunction/colorFunction";

export const Plot3D = ({
	functions = [],
	width = 600,
	height = 600,
	containerWidth = 90,
	containerHeight = 90,
	margins = [50, 50, 50, 50],
	yaw = 0.5,
	pitch = 0.5,
}) => {
	const Plot3DFigure = useRef();
	const _svg = svg(width, height, margins);

	useEffect(() => {
		const canvas = d3.select(Plot3DFigure.current).select("g.svgElement");
		const plot3d = canvas.append("g").attr("class", "plot3d");
		let _data;
		let _surface;
		for (let i = 0; i < functions.length; i++) {
			_data = generatePlotPoints(functions[i]);
			_surface = renderSurface(_data, _svg.width, _svg.height, yaw, pitch);
			plot3d
				.selectAll("paths")
				.data(_surface)
				.enter()
				.append("path")
				.attr("d", (d) => d.path)
				.attr("fill", (d) => colorFunction(d.data));
		}
	});
	return (
		<Base
			id={Plot3DFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
