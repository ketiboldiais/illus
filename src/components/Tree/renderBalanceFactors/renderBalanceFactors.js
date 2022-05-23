import { attrs } from "../../utils/attrs/attrs";
import { calculateBalanceFactor } from "../calculateBalanceFactor/calculateBalanceFactor";
export const renderBalanceFactors = (
	selection,
	data,
	radius,
	balanceFactorFontSize,
	balancedTextColor,
	imbalancedTextColor,
) => {
	const bfNums = selection
		.append("g")
		.attr("class", "tree-balance-factor-text");
	const bfNumText = bfNums
		.selectAll("text")
		.data(data)
		.enter()
		.filter((d) => !d.data.display)
		.filter((d) => !d.data.type)
		.append("text")
		.text((d) => calculateBalanceFactor(d));
	attrs(bfNumText, {
		class: (d) => {
			if (Math.abs(calculateBalanceFactor(d)) > 1) {
				return `balance-factor-text imbalanced`;
			} else {
				return `balance-factor-text balanced`;
			}
		},
		x: (d) => d.x,
		y: (d) => d.y,
		dy: -radius - radius / 2,
		"text-anchor": "middle",
		fill: (d) => {
			if (Math.abs(calculateBalanceFactor(d)) > 1) {
				return imbalancedTextColor;
			} else {
				return balancedTextColor;
			}
		},
		"font-size": balanceFactorFontSize,
	});
};
