export function is_allowed_redirect(redirect_url: URL, current_url: URL) {
	if (redirect_url.hostname === "localhost") return true;
	if (redirect_url.hostname === current_url.hostname) return true;
	const base_host = current_url.hostname.split(".").slice(-2).join(".");
	if (redirect_url.hostname.endsWith(base_host)) return true;
	return false;
}
