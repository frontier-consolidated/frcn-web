export enum EventType {
	Mining = "MINING",
	Salvage = "SALVAGE",
	Combat = "COMBAT",
	Racing = "RACING",
	Support = "SUPPORT",
	Illegal = "ILLEGAL",
	Combined = "COMBINED",
	Shenanigans = "SHENANIGANS",
	Misc = "MISC",
	Roleplay = "ROLEPLAY",
}

const eventTypeNameMap = {
	[EventType.Mining]: "Mining",
	[EventType.Salvage]: "Salvage",
	[EventType.Combat]: "Combat",
	[EventType.Racing]: "Racing",
	[EventType.Support]: "Support",
	[EventType.Illegal]: "Illegal",
	[EventType.Combined]: "Combined Op",
	[EventType.Shenanigans]: "Shenanigans",
	[EventType.Misc]: "Miscellaneous",
	[EventType.Roleplay]: "Roleplay",
} satisfies Record<EventType, string>;
export const EventTypeOptions = Object.values(EventType).map((value) => {
	return {
		value,
		name: eventTypeNameMap[value],
	};
});
