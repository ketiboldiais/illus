import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default [
	// default rollup configuration
	{
		// entry point for application
		input: "./src/index.js",

		// where the output files go
		output: [
			{
				file: "dist/index.js", // commonjs output
				format: "cjs",
			},
			{
				file: "dist/index.es.js", // esmodules output
				format: "es",
				exports: "named", // Illus uses named exports
			},
		],
		// rollup plugins
		plugins: [
			postcss({
				plugins: [],
				minimize: true,
			}),
			babel({
				exclude: "node_modules/**",
				presets: ["@babel/preset-react"],
			}),
			external(),
			nodeResolve(),
			terser(),
		],
	},
];
