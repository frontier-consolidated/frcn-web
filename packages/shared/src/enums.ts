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
}

const EventTypeNameMap = {
	[EventType.Mining]: "Mining",
	[EventType.Salvage]: "Salvage",
	[EventType.Combat]: "Combat",
	[EventType.Racing]: "Racing",
	[EventType.Support]: "Support",
	[EventType.Illegal]: "Illegal",
	[EventType.Combined]: "Combined Op",
	[EventType.Shenanigans]: "Shenanigans",
	[EventType.Misc]: "Miscellaneous",
} satisfies Record<EventType, string>;
export const EventTypeOptions = Object.values(EventType).map((value) => {
	return {
		value,
		name: EventTypeNameMap[value],
	};
});
