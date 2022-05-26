import { insertArrowDefinitions } from "../../utils/insertArrowDefinitions/insertArrowDefinitions";

const x_arrow_left = {
	id: "xArrowLeft",
	orient: "0",
};

const x_arrow_right = {
	id: "xArrowRight",
	orient: "180",
};

const y_arrow_top = {
	id: "yArrowTop",
	orient: "-90",
};

const y_arrow_bottom = {
	id: "yArrowBottom",
	orient: "90",
};

const defs = [x_arrow_left, x_arrow_right, y_arrow_top, y_arrow_bottom];

export const appendArrowDefinitions = (selection, color = "black") => {
	for (let i = 0; i < defs.length; i++) {
		insertArrowDefinitions(
			selection,
			defs[i].id,
			8,
			0,
			6,
			6,
			defs[i].orient,
			color,
		);
	}
};
