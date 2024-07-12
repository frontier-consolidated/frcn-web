import type { PageData } from "./$types";

export type MutableData = ReturnType<typeof clone_event_settings_data>;

export function clone_event_settings_data(data: PageData) {
	return {
		channel: data.channel ? structuredClone(data.channel) : { id: null, discord: { name: "!ERROR" }, discordGuild: { name: "!ERROR" } },
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

export function check_if_dirty(source: PageData, mutable: MutableData) {
	let clean = true;
	const diff: string[] = [];
	for (const key of Object.keys(mutable) as (keyof typeof mutable)[]) {
		switch (key) {
			case "channel":
				{
					const mutable_channel = mutable.channel?.id;
					const source_channel = mutable.channel?.id;
					const value_clean = mutable_channel === source_channel;
					if (!value_clean) diff.push(key);
					clean &&= value_clean;
				}
				break;
			case "location":
				{
					if (!mutable.location.some(loc => !loc)) {
						const mutable_location = mutable.location.map((loc) => loc.name).join("/");
						const source_location = source.location?.map((loc) => loc.name).join("/");
						const value_clean = mutable_location === source_location;
						if (!value_clean) diff.push(key);
						clean &&= value_clean;
					}
				}
				break;
			case "rsvpRoles":
				{
					const value_clean = mutable.rsvpRoles.length === source.rsvpRoles.length;
					if (!value_clean) diff.push(key + ".length");
					clean &&= value_clean;

					for (const role of mutable.rsvpRoles) {
						const source_role = source.rsvpRoles.find((r) => r.id === role.id);
						if (source_role) {
							const name_clean = source_role.name === role.name;
							const limit_clean = source_role.limit === role.limit;
							const emoji_clean = source_role.emoji.id === role.emoji.id;

							if (!name_clean) diff.push(key + "." + role.id + ".name");
							if (!limit_clean) diff.push(key + "." + role.id + ".limit");
							if (!emoji_clean) diff.push(key + "." + role.id + ".emoji");

							clean &&= name_clean && limit_clean && emoji_clean;
						} else {
							diff.push(key + "." + role.id);
							clean = false;
						}
					}
				}
				break;
			case "mentions":
				{
					const value_clean = mutable.mentions.length === source.mentions!.length;
					if (!value_clean) diff.push(key + ".length");
					clean &&= value_clean;

					for (const mention of mutable.mentions) {
						const source_mention = source.mentions!.find((m) => m === mention);
						if (!source_mention) {
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
						const value_clean = mutable.settings[setting] === source.settings?.[setting];
						if (!value_clean) diff.push(key + "." + setting);
						clean &&= value_clean;
					}
				}
				break;
			case "accessRoles":
				{
					const value_clean = mutable.accessRoles.length === source.accessRoles!.length;
					if (!value_clean) diff.push(key + ".length");
					clean &&= value_clean;

					for (const access_role of mutable.accessRoles) {
						const source_access_role = source.accessRoles!.find(
							(r) => r.id === access_role.id
						);
						if (!source_access_role) {
							diff.push(key + "." + access_role.id);
							clean = false;
						}
					}
				}
				break;
			default:
				{
					const value_clean = mutable[key] == source[key];
					if (!value_clean) diff.push(key);
					clean &&= value_clean;
				}
				break;
		}
	}
	// console.log(diff, mutable);
	return !clean;
}
