module.exports = {
	stories: [
		"../src/**/Intro.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-postcss",
		"@storybook/theming",
		"storybook-css-modules-preset",
	],
	framework: "@storybook/react",
};
