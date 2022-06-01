import React, { useRef, useEffect } from "react";
import { isObjectLiteral } from "../utils/isObjectLiteral/isObjectLiteral";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { translate } from "../utils/translate/translate";
import { insertArrowDefinitions } from "../utils/insertArrowDefinitions/insertArrowDefinitions";

const formatData = (arr = []) => {
	let data = [];
	for (let i = 0; i < arr.length; i++) {
		if (isObjectLiteral(arr[i])) {
			data.push(arr[i]);
		} else {
			let node = { val: arr[i] };
			data.push(node);
		}
	}
	return data;
};

export const DoublyLinkedList = ({
	data = [],
	fontFamily="system-ui",
	listName = "root",
	width = 240,
	height = 40,
	containerWidth,
	containerHeight,
	fontSize=8,
	fontColor="#000000",

	dataFieldFontSize=fontSize,
	dataFieldColor="#ffffff",
	dataFieldStrokeColor=fontColor,
	dataFieldTextColor=fontColor,

	nextFieldColor=dataFieldColor,
	nextFieldStrokeColor=fontColor,

	prevFieldColor=dataFieldColor,
	prevFieldStrokeColor=fontColor,

	rootFontSize=fontSize,
	rootTextColor=fontColor,

	antFontSize=10,
	antFontColor=fontColor,

	linkColor=fontColor,

	nextPointerColor=linkColor,
	nextCircleColor=linkColor,
	prevPointerColor=linkColor,
	prevCircleColor=linkColor,
	
	indexFontSize=fontSize-2,
	indexFontColor=fontColor,
	margins = [15, 30, 10, 30],
	isIndexed = true,
}) => {
	const DoublyLinkedListFigure = useRef();
	const _svg = svg(width, height, margins);
	const _data = formatData(data);
	const nodeCount = _data.length;
	const scale = d3
		.scaleBand()
		.domain(d3.range(nodeCount))
		.rangeRound([0, _svg.width])
		.paddingInner(0.5);
	const nodeWidth = scale.bandwidth();
	const nodeHeight = scale.bandwidth() / 2;

	useEffect(() => {
		const canvas = d3
			.select(DoublyLinkedListFigure.current)
			.select("g.svgElement");
		insertArrowDefinitions(
			canvas,
			"doubly-linked-list-next-pointer",
			8,
			0,
			4,
			4,
			"auto",
			nextPointerColor,
		);
		insertArrowDefinitions(
			canvas,
			"doubly-linked-list-prev-pointer",
			8,
			0,
			4,
			4,
			"auto",
			prevPointerColor,
		);
		const nodeGroup = canvas
			.selectAll("nodeGroups")
			.data(_data)
			.enter()
			.append("g")
			.attr("class", "doubly-linked-list-node")
			.attr("transform", (d, i) => translate(scale(i), 0))
			.attr("y", 0);
		const dataField = nodeGroup
			.append("g")
			.attr("class", "node-data-field")
			.attr("transform", translate(scale.bandwidth() / 3, 0));
		const dataFieldRectangle = dataField
			.append("rect")
			.attr("class", "node-data-field-rectangle")
			.attr("width", nodeWidth)
			.attr("height", nodeHeight)
			.attr("stroke", dataFieldStrokeColor)
			.attr("fill", dataFieldColor);
		const dataFieldText = dataField
			.append("text")
			.attr("class", "node-data-field-text")
			.attr('font-family', fontFamily)
			.attr("fill", dataFieldTextColor)
			.attr("text-anchor", "middle")
			.attr("font-size", dataFieldFontSize)
			.attr("x", nodeWidth / 3)
			.attr("y", nodeHeight / 2)
			.attr("dy", "0.35em")
			.text((d) => d.val);
		if (isIndexed) {
			dataField
				.append("text")
				.attr("class", "node-index-text")
				.attr('font-family', fontFamily)
				.attr("text-anchor", "middle")
				.attr("fill", indexFontColor)
				.attr("font-size", indexFontSize)
				.attr("x", nodeWidth / 3)
				.attr("y", nodeHeight + 10)
				.text((d, i) => i + 1);
		}
		const nextField = nodeGroup
			.append("g")
			.attr("class", "node-next-field")
			.attr("transform", translate(scale.bandwidth(), 0));
		const nextFieldRectangle = nextField
			.append("rect")
			.attr("class", "node-next-field-rectangle")
			.attr("stroke", nextFieldStrokeColor)
			.attr("fill", nextFieldColor)
			.attr("width", nodeWidth / 3)
			.attr("height", nodeHeight);
		const prevField = nodeGroup
			.append("g")
			.attr("class", "node-prev-field");
		const prevFieldRectangle = prevField
			.append("rect")
			.attr("stroke", prevFieldStrokeColor)
			.attr("fill", prevFieldColor)
			.attr("width", nodeWidth / 3)
			.attr("height", nodeHeight);
		const nextPointerArrow = nodeGroup
			.append("line")
			.attr("class", "node-next-pointer")
			.attr("stroke", nextPointerColor)
			.attr("x1", nodeWidth + nodeWidth / 8)
			.attr("y1", nodeHeight / 4)
			.attr("x2", nodeWidth + scale.bandwidth())
			.attr("y2", nodeHeight / 4)
			.attr("marker-end", "url(#doubly-linked-list-next-pointer)")
		const nextPointerCircle = nodeGroup
			.append("circle")
			.attr("class", "node-next-pointer-circle")
			.attr("fill", nextCircleColor)
			.attr("r", 1.5)
			.attr("cx", nodeWidth + nodeWidth / 6)
			.attr("cy", nodeHeight / 4);
		const prevPointerArrow = nodeGroup
			.append("line")
			.attr("class", "node-prev-pointer")
			.attr("stroke", prevPointerColor)
			.attr("x1", -nodeWidth + (scale.bandwidth() + scale.bandwidth() / 5))
			.attr("y1", nodeHeight / 1.5)
			.attr("x2", -nodeWidth + nodeWidth / 3)
			.attr("y2", nodeHeight / 1.5)
			.attr("marker-end", "url(#doubly-linked-list-prev-pointer)");
		const prevPointerCircle = nodeGroup
			.append("circle")
			.attr("class", "node-prev-pointer-circle")
			.attr("fill", prevCircleColor)
			.attr("r", 1.5)
			.attr("cx", -nodeWidth + (scale.bandwidth() + scale.bandwidth() / 6))
			.attr("cy", nodeHeight / 1.5);
		const annotations = dataField
			.filter((d) => d.ant)
			.append("text")
			.attr("class", "node-annotation-text")
			.attr("text-anchor", "middle")
			.attr("x", -scale.bandwidth() / 8)
			.attr("y", -4)
			.text((d) => d.ant)
			.attr("fill", "black");
		const rootPointer = canvas
			.append("g")
			.attr("class", "root-pointer")
			.attr(
				"transform",
				translate(-scale.bandwidth() / 2, -scale.bandwidth() / 4),
			);
		const rootPointerText = rootPointer
			.append("text")
			.attr('font-family', fontFamily)
			.attr("class", "root-pointer-text")
			.attr("text-anchor", "middle")
			.attr("font-size", rootFontSize)
			.attr('fill', rootTextColor)
			.text(listName);
		const rootPointerLink = rootPointer
			.append("path")
			.attr("class", "root-pointer-link")
			.attr("fill", "none")
			.attr("stroke", linkColor)
			.attr("d", () => {
				const m1 = 0;
				const m2 = 2;

				const L1 = 0;
				const L2 = scale.bandwidth() / 3;

				const l1 = scale.bandwidth() / 2;
				const l2 = 0;
				return `M ${m1},${m2} L ${L1},${L2} l ${l1},${l2}`;
			})
			.attr("marker-end", "url(#doubly-linked-list-next-pointer)");

		const annotation = nextField
			.filter((d) => d.ant)
			.append("g")
			.attr("class", "linked-list-annotation")
			.append("text")
			.attr("text-anchor", "middle")
			.attr("font-size", antFontSize)
			.attr('fill', antFontColor)
			.attr("x", -scale.bandwidth() / 4)
			.attr("y", -margins[0]/2)
			.text((d) => d.ant);
	});
	return (
		<Base
			id={DoublyLinkedListFigure}
			width={width}
			height={height}
			containerWidth={containerWidth}
			containerHeight={containerHeight}
			margins={margins}
		/>
	);
};
