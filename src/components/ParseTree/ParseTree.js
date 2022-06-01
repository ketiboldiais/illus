import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { generateHTreeData } from "../HTree/generateHTreeData/generateHTreeData";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { translate } from "../utils/translate/translate";

export const ParseTree = ({
	data = [],
	width = 450,
	height = 350,
	containerWidth,
	containerHeight,
	margins = [70, 70, 70, 70],
	fontSize = 14,
	isDirected = false,
	sibSpace = 1,
	nSibSpace = 2,
	nodeRadius = 7,
	nodeTextColor = "",
	edgeColor = "grey",
}) => {
	const _ptreeREF = useRef();
	const _svg = svg(width, height, margins);
	const _data = generateHTreeData(data);
	let root = d3
		.stratify()
		.id((d) => d.child)
		.parentId((d) => d.parent)(_data);
	const diagonal = d3
		.linkVertical()
		.x((d) => d.x)
		.y((d) => d.y);
	const treeStructure = d3
		.tree()
		.size([_svg.width, _svg.height])
		.separation((a, b) => (a.parent === b.parent ? sibSpace : nSibSpace));
	treeStructure(root);
	const links = root.links();
	const nodes = root.descendants();

	useEffect(() => {
		const canvas = d3.select(_ptreeREF.current).select("g.svgElement");
		const htree = canvas.append("g").attr("class", "htree");
		if (isDirected)
			insertArrowDefinitions(
				htree,
				"ptree-arrow",
				nodeRadius * 3,
				0.1,
				6,
				6,
				"auto",
				edgeColor,
			);
		const _links = htree.append("g").attr("class", "ptree-edge");

		// append paths
		_links
			.selectAll("htree-edge")
			.data(links)
			.enter()
			.filter((d) => !(d.source.data.display || d.target.data.display))
			.append("path")
			.attr("fill", "none")
			.attr("d", (d) => diagonal(d))
			.attr("stroke", edgeColor)
			.attr("marker-end", "url(#ptree-arrow)");
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
					`ptree-node${
						d.children ? ` ptree-node-branch` : `ptree-node-leaf`
					}`,
			)
			.attr("transform", (d) => translate(d.x, d.y));

		// add text outline
		_node
			.append("text")
			.text((d) => d.id)
			.attr("stroke", "white")
			.attr("font-size", fontSize)
			.attr("stroke-width", fontSize / 2)
			.attr("text-anchor", "middle")
			.attr("dy", nodeRadius / 2);

		// add text to the node
		_node
			.append("text")
			.text((d) => d.id)
			.attr("font-size", fontSize)
			.attr("fill", nodeTextColor)
			.attr("text-anchor", "middle")
			.attr("dy", nodeRadius / 2);
	});

	return (
		<Base
			id={_ptreeREF}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
