import React, { useRef, useEffect } from "react";
import "./Digraph.css";
import { generateEdges } from "../Graph/generateEdges/generateEdges";
import { generateNodes } from "../Graph/generateNodes/generateNodes";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { attrs } from "../utils/attrs/attrs";
import { translate } from "../utils/translate/translate";

export const Digraph = ({
	data = [[], [], []],
	width = 300,
	height = 300,
	containerWidth = 60,
	containerHeight = 60,
	collisionRadius = 30,
	forceStrength = 0.1,
	forceDistance = 5,
	edgeColor,
	nodeFillColor,
	nodeStrokeColor,
	nodeTextFontSize,
	nodeTextColor,
	strokeWidth,
	arrowFillColor,
	nodeRadius = 5,
	margins = [30, 30, 30, 30],
}) => {
	const digraphFigure = useRef();
	const _svg = svg(width, height, margins);
	const edges = generateEdges(data);
	const nodes = Object.values(generateNodes(data, edges));
	const forceCharge = d3.forceManyBody().strength(forceStrength);
	const forceLink = d3.forceLink(edges).distance(forceDistance);
	const forceCollide = d3.forceCollide().radius(collisionRadius);
	const forceCenter = d3
		.forceCenter()
		.x(_svg.width / 2)
		.y(_svg.height / 2);
	const force = d3
		.forceSimulation(nodes)
		.force("charge", forceCharge)
		.force("link", forceLink)
		.force("collision", forceCollide)
		.force("center", forceCenter);

	useEffect(() => {
		// set up group
		const canvas = d3.select(digraphFigure.current).select("g.svgElement");
		const digraph = canvas.append("g").attr("class", "digraph");
		insertArrowDefinitions(
			digraph,
			"digraph-arrow",
			15,
			-1.5,
			6,
			6,
			"auto",
			arrowFillColor,
		);
		const _edges = digraph
			.append("g")
			.attr("class", "digraph-edges")
			.selectAll("digraph-edges")
			.data(edges)
			.enter()
			.append("path");
		attrs(_edges, {
			class: "digraph-edge",
			fill: "none",
			stroke: edgeColor,
			"stroke-width": strokeWidth,
			"marker-end": "url(#digraph-arrow)",
		});
		const _nodes = digraph.append("g").attr("class", "digraph-nodes");
		const _node = _nodes
			.selectAll("digraph-nodes")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "digraph-node");
		const nodeCircle = _node.append("circle");
		attrs(nodeCircle, {
			class: "digraph-node-circle",
			fill: nodeFillColor,
			stroke: nodeStrokeColor,
			r: nodeRadius,
		});

		const nodeLabelOutline = _node.append("text").text((d) => d.id);

		attrs(nodeLabelOutline, {
			class: "digraph-node-text",
			dy: '1em',
			"stroke-width": '3px',
			stroke: "white",
			"font-size": nodeTextFontSize,
			x: nodeRadius,
		});

		const nodeLabels = _node.append("text").text((d) => d.id);
		attrs(nodeLabels, {
			class: "digraph-node-text",
			fill: nodeTextColor,
			dy: "1em",
			"font-size": nodeTextFontSize,
			x: nodeRadius,
		});
		force.on("tick", () => {
			_edges.attr("d", (d) => {
				let dx = d.target.x - d.source.x;
				let dy = d.target.y - d.source.y;
				let dr = Math.sqrt(dx * dx + dy * dy);
				return `M${d.source.x},${d.source.y} A ${dr},${dr} 0 0, 1 ${d.target.x}, ${d.target.y}`;
			});
			_node.attr("transform", (d) => translate(d.x, d.y));
		});
	});
	return (
		<Base
			id={digraphFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
