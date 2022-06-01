import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { getPropertyValues } from "../utils/getPropertyValues/getPropertyValues";
import { generateFunctionData } from "./generateFunctionData/generateFunctionData";
import { appendArrowDefinitions } from "./appendArrowDefinitions/appendArrowDefinitions";
import { removeEndTicks } from "../utils/removeEndTicks/removeEndTicks";
import { translate } from "../utils/translate/translate";
import { attrs } from "../utils/attrs/attrs";
import { getBackgroundColor } from "../utils/getBackgroundColor/getBackgroundColor";
import { MathText } from "../utils/MathText/MathText";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { reduceFraction } from "../utils/reduceFraction/reduceFraction";

export const Plot = ({
	id = `plot-${Date.now()}`,
	functions,
	geo,
	domain = [-10, 10],
	range = [-10, 10],
	samples = 500,
	width = 400,
	height = 400,
	containerWidth,
	containerHeight,
	noAxes = false,
	tickCount = domain[1] * 2,
	xTickCount = tickCount,
	yTickCount = xTickCount,
	xLabel = { text: "x", w: 20 },
	yLabel = { text: "y" },
	fontFamily = "system-ui",
	fontSize = 0.6,
	tickFontSize = 0.5,
	axesColor = "#606060",
	plotLineColor = "tomato",
	strokeWidth = 2,
	margins = [50, 50, 50, 50],
}) => {
	const _plotREF = useRef();
	const _svg = svg(width, height, margins);
	const _domainLowerBound = domain[0];
	const _domainUpperBound = domain[1];
	const _rangeLowerBound = range[0];
	const _rangeUpperBound = range[1];

	const xScale = d3.scaleLinear(
		[_domainLowerBound, _domainUpperBound],
		[0, _svg.width],
	);

	const scaleDimensionX = d3.scaleLinear(
		[0, _domainUpperBound * 2],
		[0, _svg.width],
	);

	const scaleDimensionY = d3.scaleLinear(
		[0, _rangeUpperBound * 2],
		[1, _svg.height],
	);

	const yScale = d3.scaleLinear(
		[_rangeLowerBound, _rangeUpperBound],
		[_svg.height, 0],
	);

	const generate_d_attribute = (d) => {
		return d3
			.line()
			.y((d) => {
				return yScale(d.y);
			})
			.defined(function (d) {
				return d.y !== null;
			})
			.x((d) => {
				return xScale(d.x);
			});
	};
	const xAxis = d3
		.axisBottom(xScale)
		.tickSizeInner(3)
		.tickSizeOuter(0)
		.ticks(xTickCount);
	const yAxis = d3
		.axisLeft(yScale)
		.tickSizeInner(3)
		.tickSizeOuter(0)
		.ticks(yTickCount);

	const renderAxes = (plot) => {
		appendArrowDefinitions(plot, axesColor);

		const axes = plot.append("g").attr("class", "illus-axes");

		const render_xAxis = axes
			.append("g")
			.attr("class", "plot-x-axis")
			.attr("transform", translate(0, _svg.height / 2))
			.call(xAxis);

		// elongate x-axis ticks
		render_xAxis
			.selectAll(".tick")
			.selectAll("line")
			.attr("y1", -3)
			.attr("stroke", axesColor);

		// add x-axis arrow heads
		render_xAxis
			.select("path")
			.attr("stroke", axesColor)
			.attr("marker-end", "url(#xArrowLeft)")
			.attr("marker-start", "url(#xArrowRight)");

		const render_yAxis = axes
			.append("g")
			.attr("class", "plot-y-axis")
			.attr("transform", translate(_svg.width / 2, 0))
			.call(yAxis);

		// elongate y-axis ticks
		render_yAxis
			.selectAll(".tick")
			.selectAll("line")
			.attr("x1", 3)
			.attr("stroke", axesColor);

		// add y-axis arrow heads
		render_yAxis
			.select("path")
			.attr("stroke", axesColor)
			.attr("marker-end", "url(#yArrowTop)")
			.attr("marker-start", "url(#yArrowBottom)");

		// remove all of the end ticks
		removeEndTicks(axes);

		// set font size and color for the tick labels
		axes
			.selectAll("text")
			.attr("font-family", fontFamily)
			.attr("font-size", `${tickFontSize}rem`)
			.attr("fill", axesColor);

		// set plot boundary using a clipPath
		axes
			.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", _svg.width)
			.attr("height", _svg.height);

		// add axes labels
		const _xLabelText = xLabel?.text ? xLabel.text : xLabel;
		const _xLabelFontSize = xLabel?.fontSize ? xLabel.fontSize : fontSize;
		const _xLabelWidth = xLabel?.w ? xLabel.w : 10;
		const _xLabelHeight = xLabel?.h ? xLabel.h : 10;
		const _xLabel_id = xLabel?.id ? xLabel?.id : `${id}_x_label`;
		const x_axis_label = render_xAxis
			.append("g")
			.attr(
				"transform",
				translate(_svg.width + _xLabelWidth / 2, -(_xLabelHeight / 2)),
			);

		const _yLabelText = yLabel?.text ? yLabel.text : yLabel;
		const _yLabelFontSize = yLabel?.fontSize ? yLabel.fontSize : fontSize;
		const _yLabelWidth = yLabel?.w ? yLabel.w : 5;
		const _yLabelHeight = yLabel?.h ? yLabel.h : 40;
		const _yLabel_id = yLabel?.id ? yLabel?.id : `${id}_y_label`;
		const y_axis_label = render_yAxis
			.append("g")
			.attr(
				"transform",
				translate(-_yLabelWidth / 2, -(_yLabelHeight / 2)),
			);

		MathText(
			x_axis_label,
			_xLabelText,
			_xLabelFontSize,
			_xLabelWidth,
			_xLabelHeight,
			_xLabel_id,
		);
		MathText(
			y_axis_label,
			_yLabelText,
			_yLabelFontSize,
			_yLabelWidth,
			_yLabelHeight,
			_yLabel_id,
		);
	};

	const renderPlot = (plot) => {
		const userFunctions = getPropertyValues(functions, "f");

		const funcGroupData = generateFunctionData(
			functions,
			userFunctions,
			samples,
			_domainUpperBound,
			_domainLowerBound,
			_rangeUpperBound,
			_rangeLowerBound,
		);

		for (let i = 0; i < funcGroupData.length; i++) {
			plot
				.append("path")
				.datum(funcGroupData[i].data)
				.attr("shape-rendering", "geometric-precision")
				.attr("clip-path", "url(#chart-area)")
				.attr("fill", "none")
				.attr(
					"stroke",
					funcGroupData[i].color ? funcGroupData[i].color : plotLineColor,
				)
				.attr("stroke-width", strokeWidth)
				.attr("d", generate_d_attribute());
		}
	};

	const renderLineSegment = (selection, datum, markPoints = true) => {
		const x1 = xScale(datum.start[0]);
		const y1 = yScale(datum.start[1]);
		const x2 = xScale(datum.end[0]);
		const y2 = yScale(datum.end[1]);
		const className = datum.class
			? ` plot_line_segment_${datum.class}`
			: `plot_line_segment`;
		const canvas = selection.append("g").attr("class", className);
		const stroke = datum.stroke ? datum.stroke : plotLineColor;
		const endPointFill = datum.fill ? datum.fill : stroke;
		insert_circle_marker_definitions(
			canvas,
			"start_point",
			4,
			endPointFill,
			endPointFill,
		);
		insert_circle_marker_definitions(
			canvas,
			"end_point",
			4,
			endPointFill,
			endPointFill,
		);

		const line = canvas.append("line");
		const markerStart = "url(#start_point)";
		const markerEnd = "url(#end_point)";
		const lineProperties = {
			x1,
			y1,
			x2,
			y2,
			class: className,
			stroke,
		};
		attrs(line, lineProperties);
		if (markPoints) {
			line.attr("marker-start", markerStart);
			line.attr("marker-end", markerEnd);
		}
	};

	const renderRectangle = (selection, datum) => {
		const className = datum.class
			? `plot-rectangle ${datum.class}`
			: `plot-rectangle`;
		const rectangle = selection.append("g").attr("class", className);

		const fill = datum.fill ? datum.fill : getBackgroundColor(_plotREF);
		const stroke = datum.stroke ? datum.stroke : plotLineColor;
		const originX = datum.xy[0] - datum.w / 2;
		const originY = datum.xy[1] - datum.h / 2;

		const m1 = xScale(originX);
		const m2 = yScale(originY);

		const b1 = xScale(originX + datum.w);
		const b2 = yScale(originY);
		const b3 = xScale(originX + datum.w);
		const b4 = yScale(originY);

		const t1 = xScale(originX);
		const t2 = yScale(originY + datum.h);
		const t3 = xScale(originX + datum.w);
		const t4 = yScale(originY + datum.h);

		const l1 = xScale(originX);
		const l2 = yScale(originY);
		const l3 = xScale(originX);
		const l4 = yScale(originY + datum.h);

		const r1 = xScale(originX + datum.w);
		const r2 = yScale(originY);
		const r3 = xScale(originX + datum.w);
		const r4 = yScale(originY + datum.h);

		const path = `M ${m1} ${m2} L ${b1} ${b2} ${b3} ${b4} L ${l1} ${l2} ${l3} ${l4} L ${t1} ${t2} ${t3} ${t4} L ${r1} ${r2} ${r3} ${r4}`;

		rectangle
			.append("path")
			.attr("d", path)
			.attr("stroke", stroke)
			.attr("fill", fill);

		if (datum.markCenter) {
			rectangle
				.append("circle")
				.attr("stroke", plotLineColor)
				.attr("fill", plotLineColor)
				.attr("r", 2)
				.attr("cx", xScale(originX + datum.w / 2))
				.attr("cy", yScale(originY + datum.h / 2));
		}
	};

	const renderPoint = (selection, datum, index) => {
		const xPosition = xScale(datum.xy[0]);
		const yPosition = yScale(datum.xy[1]);
		const pointProperties = {
			class: datum.class ? `plot_point ${datum.class}` : "plot_point",
			transform: translate(xPosition, yPosition),
		};
		const circleProperties = {
			r: datum.r ? datum.r : 2,
			fill: datum.fill ? datum.fill : getBackgroundColor(_plotREF),
			stroke: datum.stroke ? datum.stroke : plotLineColor,
		};

		const point = selection.append("g");

		attrs(point, pointProperties);

		const circle = point.append("circle");

		attrs(circle, circleProperties);
	};

	const renderAngle = (selection, datum, index) => {
		const user_input_arm1_length = datum.arms ? datum.arms[0] : 5;
		const user_input_arm2_length = datum.arms ? datum.arms[1] : 5;
		const arm_1_length = scaleDimensionX(user_input_arm1_length);
		const arm_2_length = scaleDimensionX(user_input_arm2_length);
		const className = datum.className
			? `plot-angle ${datum.className}`
			: `plot-angle`;
		const stroke = datum.color ? datum.color : plotLineColor;
		const xPosition = xScale(datum.xy[0]);
		const yPosition = yScale(datum.xy[1]);
		const angleCanvas = selection
			.append("g")
			.attr("class", className)
			.attr("transform", translate(xPosition, yPosition));
		const arm1 = angleCanvas.append("line");
		const arm2 = angleCanvas.append("line");
		attrs(arm1, {
			stroke,
			x1: 0,
			y1: 0,
			x2: arm_1_length,
			y2: 0,
		});
		attrs(arm2, {
			stroke,
			x1: 0,
			y1: 0,
			x2: arm_2_length,
			y2: 0,
			transform: `rotate(-${datum.angle})`,
		});

		// angle marker
		if (datum.angle === 90) {
			const angleMarkerPath = `M 0 -8 H 0 8 V 0 0`;
			angleCanvas
				.append("path")
				.attr("fill", "none")
				.attr("stroke", stroke)
				.attr("d", angleMarkerPath);
		} else {
			const arc = d3
				.arc()
				.innerRadius(10)
				.outerRadius(10)
				.startAngle(0)
				.endAngle((datum.angle * Math.PI) / 180);
			const angleMarker = angleCanvas
				.append("g")
				.attr("transform", `rotate(${90 - datum.angle})`);
			angleMarker
				.append("path")
				.attr("fill", "none")
				.attr("stroke", stroke)
				.attr("d", arc);
		}
		if (datum.label) {
			const x = xScale(datum.label.xy[0]);
			const y = yScale(datum.label.xy[1]);
			const labelWidth = datum.label.w ? datum.label.w : 100;
			const labelHeight = datum.label.h ? datum.label.h : 50;
			const angleMeasure = selection
				.append("g")
				.attr("transform", translate(x, y));
			const label =
				datum.label.type === "radians"
					? `\\dfrac{${reduceFraction(datum.angle, 180)[0]}}{${
							reduceFraction(datum.angle, 180)[1]
					  }}\\pi`
					: `${datum.angle}^\\circ`;
			const _id = datum.id ? datum.id : `angle-measure-${id}`;
			MathText(
				angleMeasure,
				label,
				fontSize,
				labelWidth,
				labelHeight,
				_id,
			);
		}
	};

	const renderLabel = (selection, datum, index) => {
		const xPosition = xScale(datum.xy[0]);
		const yPosition = yScale(datum.xy[1]);
		const labelFontSize = datum.fontSize ? datum.fontSize : fontSize;
		const _id = id + datum.id.replace(/\s/g, "");
		const labelProperties = {
			class: datum.class ? `plot_label ${datum.class}` : "plot_label",
			transform: translate(xPosition, yPosition),
		};
		const label = selection.append("g");
		attrs(label, labelProperties);
		MathText(label, datum.id, labelFontSize, datum.w, datum.h, _id);
	};

	const renderCircle = (selection, datum, index) => {
		const cx = xScale(datum.xy[0]) + 0.5;
		const cy = yScale(datum.xy[1]) + 0.5;
		const stroke = datum.stroke ? datum.stroke : plotLineColor;
		const fill = datum.fill ? datum.fill : getBackgroundColor(_plotREF);
		const r = datum.r ? scaleDimensionX(datum.r) : scaleDimensionX(5);
		const className = datum.class
			? `plot-circle ${datum.class}`
			: `plot-circle`;
		const circleCanvas = selection.append("g").attr("class", className);
		const circle = circleCanvas.append("circle");
		attrs(circle, { r, stroke, fill, cx, cy });
		if (datum.markCenter) {
			const center = circleCanvas.append("circle");
			attrs(center, { stroke, fill, r: 2, cx, cy });
		}
	};

	const insert_circle_marker_definitions = (
		selection,
		markerId = "dot",
		r = 5,
		stroke = "grey",
		fill = "none",
		markerWidth = r,
		markerHeight = r,
		orient = "auto",
		viewBox = `0 0 ${r * 2 + 2} ${r * 2 + 2}`,
	) => {
		selection
			.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", markerId)
			.attr("viewBox", viewBox)
			.attr("refX", r)
			.attr("refY", r)
			.attr("markerWidth", markerWidth)
			.attr("markerHeight", markerHeight)
			.attr("orient", orient)
			.append("svg:circle")
			.attr("cx", r)
			.attr("cy", r)
			.attr("r", r)
			.attr("fill", fill)
			.attr("stroke", stroke);
	};

	const renderLine = (selection, datum, index) => {
		const x1 = xScale(datum.start[0]);
		const y1 = yScale(datum.start[1]);
		const x2 = xScale(datum.end[0]);
		const y2 = yScale(datum.end[1]);
		const className = datum.class
			? ` plot_line_segment_${datum.class}`
			: `plot_line_segment`;
		const canvas = selection.append("g").attr("class", className);
		const stroke = datum.stroke ? datum.stroke : plotLineColor;
		const endPointFill = datum.fill ? datum.fill : stroke;
		insertArrowDefinitions(
			canvas,
			"plot_line_arrow_end",
			0,
			0,
			5,
			5,
			"auto",
			endPointFill,
		);
		insertArrowDefinitions(
			canvas,
			"plot_line_arrow_start",
			0,
			0,
			5,
			5,
			"auto-start-reverse",
			endPointFill,
		);
		const line = canvas.append("line");
		const arrowEnd = "url(#plot_line_arrow_end)";
		const arrowStart = "url(#plot_line_arrow_start)";
		const lineProperties = {
			x1,
			y1,
			x2,
			y2,
			class: className,
			stroke,
			"marker-start": arrowStart,
			"marker-end": arrowEnd,
		};
		attrs(line, lineProperties);
	};

	const renderRay = (selection, datum, index) => {
		const x1 = xScale(datum.start[0]);
		const y1 = yScale(datum.start[1]);
		const x2 = xScale(datum.end[0]);
		const y2 = yScale(datum.end[1]);
		const className = datum.class
			? ` plot_line_segment_${datum.class}`
			: `plot_line_segment`;
		const canvas = selection.append("g").attr("class", className);
		const stroke = datum.stroke ? datum.stroke : plotLineColor;
		const endPointFill = datum.fill ? datum.fill : stroke;
		insertArrowDefinitions(
			canvas,
			"ray_arrow_end",
			0,
			0,
			5,
			5,
			"auto",
			endPointFill,
		);
		insert_circle_marker_definitions(
			canvas,
			"ray_start_point",
			5,
			endPointFill,
			endPointFill,
		);
		const line = canvas.append("line");
		const arrowEnd = "url(#ray_arrow_end)";
		const circleStart = "url(#ray_start_point)";
		const lineProperties = {
			x1,
			y1,
			x2,
			y2,
			class: className,
			stroke,
			"marker-start": circleStart,
			"marker-end": arrowEnd,
		};
		attrs(line, lineProperties);
	};

	const renderGeometries = (geometries, plot) => {
		for (let i = 0; i < geometries.length; i++) {
			let geometry = geometries[i];
			switch (geometry.type) {
				case "rectangle":
					renderRectangle(plot, geometry, i);
					break;
				case "point":
					renderPoint(plot, geometry, i);
					break;
				case "segment":
					renderLineSegment(plot, geometry, i);
					break;
				case "line":
					renderLine(plot, geometry, i);
					break;
				case "ray":
					renderRay(plot, geometry, i);
					break;
				case "label":
					renderLabel(plot, geometry, i);
					break;
				case "circle":
					renderCircle(plot, geometry, i);
					break;
				case "angle":
					renderAngle(plot, geometry, i);
					break;
			}
		}
	};

	useEffect(() => {
		if (_plotREF.current) {
			const canvas = d3.select(_plotREF.current).select("g.svgElement");
			const plot = canvas.append("g").attr("class", "plot");
			if (!noAxes) {
				renderAxes(plot);
			}
			if (functions) {
				renderPlot(canvas, plot);
			}
			if (geo) {
				renderGeometries(geo, plot);
			}
		}
	});
	return (
		<Base
			id={_plotREF}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
