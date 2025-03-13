const characters = "012346789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generate_short_id(length = 7) {
	let id = "";
	for (let i = 0; i < length; i++) {
		id += characters[Math.floor(Math.random() * characters.length)];
	}
	return id;
}
