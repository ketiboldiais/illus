import { create } from "@storybook/theming";

const theme = create({
	base: "light", // this will inherit the base properties of Storybooks'light theme

	// Base color
	colorSecondary: "#dd0000", // Chateau Green

	// UI
	appBg: "#fffce8",
	appContentBg: "#FFFFFF",
	appBorderColor: "rgba(0,0,0,.1)",
	appBorderRadius: 4,

	// Typography
	fontBase: '"Old Standard TT", sans-serif',
	fontCode: "Fira Mono",

	// Text colors
	textColor: "#333333",
	textInverseColor: "#FFFFFF",
	textMutedColor: "#cbcbcb",

	// Toolbar default and active colors
	barTextColor: "#cacaca",
	barSelectedColor: "#be2600",
	barBg: "#FFFFFF",

	// Form colors
	inputBg: "#FFFFFF",
	inputBorder: "rgba(0,0,0,.3)",
	inputTextColor: "#e4e4e4",
	inputBorderRadius: 4,

	// Brand assets
	brandTitle: "Illus",
	brandUrl: "https://newline.co",
});

export default theme;
