import prettier from "prettier/standalone";
import prettierBabel from "prettier/parser-babel";
import previewTheme from "./previewTheme";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	docs: {
		theme: previewTheme,
		transformSource: (input) =>
			prettier.format(input, {
				parser: "babel",
				plugins: [prettierBabel],
			}),
	},
};
