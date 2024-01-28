import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASEURL;

export const api = axios.create({
	baseURL: apiBaseUrl,
	timeout: 20 * 1000,
	withCredentials: true,
});

export function apiUri(route: string, protocol?: string) {
	return `${protocol ? apiBaseUrl.replace(/.+(?=:\/\/)/g, protocol) : apiBaseUrl}${route}`;
}
