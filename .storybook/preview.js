import prettier from "prettier/standalone";
import prettierBabel from "prettier/parser-babel";
import theme from "./managerTheme";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	docs: {
		theme: theme,
		transformSource: (input) =>
			prettier.format(input, {
				parser: "babel",
				plugins: [prettierBabel],
			}),
	},
};
