import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { generateHTreeData } from "./generateHTreeData/generateHTreeData";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { attrs } from "../utils/attrs/attrs";
import { translate } from "../utils/translate/translate";
import { setValue } from "../utils/setValue/setValue";

export const HTree = ({
	data = [],
	width = 400,
	height = 400,
	containerWidth,
	containerHeight,
	margins = [70, 70, 70, 70],
	isDirected = true,
	fontFamily="system-ui",
	sibSpace = 1,
	nSibSpace = 2,
	edgeLength = null,
	nodeRadius = 7,
	nodeFillColor = "#FFF9F9",
	edgeColor = "#D77FA1",
	nodeTextColor = "#A68DAD",
	nodeStrokeColor = edgeColor,
	nodeTextFontSize = "0.7rem",
	edgeThickness = "1",
	hideNodeCircles = false,
}) => {
	const HTree = useRef();
	const _svg = svg(width, height, margins);
	const _data = generateHTreeData(data);
	let root = d3
		.stratify()
		.id((d) => d.child)
		.parentId((d) => d.parent)(_data);
	const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
	const treeStructure = d3
		.tree()
		.size([_svg.height, _svg.width])
		.separation((a, b) => (a.parent === b.parent ? sibSpace : nSibSpace));
	treeStructure(root);
	const links = root.links();
	const nodes = root.descendants();

	useEffect(() => {
		const canvas = d3.select(HTree.current).select("g.svgElement");
		const htree = canvas.append("g").attr("class", "htree");
		if (isDirected)
			insertArrowDefinitions(
				htree,
				"htree-arrow",
				nodeRadius*3,
				0.1,
				6,
				6,
				"auto",
				edgeColor,
			);
		const _links = htree.append("g").attr("class", "htree-edges");
		const _link = _links
			.selectAll("htree-edge")
			.data(links)
			.enter()
			.filter((d) => !(d.source.data.display || d.target.data.display))
			.append("path");
		attrs(_links.selectAll("path"), {
			class: "htree-edge",
			fill: "none",
			d: (d) => diagonal(d),
			stroke: edgeColor,
			"marker-end": "url(#htree-arrow)",
		});

		const _nodes = htree.append("g").attr("class", "htree-nodes");
		const _node = _nodes
			.selectAll("htree-node")
			.data(nodes)
			.enter()
			.filter((d) => !(d.data.display === "none"))
			.append("g")
			.attr(
				"class",
				(d) =>
					"htree-node" +
					(d.children ? " htree-node-branch" : " htree-node-leaf"),
			)
			.attr("transform", (d) => translate(d.y, d.x));

		const nodeCircle = _node.append("circle");
		attrs(_node.selectAll("circle"), {
			class: "htree-node-circle",
			r: nodeRadius,
			fill: (d) => setValue(d.data.fill, nodeFillColor),
			stroke: (d) => setValue(d.data.stroke, nodeStrokeColor),
		});

		// add text to the node
		const nodeText = _node.append("text").text((d) => d.id);
		attrs(_node.selectAll("text"), {
			class: "htree-node-text",
			"font-family": fontFamily,
			dy: (d, i) => {
				if (!d.children) return "-1em";
				else if (i % 2 === 0) return "-1em";
				else return "2em";
			},
			fill: nodeTextColor,
			"font-size": nodeTextFontSize,
			x: (d) => (d.children ? -5 : 5),
			"text-anchor": (d) => {
				if (d.data.anchor) return d.data.anchor;
				else return d.children ? "end" : "start";
			},
		});
	});

	return (
		<Base
			id={HTree}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
