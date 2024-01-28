export function toTitleCase(str: string) {
	return str
		.toLowerCase()
		.replace(/_/g, " ")
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");
}
