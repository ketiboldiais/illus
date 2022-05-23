export const attrs = (selection, attributesObject = {}) => {
	return Object.entries(attributesObject).forEach(([prop, val]) =>
		selection.attr(prop, val),
	);
};
