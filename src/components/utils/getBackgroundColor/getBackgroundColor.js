export const getBackgroundColor = (ref) => {
	return window
		.getComputedStyle(ref.current.children[0])
		.getPropertyValue("background-color");
};
