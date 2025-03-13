export function slugify(text: string) {
	return text
		.replace(/[^a-zA-Z0-9]+/g, " ")
		.trim()
		.replace(/ +/g, "-")
		.toLowerCase();
}
