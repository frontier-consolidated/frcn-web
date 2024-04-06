import fs from "fs";
import path from "path";
import { pipeline as pipe } from "stream/promises";
import { fileURLToPath } from "url";
import zlib from "zlib";

import type { Server } from "@sveltejs/kit";
import * as devalue from "devalue";
import { base, isr } from "MANIFEST";

import { Queue, queue } from "./queue";

const concurrency = 1;

const prerenderedDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "prerendered");
if (!fs.existsSync(prerenderedDir)) {
	mkdirp(prerenderedDir);
}

let server: Server;
let assetsDir: string;
const isrRendered = new Map<string, boolean>();
const invalidateIsrFiles = new Map<string, boolean>();

export function configure_isr(opts: { server: Server, asset_dir: string }) {
	server = opts.server;
	assetsDir = opts.asset_dir;
}

export function is_isr_route(pathname: string) {
    return isr.has(pathname);
}

export function invalidate_isr_route(pathname: string) {
	if (!is_isr_route(pathname)) {
		throw new Error("Tried to invalidate non-isr route: " + pathname);
	}

	console.log("Invalidate route", pathname, "- rerendering...");
	setImmediate(async () => {
		const q = queue(concurrency);
		const saved = new Map<string, string>();
		q.add(() => render_isr_route(pathname, q, saved));
		await q.done();
	});
}

async function compress_file(file: string, format: "gz" | "br" = "gz") {
	const compress =
		format == "br"
			? zlib.createBrotliCompress({
					params: {
						[zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
						[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
						[zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(file).size
					}
				})
			: zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });

	const source = fs.createReadStream(file);
	const destination = fs.createWriteStream(`${file}.${format}`);

	await pipe(source, compress, destination);
}

function mkdirp(dir: string) {
	try {
		fs.mkdirSync(dir, { recursive: true });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		if (e.code === "EEXIST") {
			if (!fs.statSync(dir).isDirectory()) {
				throw new Error(`Cannot create directory ${dir}, a file already exists at this position`);
			}
			return;
		}
		throw e;
	}
}

const internal = new URL("isr-internal://");
function resolve(base: string, path: string) {
	// special case
	if (path[0] === "/" && path[1] === "/") return path;

	let url = new URL(base, internal);
	url = new URL(path, url);

	return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}

function is_root_relative(path: string) {
	return path[0] === "/" && path[1] !== "/";
}

function decode_uri(uri: string) {
	try {
		return decodeURI(uri);
	} catch (e) {
		if (e instanceof Error) {
			e.message = `Failed to decode URI: ${uri}\n` + e.message;
		}
		throw e;
	}
}

const escape_html_attr_dict = {
	"&": "&amp;",
	"\"": "&quot;"
} as Record<string, string>;

const escape_html_attr_regex = new RegExp(
	// special characters
	`[${Object.keys(escape_html_attr_dict).join("")}]|` +
		// high surrogate without paired low surrogate
		"[\\ud800-\\udbff](?![\\udc00-\\udfff])|" +
		// a valid surrogate pair, the only match with 2 code units
		// we match it so that we can match unpaired low surrogates in the same pass
		// TODO: use lookbehind assertions once they are widely supported: (?<![\ud800-udbff])[\udc00-\udfff]
		"[\\ud800-\\udbff][\\udc00-\\udfff]|" +
		// unpaired low surrogate (see previous match)
		"[\\udc00-\\udfff]",
	"g"
);

function escape_html_attr(str: string) {
	const escaped_str = str.replace(escape_html_attr_regex, (match) => {
		if (match.length === 2) {
			// valid surrogate pair
			return match;
		}

		return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
	});

	return `"${escaped_str}"`;
}

function output_filename(path: string, is_html: boolean) {
	const file = path.slice(base.length + 1) || "index.html";

	if (is_html && !file.endsWith(".html")) {
		return file + (file.endsWith("/") ? "index.html" : ".html");
	}

	return file;
}

const REDIRECT = 3;

async function save_isr_render(response: Response, body: Buffer, pathname: string, q: Queue, saved: Map<string, string>) {
	const encoded = encodeURI(pathname);
	const response_type = Math.floor(response.status / 100);

	const headers = Object.fromEntries(response.headers);

	const type = headers["content-type"];
	const is_html = response_type === REDIRECT || type === "text/html";

	const file = output_filename(pathname, is_html);
	const dest = path.join(prerenderedDir, file);
	const dir = path.dirname(dest);

	if (response_type === REDIRECT) {
		const location = headers["location"];

		if (location) {
			const resolved = resolve(encoded, location);
			if (is_root_relative(resolved)) {
				q.add(() => render_isr_route(decode_uri(resolved), q, saved));
			}

			if (!headers["x-sveltekit-normalize"]) {
				mkdirp(dir);

				fs.writeFileSync(
					dest,
					`<script>location.href=${devalue.uneval(
						location
					)};</script><meta http-equiv="refresh" content=${escape_html_attr(
						`0;url=${location}`
					)}>`
				);
			}
		}

		return;
	}

	if (response.status === 200) {
		mkdirp(dir);
	
		fs.writeFileSync(dest, body);
		await Promise.all([compress_file(dest, "gz"), compress_file(dest, "br")]);
		
		console.log(`Successfully rendered isr route '${pathname}' to ${dest}`);
	}

	saved.set(file, dest);
}

export async function render_isr_route(pathname: string, q: Queue, saved: Map<string, string>) {
	const dependencies = new Map();

	const response = await server.respond(new Request("http://isr" + pathname), {
		getClientAddress() {
			throw new Error("Cannot read clientAddress during prerendering");
		},
		// @ts-expect-error not in public type
		prerendering: {
			dependencies
		},
		// @ts-expect-error not in public type
		read: (file) => {
			// stuff we just wrote
			const filepath = saved.get(file);
			if (filepath) return fs.readFileSync(filepath);

			// stuff in `static`
			return fs.readFileSync(path.join(assetsDir, file));
		}
	});

	const body = Buffer.from(await response.arrayBuffer());

	await save_isr_render(response, body, pathname, q, saved);

	for (const [dependency_path, result] of dependencies) {
		const encoded_dependency_path = new URL(dependency_path, "http://localhost").pathname;
		const decoded_dependency_path = decode_uri(encoded_dependency_path);

		const body = result.body ?? new Uint8Array(await result.response.arrayBuffer());

		await save_isr_render(result.response, body, decoded_dependency_path, q, saved);
	}

	// avoid triggering `filterSerializeResponseHeaders` guard
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const headers = Object.fromEntries(response.headers);

	isrRendered.set(pathname, true);
	invalidateIsrFiles.set(pathname, true);
}

export async function render_isr_routes() {
	const pathnames = Array.from(isr.values());
	if (pathnames.length === 0) return;

	const q = queue(concurrency);
	const saved = new Map<string, string>();

	function enqueue(pathname: string) {
		return q.add(() => render_isr_route(pathname, q, saved));
	}

	console.log("Initial rendering isr routes...");
	for (const pathname of pathnames) {
		enqueue(base + pathname);
	}

	await q.done();
	console.log("Isr routes rendered!");
}