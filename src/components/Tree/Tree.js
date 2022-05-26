import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { setValue } from "../utils/setValue/setValue";
import { attrs } from "../utils/attrs/attrs";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { isNotUndefined } from "../utils/isNotUndefined/isNotUndefined";
import { renderLevelMarks } from "./renderLevelMarks/renderLevelMarks";
import { renderDepthMarks } from "./renderDepthMarks/renderDepthMarks";
import { renderHeightMarks } from "./renderHeightMarks/renderHeightMarks";
import { renderBalanceFactors } from "./renderBalanceFactors/renderBalanceFactors";
import { generateTreeData } from "./generateTreeData/generateTreeData";
import { calculateTreeSize } from "./calculateTreeSize/calculateTreeSize";

export const Tree = ({
	data = [],
	width = 250,
	height = 140,
	narrow = 10,
	containerWidth = 100,
	containerHeight = 60,
	margins = [20, 20 + narrow, 20, 20 + narrow],
	fontFamily = "system-ui",
	edgeLength = null,
	isDirected = false,
	nodeRadius = 7,
	nodeColor = "#ffffff",
	edgeColor = "#000000",
	nodeTextColor = edgeColor,
	nodeStrokeColor = edgeColor,
	markBalanceFactor = false,
	markHeight = false,
	markDepth = false,
	markLevels = false,
	nodeTextFontSize = 8,
	balancedTextColor = edgeColor,
	imbalancedTextColor = edgeColor,
	edgeThickness = 1,
	heightFontSize = 7,
	heightTextColor = edgeColor,
	hideNodeCircles = false,
	balanceFactorFontSize = 7,
	levelLineColor = "grey",
	levelTextColor = "grey",
	levelFontSize = 7,
}) => {
	const TreeFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = generateTreeData(data);
	const root = d3
		.stratify()
		.id((d) => d.child)
		.parentId((d) => d.parent)(_data);
	const _edgeLength = setValue(edgeLength, calculateTreeSize(root));
	const treeStructure = d3
		.tree()
		.size([_svg.width - narrow, _edgeLength])
		.separation((a, b) => (a.parent === b.parent ? 1 : 1.1));
	treeStructure(root);

	useEffect(() => {
		const canvas = d3.select(TreeFigure.current).select("g.svgElement");
		const tree = canvas.append("g").attr("class", "tree");
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
		const links = tree.append("g").attr("class", "tree-links");
		const linkLines = links
			.selectAll("line")
			.data(root.links())
			.enter()
			.append("line");
		attrs(linkLines, {
			class: "tree-edge",
			display: (d) =>
				d.source.data.display || d.target.data.display
					? "none"
					: "initial",
			x1: (d) => d.source.x,
			y1: (d) => d.source.y,
			x2: (d) => d.target.x,
			y2: (d) => d.target.y,
			stroke: edgeColor,
			"stroke-opacity": (d) => setValue(d.target.data.opacity, 1),
			"marker-end": "url(#arrow_end)",
			"stroke-width": edgeThickness,
		});

		const nodes = tree
			.selectAll("circles")
			.data(root.descendants())
			.enter()
			.append("g")
			.attr("class", (d) => {
				if (d.data.focus) {
					return d.height === 0
						? `tree-node tree-node-${d.data.focus} tree-node-leaf`
						: `tree-node tree-node-${d.data.focus} tree-node-branch`;
				} else {
					return d.height === 0
						? "node-circle tree-node-leaf"
						: "node-circle tree-node-branch";
				}
			});

		const nodeCircles = nodes
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.noCircle)
			.filter((d) => !d.data.type)
			.append("circle")
			.attr("fill", hideNodeCircles ? "inherit" : nodeColor)
			.attr("r", nodeRadius)
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("stroke", hideNodeCircles ? "none" : nodeStrokeColor);
		const nodeLabels = tree.append("g").attr("class", "node-text");
		const dataField = nodeLabels
			.selectAll("dataFieldLabels")
			.data(root)
			.enter()
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.label)
			.append("text")
			.text((d) => d.id)
			.attr("font-family", fontFamily)
			.attr("font-size", nodeTextFontSize);

		attrs(dataField, {
			class: (d) => {
				if (d.data.focus) {
					return d.height === 0
						? "node-text node-focused-text node-leaf-text"
						: "node-text node-focused-text node-branch-text";
				} else {
					return d.height === 0
						? "node-text node-leaf-text"
						: "node-text node-branch-text";
				}
			},
			x: (d) => d.x,
			y: (d) => {
				if (d.data.noCircle) {
					return d.y + 18;
				} else if (d.data.type) {
					return d.y + nodeRadius;
				} else {
					return d.y;
				}
			},
			dy: "0.3em",
			opacity: (d) => setValue(d.data.opacity, 1),
			"text-anchor": "middle",
			fill: nodeTextColor,
			"font-size": nodeTextFontSize,
		});
		if (markLevels)
			renderLevelMarks(
				tree,
				root,
				_svg,
				levelFontSize,
				levelTextColor,
				levelLineColor,
			);
		if (markDepth) renderDepthMarks(tree, root, nodeRadius);
		if (markHeight)
			renderHeightMarks(
				tree,
				root,
				nodeRadius,
				heightTextColor,
				heightFontSize,
			);
		if (markBalanceFactor)
			renderBalanceFactors(
				tree,
				root.descendants(),
				nodeRadius,
				balanceFactorFontSize,
				balancedTextColor,
				imbalancedTextColor,
			);
	});
	return (
		<Base
			id={TreeFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
