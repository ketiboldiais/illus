import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import { attrs } from "../utils/attrs/attrs";
import * as d3 from "d3";

const generateNodes = (edges) => {
	let nodes = {};
	edges.forEach(function (link) {
		if (link.hasOwnProperty("sattr")) {
			nodes[link.source] = { name: link.source, attr: link.sattr };
		}
		if (link.hasOwnProperty("tattr")) {
			nodes[link.target] = { name: link.target, attr: link.tattr };
		}
		link.source =
			nodes[link.source] || (nodes[link.source] = { name: link.source });
		link.target =
			nodes[link.target] || (nodes[link.target] = { name: link.target });
	});
	return nodes;
};

export const Network = ({
	data = [[]],
	width = 500,
	height = 500,
	containerWidth = 90,
	containerHeight = 90,
	repulsion = 0.01,
	edgeLength = 30,
	collisionRadius = 10,
	margins = [50, 50, 50, 50],
	nodeRadius = 5,
	edgeColor = "",
	edgeWidth = "",
	nodeFillColor = "",
	nodeStrokeColor = "",
	nodeStrokeWidth = "",
	nodeTextColor = "",
	nodeTextFontSize = "",
}) => {
	const NetworkFigure = useRef();
	const _svg = svg(width, height, margins);
	const edges = data;
	const nodes = Object.values(generateNodes(edges));
	const networkCenter = d3
		.forceCenter()
		.x(_svg.width / 2)
		.y(_svg.height / 2);
	const manyBody = d3.forceManyBody().strength(-150).distanceMax(100);
	const forceX = d3.forceX(_svg.width / 2).strength(repulsion);
	const forceY = d3.forceY(_svg.height / 2).strength(repulsion);
	const force = d3
		.forceSimulation(nodes)
		.force("charge", manyBody)
		.force("link", d3.forceLink(edges).distance(edgeLength).iterations(1))
		.force("center", networkCenter)
		.force("x", forceX)
		.force("y", forceY)
		.force("collision", d3.forceCollide().radius(collisionRadius));
	

	useEffect(() => {
		const canvas = d3.select(NetworkFigure.current).select("g.svgElement");
		const graph = canvas.append("g").attr("class", "graph");
		const edgeEnter = graph
			.selectAll("g.edges")
			.data(edges)
			.enter()
			.append("g")
			.attr("class", "graph-edge");
		const edgeLines = edgeEnter.append("line");
		attrs(edgeLines, {
			class: "graph-edge-line",
			stroke: edgeColor,
			strokeWidth: edgeWidth,
		});
		const nodeEnter = graph
			.selectAll("g.nodes")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "graph-node");

		const nodeCircles = nodeEnter.append("circle");
		attrs(nodeCircles, {
			class: "graph-node-circle",
			r: nodeRadius,
			fill: nodeFillColor,
			stroke: nodeStrokeColor,
			strokeWidth: nodeStrokeWidth,
		});

		const nodeTextOutline = nodeEnter.append("text").text((d) => d.id);

		attrs(nodeTextOutline, {
			class: "graph-node-text-outline",
			"text-anchor": "middle",
			dy: -11,
			"stroke-width": "1px",
			"stroke-opacity": "1px",
			stroke: "white",
			"font-size": "12px",
		});

		const radialNode = nodeEnter
			.filter((d) => d?.attr?.radial)
			.append("g")
			.attr("class", "node-radial-border")
			.append("circle")
			.attr("r", (d) => d.attr.radial);

		const nodeText = nodeEnter
			.append("text")
			.attr("foo", (d) => console.log(d))
			.text((d) => d.name);

		attrs(nodeText, {
			class: "graph-node-text",
			"text-anchor": "middle",
			fill: nodeTextColor,
			dy: -11,
			"font-size": nodeTextFontSize,
		});

		force.on("tick", function () {
			const edgeSelection = edgeEnter.selectAll("line");
			attrs(edgeSelection, {
				x1: (d) => d.source.x,
				y1: (d) => d.source.y,
				x2: (d) => d.target.x,
				y2: (d) => d.target.y,
			});
			nodeEnter.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
		});
	});
	return (
		<Base
			id={NetworkFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
