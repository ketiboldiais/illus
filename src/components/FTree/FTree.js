import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { generateFTreeData } from "./generateFTreeData";

export const FTree = ({
	data = [],
	width = 200,
	height = 150,
	containerWidth,
	containerHeight,
	margins = [20, 20, 20, 20],
	isDirected = false,
	nodeColor = "white",
	edgeColor = "firebrick",
	fontFamily = 'system-ui',
	nodeRadius = 10,
	edgeLength = 1,
	repulsion = 20,
	radiusByLevel = 1.2,
	ordinalColorLevel = ["red", "tomato", "salmon"],
	linearColorLevel = [],
	nodeTextColor = "black",
	nodeStrokeColor = edgeColor,
	nodeTextFontSize = 8,
	nodeTextDy = -10,
	nodeTextDx = 3,
}) => {
	const _ftreeREF = useRef();

	const _svg = svg(width, height, margins);

	const _data = generateFTreeData(data);

	const stratifiedData = d3
		.stratify()
		.id((d) => d.child)
		.parentId((d) => d.parent)(_data);

	const root = d3.hierarchy(stratifiedData);

	const _links = root.links();
	const _nodes = root.descendants();

	const forceCenter = d3
		.forceCenter()
		.x(_svg.width / 2)
		.y(_svg.height / 2);
	const manyBody = d3.forceManyBody().strength(-50);
	const linkForce = d3
		.forceLink(_links)
		.id((d) => d.id)
		.distance(edgeLength)
		.strength(1);

	const simulation = d3
		.forceSimulation(_nodes)
		.force("link", linkForce)
		.force("center", forceCenter)
		.force("charge", manyBody)
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.force("collision", d3.forceCollide().radius(repulsion));

	const ordinalColor = (d) => {
		return ordinalColorLevel[d.data.depth]
			? ordinalColorLevel[d.data.depth]
			: nodeColor;
	};
	const linearColor = (d) => {
		const maxDepth = d3.max(_nodes.map((datum) => datum.data.depth));
		const color = d3
			.scaleLinear()
			.domain([0, maxDepth])
			.range(linearColorLevel);
		return color(d.data.depth);
	};

	useEffect(() => {
		const canvas = d3.select(_ftreeREF.current).select("g.svgElement");
		const tree = canvas.append("g").attr("class", "ftree");
		if (isDirected) {
			insertArrowDefinitions(
				canvas,
				"tree-arrow",
				25,
				0,
				5,
				5,
				"auto",
				edgeColor,
			);
		}
		const link = tree
			.append("g")
			.attr("class", "ftree-edge")
			.attr("stroke", edgeColor)
			.selectAll("line")
			.data(_links)
			.join("line");
		const node = tree
			.selectAll("ftree-nodes")
			.data(_nodes)
			.enter()
			.append("g")
			.attr("class", (d) => `ftree-node ftree-node-level-${d.data.depth}`);
		node
			.append("circle")
			.attr("fill", (d) => {
				if (ordinalColorLevel) return ordinalColor(d);
				else if (linearColorLevel) return linearColor(d);
				else return nodeColor;
			})
			.attr("stroke", nodeStrokeColor)
			.attr("r", (d) => {
				if (radiusByLevel)
					return nodeRadius / (d.data.depth + radiusByLevel);
				else return nodeRadius;
			});

		node
			.append("text")
			.text((d) => d.data.id)
			.attr('font-family', fontFamily)
			.attr("dy", nodeTextDy)
			.attr("dx", nodeTextDx)
			.attr("font-size", nodeTextFontSize)
			.attr("fill", nodeTextColor);

		simulation.on("tick", () => {
			link
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y);
			node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
		});
	});
	return (
		<Base
			id={_ftreeREF}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
