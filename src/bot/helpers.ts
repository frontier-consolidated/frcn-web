import { strings } from "@frcn/shared";
import { getLocations, type AnyLocation } from "@frcn/shared/locations";

export function getLocationEmoji(location: AnyLocation) {
	switch (location.type) {
		case "SYSTEM":
			return "<:System:1200467538841194506>";
		case "PLANET":
			return "<:Planet:1200467536358162553>";
		case "MOON":
			return "<:Moon:1200467530783920238>";
		case "STATION":
		case "COMM_ARRAY":
			return "<:Station:1200467537574506526>";
		case "LAGRANGE_POINT":
		case "JUMP_POINT":
			return "<:OrbitalMarker:1200467532805574717>";
		case "CITY":
			return "<:City:1200467529722761326>";
		case "OUTPOST":
			return "<:Outpost:1200467533975781507>";
		default:
			return "";
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
