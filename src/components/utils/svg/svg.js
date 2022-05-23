export const svg = (_width, _height, _margins) => {
	const marginTop = _margins[0];
	const marginRight = _margins[1];
	const marginBottom = _margins[2];
	const marginLeft = _margins[3];
	const svgWidth = _width - marginLeft - marginRight;
	const svgHeight = _height - marginTop - marginBottom;
	return {
		width: svgWidth,
		height: svgHeight,
	};
};
