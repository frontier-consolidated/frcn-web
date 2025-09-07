import { strings } from "@frcn/shared";
import { getLocations, type AnyLocation } from "@frcn/shared/locations";

const emojiIdsByClient = {
	// Prod
	"1188195510247510136": {
		AstroidField: "1414211877260496917",
		City: "1414211896256757852",
		JumpPoint: "1414211908059533422",
		Marker: "1414211924303941662",
		Moon: "1414211936752762902",
		Outpost: "1414211948052090920",
		Planet: "1414211959741747210",
		Station: "1414211972529918023",
		System: "1414211986031378554"
	},
	// Dev
	"1209538376269561866": {
		AstroidField: "1414215570445959249",
		City: "1414215587894267985",
		JumpPoint: "1414215598841270364",
		Marker: "1414215611361394798",
		Moon: "1414215623973535876",
		Outpost: "1414215633973018876",
		Planet: "1414215646446747720",
		Station: "1414215657825763398",
		System: "1414215668873695245"
	}
};

export function getLocationEmoji(location: AnyLocation) {
	const emojiIds =
		emojiIdsByClient[process.env.DISCORD_CLIENTID as keyof typeof emojiIdsByClient] ?? {};
	switch (location.type) {
		case "SYSTEM":
			return `<:System:${emojiIds.System}>`;
		case "PLANET":
			return `<:Planet:${emojiIds.Planet}>`;
		case "MOON":
			return `<:Moon:${emojiIds.Moon}>`;
		case "STATION":
		case "COMM_ARRAY":
			return `<:Station:${emojiIds.Station}>`;
		case "JUMP_POINT":
			return `<:JumpPoint:${emojiIds.JumpPoint}>`;
		case "CITY":
			return `<:City:${emojiIds.City}>`;
		case "OUTPOST":
			return `<:Outpost:${emojiIds.Outpost}>`;
		case "ASTROID_FIELD":
			return `<:AstroidField:${emojiIds.AstroidField}>`;
		default:
			return `<:Marker:${emojiIds.Marker}>`;
	}
}

export function getLocationBreadcrumbs(location: string[]) {
	let value = "";
	if (location.length > 0) {
		const locations = getLocations(location);
		value = locations
			.map((loc) => `${getLocationEmoji(loc)} **${strings.toTitleCase(loc.name)}**`.trim())
			.join(" > ");
	} else {
		value = "Anywhere";
	}
	return value;
}
