import { strings } from "@frcn/shared";
import { getLocations, type AnyLocation } from "@frcn/shared/locations";

export function getLocationEmoji(location: AnyLocation) {
	switch (location.type) {
		case "SYSTEM":
			return "<:System:1414211986031378554>";
		case "PLANET":
			return "<:Planet:1414211959741747210>";
		case "MOON":
			return "<:Moon:1414211936752762902>";
		case "STATION":
		case "COMM_ARRAY":
			return "<:Station:1414211972529918023>";
		case "JUMP_POINT":
			return "<:JumpPoint:1414211908059533422>";
		case "CITY":
			return "<:City:1414211896256757852>";
		case "OUTPOST":
			return "<:Outpost:1414211948052090920>";
		case "ASTROID_FIELD":
			return "<:AstroidField:1414211877260496917>";
		default:
			return "<:Marker:1414211924303941662>";
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
