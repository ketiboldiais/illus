export const calculateBalanceFactor = (d) => {
	let left_child_height;
	let right_child_height;
	if (undefined != d.children) {
		let left_child = d.children[0];
		let right_child = d.children[1];
		left_child_height =
			undefined != left_child.data.display &&
			left_child.data.display === "none"
				? 0
				: left_child.height + 1;
		right_child_height =
			undefined != right_child.data.display &&
			right_child.data.display === "none"
				? 0
				: right_child.height + 1;
	} else {
		left_child_height = d.height + 1;
		right_child_height = d.height + 1;
	}
	const balance_factor = left_child_height - right_child_height;
	return balance_factor;
};
