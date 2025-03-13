import type { RequestEvent } from "@sveltejs/kit";
import { parse, serialize, type SerializeOptions } from "cookie";
import * as iron from "iron-webcrypto";

import { database } from "../database.server";
import { logger } from "../utils/logger";

const seal_version = 1;
const fourteen_days_in_seconds = 14 * 24 * 3600;

type Secret = string | Record<string, string>;
type CookieOptions = { name: string } & SerializeOptions;

async function seal(data: any, secret: Secret, ttl: number = fourteen_days_in_seconds) {
	const secrets = typeof secret === "string" ? { 1: secret } : secret;

	const latest_secret_id = Math.max(...Object.keys(secrets).map(Number));
	const seal_secret = {
		id: latest_secret_id.toString(),
		secret: secrets[latest_secret_id]
	};

	const sealed = await iron.seal(crypto, data, seal_secret, {
		...iron.defaults,
		ttl: ttl * 1000
	});

	return `${sealed}~${seal_version}`;
}

async function unseal<T>(
	sealed: string,
	secret: Secret,
	ttl: number = fourteen_days_in_seconds
): Promise<T | null> {
	const secrets = typeof secret === "string" ? { 1: secret } : secret;

	const [sealed_data, seal_version_string] = sealed.split("~");
	const sealed_version = seal_version_string ? parseInt(seal_version_string, 10) : null;

	// For future use
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	sealed_version;

	try {
		const data = await iron.unseal(crypto, sealed_data, secrets, {
			...iron.defaults,
			ttl: ttl * 1000
		});

		return (data as T) ?? null;
	} catch (err) {
		if (
			err instanceof Error &&
			/^(Expired seal|Bad hmac value|Cannot find password|Incorrect number of sealed components)/.test(
				err.message
			)
		) {
			// if seal expired or
			// if seal is not valid (encrypted using a different password, when passwords are badly rotated) or
			// if we can't find back the password in the seal
			// then we just start a new session over
			return null;
		}

		throw err;
	}
}

function generate_key() {
	const bytes = iron.randomBits(crypto, 24 * 8);
	const buffer = Buffer.from(bytes);

	return buffer.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export class AppSessionImpl {
	public user: number | null = null;

	private key: string = "*";
	private event: RequestEvent;

	private secret: Secret;
	private ttl: number;
	private cookie_options: CookieOptions;

	private data: any = {};

	constructor(
		event: RequestEvent,
		options: { secret: Secret; ttl?: number; cookie: CookieOptions }
	) {
		if (event instanceof Request) {
			event.cookies = {
				getAll(opts) {
					const header = event.headers.get("cookie");
					return header
						? Object.entries(parse(header, opts)).map(([name, value]) => ({ name, value: value! }))
						: [];
				},
				get(name, opts) {
					return this.getAll(opts).find((cookie) => cookie.name === name)?.value;
				},
				serialize(name, value, opts) {
					return serialize(name, value, opts);
				},
				set(name, value, opts) {
					throw new Error("Not supported");
				},
				delete(name, opts) {
					throw new Error("Not supported");
				}
			};
		}

		this.event = event;

		this.secret = options.secret;
		this.ttl = options.ttl ?? fourteen_days_in_seconds;
		this.cookie_options = options.cookie;

		return new Proxy(this, {
			get: (target, prop) => {
				const value = target[prop as keyof typeof this];
				if (typeof value === "function") {
					return value.bind(target);
				}

				if (prop === "user") {
					return target.user;
				}

				const data_value = target.data[prop];
				return typeof data_value === "function" ? data_value.bind(target.data) : data_value;
			},
			set: (target, prop, value) => {
				if (prop === "user") {
					target.user = value;
				} else {
					target.data[prop] = value;
				}
				return true;
			}
		});
	}

	async init() {
		if (this.key !== "*") return;
		let key = await this.get_cookie();

		if (key) {
			const loaded = await this.load(key);
			if (loaded) {
				this.key = key;
				return;
			}
		}

		key = generate_key();
		this.key = key;

		await this.save();
		await this.set_cookie();
	}

	async save() {
		await database.session.upsert({
			where: { key: this.key },
			update: {
				data: JSON.stringify(this.data),
				expires_at: new Date(Date.now() + this.ttl * 1000),
				user: this.user
					? {
							connect: {
								id: this.user
							}
						}
					: {
							disconnect: {}
						}
			},
			create: {
				key: this.key,
				data: JSON.stringify(this.data),
				expires_at: new Date(Date.now() + this.ttl * 1000),
				user: this.user
					? {
							connect: {
								id: this.user
							}
						}
					: undefined
			}
		});
	}

	async destroy() {
		await database.session.delete({
			where: {
				key: this.key
			}
		});
		this.remove_cookie();
	}

	private async load(key: string) {
		const session = await database.session.findUnique({
			where: { key }
		});

		const now = new Date();
		if (!session || session.expires_at < now) {
			return false;
		}

		try {
			const json = JSON.parse(session.data);
			this.data = typeof json === "object" ? json : {};
			this.user = session.user_id;
		} catch (err) {
			logger.error("Failed to load session data", err);
			return false;
		}

		return true;
	}

	private async get_cookie() {
		const cookie = this.event.cookies?.get(this.cookie_options.name);
		if (!cookie) return null;
		return await unseal<string>(cookie, this.secret, this.ttl);
	}

	private async set_cookie() {
		const value = await seal(this.key, this.secret, this.ttl);

		const { name: cookie_name, ...options } = this.cookie_options;
		this.event.cookies?.set(cookie_name, value, {
			...options,
			maxAge: this.ttl,
			path: options.path ?? "/"
		});
	}

	private remove_cookie() {
		const { name: cookie_name, ...options } = this.cookie_options;
		this.event.cookies?.delete(cookie_name, {
			...options,
			maxAge: this.ttl,
			path: options.path ?? "/"
		});
	}
}

export type AppSession = AppSessionImpl & App.Session;
