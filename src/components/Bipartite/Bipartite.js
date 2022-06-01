import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { generateBipartiteNodes } from "./generateBipartiteNodes/generateBipartiteNodes";
import { generateBipartiteEdges } from "./generateBipartiteEdges/generateBipartiteEdges";
import { setValue } from "../utils/setValue/setValue";
import { translate } from "../utils/translate/translate";
import { attrs } from "../utils/attrs/attrs";

const justify = (node, n) => {
	return node.sourceLinks.length ? node.depth : n - 1;
};

const find = (nodeById, id) => {
	const node = nodeById.get(id);
	if (!node) throw new Error("missing: " + id);
	return node;
};

const computeNodeLinks = (nodes, links, id) => {
	for (const [i, node] of nodes.entries()) {
		node.index = i;
		node.sourceLinks = [];
		node.targetLinks = [];
	}
	const nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
	for (const [i, link] of links.entries()) {
		link.index = i;
		let { source, target } = link;
		if (typeof source !== "object")
			source = link.source = find(nodeById, source);
		if (typeof target !== "object")
			target = link.target = find(nodeById, target);
		source.sourceLinks.push(link);
		target.targetLinks.push(link);
	}
};

const computeNodeValues = (nodes) => {
	for (const node of nodes) {
		node.value =
			node.fixedValue === undefined
				? Math.max(
						d3.sum(node.sourceLinks, node.value),
						d3.sum(node.targetLinks, node.value),
				  )
				: node.fixedValue;
	}
};

const computeNodeDepths = (nodes) => {
	const n = nodes.length;
	let current = new Set(nodes);
	let next = new Set();
	let x = 0;
	while (current.size) {
		for (const node of current) {
			node.depth = x;
			for (const { target } of node.sourceLinks) {
				next.add(target);
			}
		}
		if (++x > n) throw new Error("circular link");
		current = next;
		next = new Set();
	}
};

const computeNodeHeights = (nodes) => {
	const n = nodes.length;
	let current = new Set(nodes);
	let next = new Set();
	let x = 0;
	while (current.size) {
		for (const node of current) {
			node.height = x;
			for (const { source } of node.targetLinks) {
				next.add(source);
			}
		}
		if (++x > n) throw new Error("circular link");
		current = next;
		next = new Set();
	}
};

const computeNodeLayers = (nodes, x1, x0, dx, align, sort) => {
	const x = d3.max(nodes, (d) => d.depth) + 1;
	const kx = (x1 - x0 - dx) / (x - 1);
	const columns = new Array(x);
	for (const node of nodes) {
		const i = Math.max(
			0,
			Math.min(x - 1, Math.floor(align.call(null, node, x))),
		);
		node.layer = i;
		node.x0 = x0 + i * kx;
		node.x1 = node.x0 + dx;
		if (columns[i]) columns[i].push(node);
		else columns[i] = [node];
	}
	// if (sort)
	// 	for (const column of columns) {
	// 		column.sort(sort);
	// 	}
	return columns;
};

const ascendingBreadth = (a, b) => {
	return a.y0 - b.y0;
};

const ascendingSourceBreadth = (a, b) => {
	return ascendingBreadth(a.source, b.source) || a.index - b.index;
};

const ascendingTargetBreadth = (a, b) => {
	return ascendingBreadth(a.target, b.target) || a.index - b.index;
};

const reorderLinks = (nodes, linkSort) => {
	if (linkSort === undefined) {
		for (const { sourceLinks, targetLinks } of nodes) {
			sourceLinks.sort(ascendingTargetBreadth);
			targetLinks.sort(ascendingSourceBreadth);
		}
	}
};

const initializeNodeBreadths = (columns, y1, y0, py, nodes, linkSort) => {
	let ky = d3.max(
		columns,
		(c) => (y1 - y0 - (c.length - 1) * py) / d3.sum(c, c.value),
	);
	if (!isFinite(ky)) {
		ky = 0;
	}
	for (const nodes of columns) {
		let y = y0;
		for (const node of nodes) {
			node.y0 = y;
			node.y1 = y + node.value * ky;
			y = node.y1 + py;
			for (const link of node.sourceLinks) {
				link.width = link.value * ky;
			}
		}
		y = (y1 - y + py) / (nodes.length + 1);
		for (let i = 0; i < nodes.length; ++i) {
			const node = nodes[i];
			node.y0 += y * (i + 1);
			node.y1 += y * (i + 1);
		}
		reorderLinks(
			nodes,
			linkSort,
			ascendingTargetBreadth,
			ascendingSourceBreadth,
		);
	}
};

const resolveCollisionsBottomToTop = (nodes, y, i, alpha, py) => {
	for (; i >= 0; --i) {
		const node = nodes[i];
		const dy = (node.y1 - y) * alpha;
		if (dy > 1e-6) {
			node.y0 -= dy;
			node.y1 -= dy;
		}
		y = node.y0 - py;
	}
};

const resolveCollisionsTopToBottom = (nodes, y, i, alpha, py) => {
	for (; i < nodes.length; ++i) {
		const node = nodes[i];
		const dy = (y - node.y0) * alpha;
		if (dy > 1e-6) {
			node.y0 += dy;
			node.y1 += dy;
		}
		y = node.y1 + py;
	}
};

const resolveCollisions = (nodes, alpha, py, y0, y1) => {
	const i = nodes.length >> 1;
	const subject = nodes[i];
	resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha, py);
	resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha, py);
	resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha, py);
	resolveCollisionsTopToBottom(nodes, y0, 0, alpha, py);
};

const reorderNodeLinks = ({ sourceLinks, targetLinks }, linkSort) => {
	if (linkSort === undefined) {
		for (const {
			source: { sourceLinks },
		} of targetLinks) {
			sourceLinks.sort(ascendingTargetBreadth);
		}
		for (const {
			target: { targetLinks },
		} of sourceLinks) {
			targetLinks.sort(ascendingSourceBreadth);
		}
	}
};

const targetTop = (source, target, py) => {
	let y = source.y0 - ((source.sourceLinks.length - 1) * py) / 2;
	for (const { target: node, width } of source.sourceLinks) {
		if (node === target) break;
		y += width + py;
	}
	for (const { source: node, width } of target.targetLinks) {
		if (node === source) break;
		y -= width;
	}
	return y;
};

const sourceTop = (source, target, py) => {
	let y = target.y0 - (target.targetLinks.length - 1) / 2;
	for (const { source: node, width } of target.targetLinks) {
		if (node === source) break;
		y += width + py;
	}
	for (const { target: node, width } of source.sourceLinks) {
		if (node === target) break;
		y -= width;
	}
	return y;
};

const relaxRightToLeft = (columns, alpha, beta, sort, py) => {
	for (let n = columns.length, i = n - 2; i >= 0; --i) {
		const column = columns[i];
		for (const source of column) {
			let y = 0;
			let w = 0;
			for (const { target, value } of source.sourceLinks) {
				let v = value * (target.layer - source.layer);
				y += sourceTop(source, target) * v;
				w += v;
			}
			if (!(w > 0)) continue;
			let dy = (y / w - source.y0) * alpha;
			source.y0 += dy;
			source.y1 += dy;
			reorderNodeLinks(source);
		}
		if (sort === undefined) column.sort(ascendingBreadth);
		resolveCollisions(column, beta);
	}
};

const relaxLeftToRight = (columns, alpha, beta, sort) => {
	for (let i = 1, n = columns.length; i < n; ++i) {
		const column = columns[i];
		for (const target of column) {
			let y = 0;
			let w = 0;
			for (const { source, value } of target.targetLinks) {
				let v = value * (target.layer - source.layer);
				y += targetTop(source, target) * v;
				w += v;
			}
			if (!(w > 0)) continue;
			let dy = (y / w - target.y0) * alpha;
			target.y0 += dy;
			target.y1 += dy;
			reorderNodeLinks(target);
		}
		if (sort === undefined) column.sort(ascendingBreadth);
		resolveCollisions(column, beta);
	}
};

const computeNodeBreadths = (
	nodes,
	x1,
	x0,
	dx,
	align,
	sort,
	py,
	dy,
	y1,
	y0,
	iterations,
	linkSort,
) => {
	const columns = computeNodeLayers(nodes, x1, x0, dx, align, sort);
	py = Math.min(dy, (y1 - y0) / (d3.max(columns, (c) => c.length) - 1));
	initializeNodeBreadths(columns, y1, y0, py, nodes, linkSort);
	for (let i = 0; i < iterations; ++i) {
		const alpha = Math.pow(0.99, i);
		const beta = Math.max(1 - alpha, (i + 1) / iterations);
		relaxRightToLeft(columns, alpha, beta);
		relaxLeftToRight(columns, alpha, beta);
	}
};

const computeLinkBreadths = (nodes) => {
	for (const node of nodes) {
		let y0 = node.y0;
		let y1 = y0;
		for (const link of node.sourceLinks) {
			link.y0 = y0 + link.width / 2;
			y0 += link.width;
		}
		for (const link of node.targetLinks) {
			link.y1 = y1 + link.width / 2;
			y1 += link.width;
		}
	}
};

export const Bipartite = ({
	data = [[], [], []],
	width = 300,
	height = 300,
	containerWidth,
	containerHeight,
	margins = [30, 30, 30, 30],
	fontFamily = "sans-serif",
	edgeColor = "black",
	nodeStrokeWidth = 1,
	nodeStrokeColor = edgeColor,
	nodeFillColor = "white",
	nodeRadius = 5,
	nodeTextColor,
	nodePadding = null,
}) => {
	const bipartiteFigure = useRef();
	const _svg = svg(width, height, margins);
	const edges = generateBipartiteEdges(data);
	const nodes = generateBipartiteNodes(data, edges);
	const nodeCount = nodes.length;
	const x0 = 0;
	const y0 = 0;
	const x1 = _svg.width;
	const y1 = _svg.height;
	const dx = 5;
	const py = setValue(nodePadding, nodeCount * 4);
	const dy = py ? py : 8;
	const id = (d) => d.index;
	const align = justify;
	const iterations = 5;
	let sort;
	let linkSort;
	computeNodeLinks(nodes, edges, id);
	computeNodeValues(nodes);
	computeNodeDepths(nodes);
	computeNodeHeights(nodes);
	computeNodeBreadths(
		nodes,
		x1,
		x0,
		dx,
		align,
		sort,
		py,
		dy,
		y1,
		y0,
		iterations,
		linkSort,
	);
	computeLinkBreadths(nodes);
	const linkGen = d3
		.linkHorizontal()
		.source((d) => [d.source.x1, d.source.y1])
		.target((d) => [d.target.x0, d.target.y0]);

	useEffect(() => {
		// set up group
		const canvas = d3
			.select(bipartiteFigure.current)
			.select("g.svgElement");
		const bipartite = canvas.append("g").attr("class", "bipartite");
		const link = bipartite
			.selectAll("paths")
			.data(edges)
			.enter()
			.append("g")
			.attr("class", "bipartite-edge");
		link.append("path");
		attrs(link.selectAll("path"), {
			class: "bipartite-edge-path",
			d: (d) => linkGen(d),
			fill: "none",
			"stroke-width": (d) => d.value,
			stroke: edgeColor,
		});
		const node = bipartite
			.selectAll(".node")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "bipartite-node")
			.attr("transform", (d) => translate(d.x0, d.y0));
		// add circles for nodes
		node.append("circle");
		attrs(node.selectAll("circle"), {
			class: "bipartite-node-circle",
			"stroke-width": nodeStrokeWidth,
			stroke: nodeStrokeColor,
			fill: nodeFillColor,
			r: nodeRadius,
		});
		node
			.append("text")
			.text((d) => d.name)
			.attr("font-family", fontFamily)
			.attr("fill", nodeTextColor)
			.attr("dy", -nodeRadius * 2)
			.attr("text-anchor", "middle");
	});
	return (
		<Base
			id={bipartiteFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
