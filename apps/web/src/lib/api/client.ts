import axios from "axios";

import { building } from "$app/environment";
import { env } from "$env/dynamic/public";

const PUBLIC_API_BASEURL = building
	? (process.env.PUBLIC_API_BASEURL ?? "")
	: env.PUBLIC_API_BASEURL;

export const api = axios.create({
	baseURL: PUBLIC_API_BASEURL,
	timeout: 20 * 1000,
	withCredentials: true
});

export function apiUri(route: string, protocol?: string) {
	return `${
		protocol ? PUBLIC_API_BASEURL.replace(/.+(?=:\/\/)/g, protocol) : PUBLIC_API_BASEURL
	}${route}`;
}
