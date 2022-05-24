import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default [
	// default rollup configuration
	{
		onwarn: function (warning, warn) {
			if (warning.code === "CIRCULAR_DEPENDENCY") return;
			warn(warning);
		},
		// entry point for application
		input: "./src/index.js",

		// where the output files go
		output: [
			{
				file: packageJson.main, // commonjs output
				format: "cjs",
				sourcemap: false,
			},
			{
				file: packageJson.module, // esmodules output
				format: "es",
				exports: "named", // Illus uses named exports
				sourcemap: false,
			},
		],
		// rollup plugins
		plugins: [
			peerDepsExternal(),
			resolve(),
			postcss({
				plugins: [],
				minimize: true,
			}),
			babel({
				exclude: "node_modules/**",
				presets: ["@babel/preset-react"],
			}),
			terser(),
		],
	},
];
