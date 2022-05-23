import * as d3 from "d3";

export function wrap(text, width) {
  text.each(function () {
    let text = d3.select(this);
    let words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
		let lineNumber = 1;
    let lineHeight = 1.1; // ems
    let x = text.attr("x");
    let y = text.attr("y");
    let dy = 0; //parseFloat(text.attr("dy"))
    let tspan = text
      .text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
