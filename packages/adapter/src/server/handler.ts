/* eslint-disable import/no-unresolved */
import 'SHIMS';
import fs from "node:fs";
import type { IncomingHttpHeaders } from 'node:http';
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse as polka_url_parser } from '@polka/url';
import { getRequest, setResponse, createReadableStream } from "@sveltejs/kit/node";
import { env } from "ENV";
import { manifest, prerendered, base } from "MANIFEST";
import type { Middleware } from 'polka';
import { Server } from "SERVER";
import sirv from "sirv";

import { is_prerender_valid, invalidate_isr_route } from './isr';

/* global ENV_PREFIX */

const server = new Server(manifest);

const origin = env('ORIGIN', undefined);
const xff_depth = parseInt(env('XFF_DEPTH', '1'));
const address_header = env('ADDRESS_HEADER', '').toLowerCase();
const protocol_header = env('PROTOCOL_HEADER', '').toLowerCase();
const host_header = env('HOST_HEADER', 'host').toLowerCase();
const port_header = env('PORT_HEADER', '').toLowerCase();
const body_size_limit = Number(env('BODY_SIZE_LIMIT', '524288'));

if (isNaN(body_size_limit)) {
	throw new Error(
		`Invalid BODY_SIZE_LIMIT: '${env('BODY_SIZE_LIMIT')}'. Please provide a numeric value.`
	);
}

const dir = path.dirname(fileURLToPath(import.meta.url));

const asset_dir = `${dir}/client${base}`;

await server.init({
	env: process.env as Record<string, string>,
	read: (file) => createReadableStream(`${asset_dir}/${file}`)
});

function serve(path: string, client: boolean = false): Middleware | null {
    if (!fs.existsSync(path)) return null;

	return sirv(path, {
        etag: true,
        gzip: true,
        brotli: true,
        setHeaders: client
            ? ((res, pathname) => {
                // only apply to build directory, not e.g. version.json
                if (pathname.startsWith(`/${manifest.appPath}/immutable/`) && res.statusCode === 200) {
                    res.setHeader('cache-control', 'public,max-age=31536000,immutable');
                }
            })
            : undefined
    })
}

// required because the static file server ignores trailing slashes
function serve_prerendered(): Middleware {
	const handler = serve(path.join(dir, "prerendered"));

	return (req, res, next) => {
		// eslint-disable-next-line prefer-const
		let { pathname, search, query } = polka_url_parser(req);

		try {
			pathname = decodeURIComponent(pathname);
		} catch {
			// ignore invalid URI
		}

		if (!is_prerender_valid(pathname)) {
			next();
			return;
		}

		if (handler && prerendered.has(pathname)) {
			return handler(req, res, next);
		}

		// remove or add trailing slash as appropriate
		let location = pathname.at(-1) === '/' ? pathname.slice(0, -1) : pathname + '/';
		if (prerendered.has(location)) {
			if (query) location += search;
			res.writeHead(308, { location }).end();
		} else {
			next();
		}
	};
}

const ssr: Middleware = async (req, res) => {
	/** @type {Request} */
	let request: Request;

	try {
		request = await getRequest({
			base: origin || get_origin(req.headers),
			request: req,
			bodySizeLimit: body_size_limit
		});
	} catch {
		res.statusCode = 400;
		res.end('Bad Request');
		return;
	}

	setResponse(
		res,
		await server.respond(request, {
			platform: { req },
			getClientAddress: () => {
				if (address_header) {
					if (!(address_header in req.headers)) {
						throw new Error(
							`Address header was specified with ${
								ENV_PREFIX + 'ADDRESS_HEADER'
							}=${address_header} but is absent from request`
						);
					}

					const value = /** @type {string} */ (req.headers[address_header]) || '';

					if (address_header === 'x-forwarded-for') {
						const addresses = (value as string).split(',');

						if (xff_depth < 1) {
							throw new Error(`${ENV_PREFIX + 'XFF_DEPTH'} must be a positive integer`);
						}

						if (xff_depth > addresses.length) {
							throw new Error(
								`${ENV_PREFIX + 'XFF_DEPTH'} is ${xff_depth}, but only found ${
									addresses.length
								} addresses`
							);
						}
						return addresses[addresses.length - xff_depth].trim();
					}

					return value;
				}

				return (
					req.connection?.remoteAddress ||
					// @ts-expect-error not typed
					req.connection?.socket?.remoteAddress ||
					req.socket?.remoteAddress ||
					// @ts-expect-error not typed
					req.info?.remoteAddress
				);
			}
		})
	);
};

function sequence(handlers: Middleware[]): Middleware {
	return (req, res, next) => {
		function handle(i: number): ReturnType<Middleware> {
			if (i < handlers.length) {
				return handlers[i](req, res, () => handle(i + 1));
			} else {
				return next();
			}
		}

		return handle(0);
	};
}

function get_origin(headers: IncomingHttpHeaders) {
	const protocol = (protocol_header && headers[protocol_header]) || 'https';
	const host = headers[host_header];
	const port = port_header && headers[port_header];
	if (port) {
		return `${protocol}://${host}:${port}`;
	} else {
		return `${protocol}://${host}`;
	}
}

export { invalidate_isr_route };

export const handler = sequence(
	[
		serve(path.join(dir, 'client'), true),
		serve(path.join(dir, 'static')),
		serve_prerendered(),
		ssr
	].filter((m): m is Middleware => Boolean(m))
);