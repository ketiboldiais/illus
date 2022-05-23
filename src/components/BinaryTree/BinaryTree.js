import React, { useRef, useEffect } from "react";
import "./BinaryTree.css";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { setValue } from "../utils/setValue/setValue";
import { attrs } from "../utils/attrs/attrs";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { isNotUndefined } from "../utils/isNotUndefined/isNotUndefined";
import { renderLevelMarks } from "../Tree/renderLevelMarks/renderLevelMarks";
import { renderDepthMarks } from "../Tree/renderDepthMarks/renderDepthMarks";
import { renderHeightMarks } from "../Tree/renderHeightMarks/renderHeightMarks";
import { renderBalanceFactors } from "../Tree/renderBalanceFactors/renderBalanceFactors";
import { calculateTreeSize } from "../Tree/calculateTreeSize/calculateTreeSize";
import { generateBinaryTreeData } from "./GenerateBinaryTreeData/generateBinaryTreeData";

export const BinaryTree = ({
	data = [[]],
	width = 300,
	height = 150,
	narrow = 30,
	containerWidth = 100,
	containerHeight = 50,
	marginTop = 20,
	marginLeft = 20,
	marginBottom = 20,
	marginRight = 20,
	margins = [
		marginTop,
		marginRight + narrow,
		marginBottom,
		marginLeft + narrow,
	],
	edgeLength = 100,
	isDirected = false,
	nodeRadius = 7,
	nodeTextColor = "white",
	nodeStrokeColor = "black",
	nodeFillColor = "tomato",
	markBalanceFactor = false,
	markHeight = false,
	markDepth = false,
	markLevels = false,
	nodeTextFontSize = "0.55rem",
	balancedTextColor = "forestgreen",
	imbalancedTextColor = "firebrick",
	edgeColor = "black",
	edgeThickness = "1",
	heightFontSize = "0.6rem",
	heightTextColor = "black",
	balanceFactorFontSize = "0.6rem",
	levelLineColor = "lightblue",
	levelTextColor = "lightblue",
	levelFontSize = "0.55rem",
}) => {
	const TreeFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = generateBinaryTreeData(data);
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
		const tree = canvas.append("g").attr("class", "binary-tree");
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
		const links = tree.append("g").attr("class", "binary-tree-links");
		const linkLines = links
			.selectAll("line")
			.data(root.links())
			.enter()
			.append("line");
		attrs(linkLines, {
			class: "binary-tree-edge",
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

		const nodes = tree
			.selectAll("circles")
			.data(root.descendants())
			.enter()
			.append("g")
			.attr("class", "binary-tree-nodes");

		const nodeCircles = nodes
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.noCircle)
			.filter((d) => !d.data.type)
			.append("circle");
		attrs(nodeCircles, {
			class: (d) => {
				if (d.data.focus) {
					return d.height === 0
						? "binary-tree-node-circle binary-tree-node-circle-focused binary-tree-node-circle-leaf"
						: "binary-tree-node-circle binary-tree-node-circle-focused binary-tree-node-circle-branch";
				} else {
					return d.height === 0
						? "binary-tree-node-circle binary-tree-node-circle-leaf"
						: "binary-tree-node-circle binary-tree-node-circle-branch";
				}
			},
			cx: (d) => d.x,
			cy: (d) => d.y,
			r: nodeRadius,
			stroke: nodeStrokeColor,
			fill: nodeFillColor,
		});

		const nodeLabels = tree.append("g").attr("class", "node-text");
		const dataField = nodeLabels
			.selectAll("dataFieldLabels")
			.data(root)
			.enter()
			.filter((d) => !d.data.display)
			.filter((d) => !d.data.label)
			.append("text")
			.text((d) => d.id);
		attrs(dataField, {
			class: (d) => {
				if (d.data.focus) {
					return d.height === 0
						? "binary-tree-node-text binary-tree-node-focused-text binary-tree-node-leaf-text"
						: "binary-tree-node-text binary-tree-node-focused-text binary-tree-node-branch-text";
				} else {
					return d.height === 0
						? "binary-tree-node-text binary-tree-node-leaf-text"
						: "binary-tree-node-text binary-tree-node-branch-text";
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
