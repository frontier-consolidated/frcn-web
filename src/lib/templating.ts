export function insertTemplateData(template: string, data: Record<string, any>) {
	const matches = template.matchAll(/{%\s*(?<path>.+?)\s*%}/g);
	const completed = new Set<string>();

	for (const match of matches) {
		const path = match.groups?.path;
		if (!path || completed.has(path)) continue;

		let value = data;
		for (const part of path.split(".")) {
			if (!value) break;
			value = value[part];
		}

		if (value === undefined) {
			console.error(`Template expected data '${path}' but found undefined`);
		}

		template = template.replaceAll(
			new RegExp(`{%\\s*${path}\\s*%}`, "g"),
			typeof value === "string" ? value : JSON.stringify(value)
		);
		completed.add(path);
	}

	return template;
}
