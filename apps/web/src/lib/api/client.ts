import axios from "axios";

import { env } from "$env/dynamic/public";

export const api = axios.create({
	baseURL: env.PUBLIC_API_BASEURL,
	timeout: 20 * 1000,
	withCredentials: true
});

export function apiUri(route: string, protocol?: string) {
	return `${
		protocol ? env.PUBLIC_API_BASEURL.replace(/.+(?=:\/\/)/g, protocol) : env.PUBLIC_API_BASEURL
	}${route}`;
}
