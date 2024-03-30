import type { PageData } from "./$types";

export type MutableData = ReturnType<typeof cloneEventSettingsData>;

export function cloneEventSettingsData(data: PageData) {
	return {
		channel: data.channel ? structuredClone(data.channel) : { id: null, name: "!ERROR" },
		name: data.name,
		summary: data.summary,
		description: data.description,
		imageUrl: data.imageUrl,
		eventType: data.eventType,
		location: data.location ? [...data.location] : [],
		startAt: data.startAt,
		duration: data.duration,
		rsvpRoles: structuredClone(data.rsvpRoles),
		mentions: data.mentions ? [...data.mentions] : [],
		settings: structuredClone(data.settings)!,
		accessType: data.accessType!,
		accessRoles: data.accessRoles ? data.accessRoles.map((r) => structuredClone(r)) : [],
	};
}

export function checkIfDirty(source: PageData, mutable: MutableData) {
	let clean = true;
	const diff: string[] = [];
	for (const key of Object.keys(mutable) as (keyof typeof mutable)[]) {
		switch (key) {
			case "channel":
				{
					const mutableChannel = mutable.channel?.id;
					const sourceChannel = mutable.channel?.id;
					const valueClean = mutableChannel === sourceChannel;
					if (!valueClean) diff.push(key);
					clean &&= valueClean;
				}
				break;
			case "location":
				{
					const mutableLocation = mutable.location.map((loc) => loc.name).join("/");
					const sourceLocation = source.location?.map((loc) => loc.name).join("/");
					const valueClean = mutableLocation === sourceLocation;
					if (!valueClean) diff.push(key);
					clean &&= valueClean;
				}
				break;
			case "rsvpRoles":
				{
					const valueClean = mutable.rsvpRoles.length === source.rsvpRoles.length;
					if (!valueClean) diff.push(key + ".length");
					clean &&= valueClean;

					for (const role of mutable.rsvpRoles) {
						const sourceRole = source.rsvpRoles.find((r) => r.id === role.id);
						if (sourceRole) {
							const nameClean = sourceRole.name === role.name;
							const limitClean = sourceRole.limit === role.limit;
							const emojiClean = sourceRole.emoji.id === role.emoji.id;

							if (!nameClean) diff.push(key + "." + role.id + ".name");
							if (!limitClean) diff.push(key + "." + role.id + ".limit");
							if (!emojiClean) diff.push(key + "." + role.id + ".emoji");

							clean &&= nameClean && limitClean && emojiClean;
						} else {
							diff.push(key + "." + role.id);
							clean = false;
						}
					}
				}
				break;
			case "mentions":
				{
					const valueClean = mutable.mentions.length === source.mentions!.length;
					if (!valueClean) diff.push(key + ".length");
					clean &&= valueClean;

					for (const mention of mutable.mentions) {
						const sourceMention = source.mentions!.find((m) => m === mention);
						if (!sourceMention) {
							diff.push(key + "." + mention);
							clean = false;
						}
					}
				}
				break;
			case "settings":
				{
					for (const setting of Object.keys(
						mutable.settings
					) as (keyof typeof mutable.settings)[]) {
						const valueClean = mutable.settings[setting] === source.settings?.[setting];
						if (!valueClean) diff.push(key + "." + setting);
						clean &&= valueClean;
					}
				}
				break;
			case "accessRoles":
				{
					const valueClean = mutable.accessRoles.length === source.accessRoles!.length;
					if (!valueClean) diff.push(key + ".length");
					clean &&= valueClean;

					for (const accessRole of mutable.accessRoles) {
						const sourceAccessRole = source.accessRoles!.find(
							(r) => r.id === accessRole.id
						);
						if (!sourceAccessRole) {
							diff.push(key + "." + accessRole.id);
							clean = false;
						}
					}
				}
				break;
			default:
				{
					const valueClean = mutable[key] == source[key];
					if (!valueClean) diff.push(key);
					clean &&= valueClean;
				}
				break;
		}
	}
	// console.log(diff, mutable);
	return !clean;
}
