/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import type { Adapter, RouteDefinition } from "@sveltejs/kit";
import { rollup } from "rollup";

interface AdapterOptions {
    out?: string;
    precompress?: boolean;
	envPrefix?: string;
	main?: {
		input: string;
		tsconfig?: string;
	};
}

export interface AdapterPageConfig {
	isr?: boolean;
}

export default function (opts: AdapterOptions = {}) {
    const { out = "build", precompress = true, envPrefix = "", main } = opts;

    return {
        name: "@frcn/adapter",

        async adapt(builder) {
            const tmp = builder.getBuildDirectory("adapter-frcn");

            builder.rimraf(out);
            builder.rimraf(tmp);
			builder.mkdirp(tmp);
			
			const files = fileURLToPath(new URL("./files", import.meta.url).href);

            builder.log.minor("Copying assets");
            builder.writeClient(`${out}/client${builder.config.kit.paths.base}`);
			builder.writePrerendered(`${out}/prerendered${builder.config.kit.paths.base}`);

			if (precompress) {
				builder.log.minor("Compressing assets");
				await Promise.all([
					builder.compress(`${out}/client`),
					builder.compress(`${out}/prerendered`)
				]);
			}

			builder.log.minor("Building server");

			const isrRoutes = new Map<RouteDefinition, boolean>();

			for (const route of builder.routes) {
				const config = { ...route.config } as AdapterPageConfig;

				if (config.isr) {
					if (route.prerender !== "auto") {
						builder.log.error(`Isr route ${getPathname(route)} must export prerender="auto"`);
					}
					isrRoutes.set(route, config.isr);
				}
			}

			builder.writeServer(tmp);

			const isrPaths = Array.from(isrRoutes.keys()).map(r => getPathname(r));

			fs.writeFileSync(
				`${tmp}/manifest.js`,
				[
					`export const manifest = ${builder.generateManifest({ relativePath: "./" })};`,
					`export const prerendered = new Set(${JSON.stringify(builder.prerendered.paths)});`,
					`export const isr = new Set(${JSON.stringify(isrPaths)});`,
					`export const base = ${JSON.stringify(builder.config.kit.paths.base)};`
				].join("\n\n")
			);

			const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

			// we bundle the Vite output so that deployments only need
			// their production dependencies. Anything in devDependencies
			// will get included in the bundled code
			const serverBundle = await rollup({
				input: {
					index: `${tmp}/index.js`,
					manifest: `${tmp}/manifest.js`,
				},
				external: [
					// dependencies could have deep exports, so we need a regex
					...Object.keys(pkg.dependencies || {}).map((d) => new RegExp(`^${d}(\\/.*)?$`))
				],
				plugins: [
					nodeResolve({
						preferBuiltins: true,
						exportConditions: ["node"]
					}),
					(commonjs as any)({ strictRequires: true }),
					(json as any)()
				]
			});

			await serverBundle.write({
				dir: `${out}/server`,
				format: "esm",
				sourcemap: true,
				chunkFileNames: "chunks/[name]-[hash].js"
			});

			if (main) {
				const tsconfigPath = main.tsconfig ?? "tsconfig.json";

				const mainBundle = await rollup({
					input: {
						main: path.join(process.cwd(), main.input)
					},
					external: [
						...Object.keys(pkg.dependencies || {}).map((d) => new RegExp(`^${d}(\\/.*)?$`)),
					],
					plugins: [
						...(main.input.endsWith(".ts") ? [typescript({ project: tsconfigPath, skipLibCheck: true })] : []),
						nodeResolve({
							preferBuiltins: true,
							exportConditions: ["node"]
						}),
						(commonjs as any)({ strictRequires: true }),
						(json as any)()
					]
				});

				await mainBundle.write({
					dir: `${out}/main`,
					format: "esm",
					sourcemap: true,
					chunkFileNames: "chunks/[name]-[hash].js"
				});
			}

			builder.copy(files, out, {
				replace: {
					ENV: "./env.js",
					HANDLER: "./handler.js",
					MANIFEST: "./server/manifest.js",
					SERVER: "./server/index.js",
					SHIMS: "./shims.js",
					ENV_PREFIX: JSON.stringify(envPrefix),
					MAIN_ENTRYPOINT: main ? "./main/main.js" : "false"
				}
			});
        },

        supports: {
			read: () => true
		}
    } satisfies Adapter;
}

function getPathname(route: RouteDefinition) {
	let i = 1;

	return route.segments
		.map((segment) => {
			if (!segment.dynamic) {
				return "/" + segment.content;
			}

			const parts = segment.content.split(/\[(.+?)\](?!\])/);
			let result = "";

			if (
				parts.length === 3 &&
				!parts[0] &&
				!parts[2] &&
				(parts[1].startsWith("...") || parts[1][0] === "[")
			) {
				// Special case: segment is a single optional or rest parameter.
				// In that case we don't prepend a slash (also see comment in pattern_to_src).
				result = `$${i++}`;
			} else {
				result =
					"/" +
					parts
						.map((content, j) => {
							if (j % 2) {
								return `$${i++}`;
							} else {
								return content;
							}
						})
						.join("");
			}

			return result;
		})
		.join("");
}