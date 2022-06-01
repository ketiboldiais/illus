import "katex/dist/katex.min.css";
import { createRoot } from "react-dom/client";
import TeX from "@matejmazur/react-katex";

export const MathText = (
	selection,
	text = "katex",
	fontSize = 0.7,
	width = 1,
	height = 1,
	id = `rect`,
) => {
	const foreignObject = selection
		.append("foreignObject")
		.attr("width", width)
		.attr("x", 0)
		.attr("y", 0)
		.style("overflow", "visible")
		.attr("height", height);
	const span = foreignObject
		.append("xhtml:div")
		.attr("id", id)
		.style("font-size", `${fontSize}rem`)
		.style("padding", "0")
		.style("position", "fixed")
		.attr("xmlns", "http://www.w3.org/1999/xhtml")
		.html(function () {
			const container = document.getElementById(id);
			const root = createRoot(container);
			return root.render(<TeX math={`${text}`} />);
		});
};
