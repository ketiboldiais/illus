# rollup
- The bundler used by Illus.

# @rollup/plugin-node-resolve
- Resolves third party modules/dependencies.
- Illus uses the following third party modules as dependencies:
	+ D3 
	+ react-viz
- `plugin-node-resolve` resolves these dependencies and adds them to the source code.

# @rollup/plugin-babel
- Allows Illus to integrate with the existing Babel config.

# rollup-plugin-peer-deps-external
- Ensures that Illus excludes any peer dependencies from the bundle.
- `react` and `react-dom` are peer dependencies.
- This plugin ensures that these peer dependencies are not included in the bundle.




 
