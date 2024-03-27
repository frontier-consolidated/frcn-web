import { builtinModules } from "module";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
	{
		input: 'src/index.ts',
		output: {
			file: 'index.js',
			format: 'esm'
		},
		plugins: [typescript({ declaration: true, declarationDir: "types" })],
		external: ["rollup", "@rollup/plugin-node-resolve", "@rollup/plugin-json", "@rollup/plugin-commonjs", "./global.d.ts", ...builtinModules]
	},
	{
		input: 'src/server/index.ts',
		output: {
			file: 'files/index.js',
			format: 'esm'
		},
		plugins: [typescript(), nodeResolve({ preferBuiltins: true }), commonjs(), json()],
		external: ['ENV', 'HANDLER', ...builtinModules]
	},
	{
		input: 'src/server/env.ts',
		output: {
			file: 'files/env.js',
			format: 'esm'
		},
		plugins: [typescript(), nodeResolve(), commonjs(), json()],
		external: ['HANDLER', ...builtinModules]
	},
	{
		input: 'src/server/handler.ts',
		output: {
			file: 'files/handler.js',
			format: 'esm',
			inlineDynamicImports: true
		},
		plugins: [typescript(), nodeResolve(), commonjs(), json()],
		external: ['ENV', 'MANIFEST', 'SERVER', 'SHIMS', ...builtinModules]
	},
	{
		input: 'src/server/shims.ts',
		output: {
			file: 'files/shims.js',
			format: 'esm'
		},
		plugins: [typescript(), nodeResolve(), commonjs()],
		external: builtinModules
	},
	{
		input: "src/isr/index.ts",
		output: {
			file: "isr.js",
			format: "esm"
		},
		plugins: [typescript({ declaration: true, declarationDir: "types" }), nodeResolve(), commonjs()],
		external: [...builtinModules]
	}
];