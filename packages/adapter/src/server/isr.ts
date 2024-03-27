import fs from "fs";
import { pipeline as pipe } from "stream/promises";
import zlib from "zlib";

import { isr } from "MANIFEST";

const isrCache = new Map<string, boolean>()

export function is_isr_rendered(pathname: string) {
    return isr.paths.has(pathname);
}

export function is_isr_valid(pathname: string) {
    return isrCache.has(pathname) && isrCache.get(pathname)
}

export function is_prerender_valid(pathname: string) {
    if (!is_isr_rendered(pathname)) return true;
    return is_isr_valid(pathname);
}

export function set_isr_route_valid(pathname: string) {
    isrCache.set(pathname, true)
}

export function invalidate_isr_route(pathname: string) {
    console.log("Invalidate route", pathname)
    isrCache.set(pathname, false)
}

export async function compress_file(file: string, format: "gz" | "br" = "gz") {
	const compress =
		format == 'br'
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
