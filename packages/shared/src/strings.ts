export function to_title_case(str: string) {
	return str
		.toLowerCase()
		.replace(/_/g, " ")
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");
}

export function kebab_case_to_title_case(str: string) {
	return to_title_case(str.replace(/-/g, " "));
}