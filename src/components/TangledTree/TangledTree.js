import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { setValue } from "../utils/setValue/setValue";

export const TangledTree = ({
	data,
	width = 500,
	height = 300,
	containerWidth = 70,
	containerHeight = 50,
	margins = [30, 10, 30, 10],
	nodeHeight = 25,
	nodeWidth = 100,
	bundleWidth = 30,
	levelPadding = 20,
	xOffset = 0,
	yOffset = 0,
	curveFactor = 16,
	textOutline = 6,
	levelColors,
	nodeTextColor = "black",
	nodeTextFontSize = "",
	edgeThickness = 2,
}) => {
	const TangledTreeFigure = useRef();
	svg(width, height, margins);
	const _colors = setValue(levelColors, d3.schemeDark2);
	const color = d3.scaleOrdinal(_colors);

	data.forEach((l, i) => l.forEach((n) => (n.level = i)));

	let _nodes = data.reduce((a, x) => a.concat(x), []);

	let _nodeIndex = {};

	_nodes.forEach((d) => (_nodeIndex[d.id] = d));

	_nodes.forEach((d) => {
		d.parents = (d.parents === undefined ? [] : d.parents).map(
			(p) => _nodeIndex[p],
		);
	});
	data.forEach((l, i) => {
		let index = {};
		l.forEach((n) => {
			if (n.parents.length === 0) {
				return;
			}
			let id = n.parents
				.map((d) => d.id)
				.sort()
				.join("--");
			if (id in index) {
				index[id].parents = index[id].parents.concat(n.parents);
			} else {
				index[id] = {
					id: id,
					parents: n.parents.slice(),
					level: i,
				};
			}
			n.bundle = index[id];
		});
		l.bundles = Object.keys(index).map((k) => index[k]);
		l.bundles.forEach((b, i) => (b.i = i));
	});
	let _links = [];
	_nodes.forEach((d) => {
		d.parents.forEach((p) =>
			_links.push({ source: d, bundle: d.bundle, target: p }),
		);
	});
	data.forEach((l) => {
		xOffset += l.bundles.length * bundleWidth;
		yOffset += levelPadding;
		l.forEach((n, i) => {
			n.x = n.level * nodeWidth + xOffset + nodeHeight / 2;
			n.y = i * nodeHeight + yOffset;
		});
		yOffset += l.length * nodeHeight;
	});
	data.forEach((l) => {
		let i = 0;
		l.bundles.forEach((b) => {
			b.x =
				b.parents[0].x +
				nodeWidth +
				(l.bundles.length - 1 - b.i) * bundleWidth;
			b.y = i * nodeHeight;
		});
		i += l.length;
	});
	_links.forEach((l) => {
		l.xt = l.target.x;
		l.yt = l.target.y;
		l.xb = l.bundle.x;
		l.yb = l.bundle.y;
		l.xs = l.source.x;
		l.ys = l.source.y;
	});
	const pathGenerate = (d) => {
		return `M${d.xt} ${d.yt}
			L${d.xb - curveFactor} ${d.yt}
			A${curveFactor} ${curveFactor} 90 0 1 ${d.xb} ${d.yt + curveFactor}
			L${d.xb} ${d.ys - curveFactor}
			A${curveFactor} ${curveFactor} 90 0 0 ${d.xb + curveFactor} ${d.ys}
			L${d.xs} ${d.ys}`;
	};

	useEffect(() => {
		const canvas = d3
			.select(TangledTreeFigure.current)
			.select("g.svgElement");
		const tree = canvas.append("g").attr("class", "tangled-tree");
		const links = tree.append("g").attr("class", "tangled-tree-edges");
		const nodes = tree.append("g").attr("class", "tangled-tree-nodes");
		links
			.selectAll("path")
			.data(_links)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke", (d) => `${color(d.bundle.id)}`)
			.attr("d", (d) => pathGenerate(d))
			.attr("stroke-width", edgeThickness);
		nodes
			.selectAll("white-text")
			.data(_nodes)
			.enter()
			.append("text")
			.attr("stroke", "white")
			.attr("stroke-width", `${textOutline}px`)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.text((d) => d.id);
		nodes
			.selectAll("node-labels")
			.data(_nodes)
			.enter()
			.append("text")
			.attr("class", (d) => `node-${d.focus ? "focus" : ""}-text`)
			.attr("fill", nodeTextColor)
			.attr("font-size", (d) =>
				d.fontSize ? d.fontSize : nodeTextFontSize,
			)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.text((d) => d.id);
	});

	return (
		<Base
			id={TangledTreeFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
