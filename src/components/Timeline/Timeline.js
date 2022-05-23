import React, { useRef, useEffect } from "react";
import { svg } from "../utils/svg/svg";
import { Base } from "../base/Base";
import * as d3 from "d3";
import { translate } from "../utils/translate/translate";

export const Timeline = ({
  data = [],
  className = "",
  width = 600,
  height = 400,
  containerWidth = 100,
  containerHeight = 100,
  margins = [0, 50, 20, 50],
  yMax = 30,
  tickCount = 5,
  circleRadius = 3,
  strokeColor = "black",
  startTime = d3.min(data, (d) => d.time),
  endTime = d3.max(data, (d) => d.time),
  circleColor = "white",
  circleStrokeColor = "black",
  textColor = "black",
  axisPadding = 0,
  fontSize = "0.7rem",
}) => {
  const TimelineFigure = useRef();

  const _svg = svg(width, height, margins);

  const yPosition = (d) => d.y;

  const xScale = d3
    .scaleLinear()
    .domain([startTime, endTime])
    .range([0, _svg.width])

  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([_svg.height, 0]);

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(tickCount)
    .tickFormat(d3.format("d"))
		.tickSizeOuter(0)

  useEffect(() => {
    const canvas = d3
      .select(TimelineFigure.current)
      .select("g.svgElement");
    const timeline = canvas
      .append("g")
      .attr("class", `timeline${className ? ` ${className}` : ""}`);
    const eventGroups = timeline
      .selectAll("events")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "timeline-event")
      .attr("transform", (d) => translate(xScale(d.time), yScale(d.y)));
    const lineToAxis = eventGroups
      .append("line")
      .attr("stroke", strokeColor)
      .attr("x1", 0)
      .attr("y2", 0)
      .attr("x2", 0)
      .attr("y2", (d) => _svg.height - yScale(yPosition(d)));

    const eventCircles = eventGroups
      .append("circle")
      .attr("fill", circleColor)
      .attr("stroke", circleStrokeColor)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", circleRadius);

    const render_x_axis = timeline
      .append("g")
      .attr("transform", translate(0, _svg.height - axisPadding));

    const renderedAxis = render_x_axis.call(xAxis);

    const circleLabels = eventGroups
      .append("text")
      .attr("fill", textColor)
      .attr("text-anchor", (d) => (d.anchor ? d.anchor : "start"))
      .attr("font-size", fontSize)
      .attr("dy", -circleRadius - circleRadius / 2)
      .text((d) => d.event);
  });
  return (
    <Base
      id={TimelineFigure}
      width={width}
      height={height}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
      margins={margins}
    />
  );
};
