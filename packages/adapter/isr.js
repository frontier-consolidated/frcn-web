import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

function is_browser() {
	// @ts-expect-error window will not be defined on server
	return typeof window !== "undefined";
}

if (is_browser())
	throw new Error(
		"Attempted to import @frcn/adapter/isr on the client, this is a server-side module"
	);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function invalidate_route(pathname) {
	console.log("Invalidating route...");
	const { invalidate_isr_route } = await import(
		/* @vite-ignore */ pathToFileURL(path.join(__dirname, "../../", "handler.js")).href
	);
	invalidate_isr_route(pathname);
}

export { invalidate_route };
