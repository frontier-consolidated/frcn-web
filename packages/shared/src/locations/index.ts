import { Stanton } from "./systems/Stanton";
import type { AnyLocation, Area, Universe } from "./types";

export type * from "./types";

export const locations = [Stanton] satisfies Universe;

export const areas = {
	default: [
		{
			type: "AREA",
			name: "Anywhere",
		},
	],
	PLANET: [
		{
			type: "AREA",
			name: "Surface",
		},
		{
			type: "AREA",
			name: "Orbit",
		},
	],
	MOON: [
		{
			type: "AREA",
			name: "Surface",
		},
		{
			type: "AREA",
			name: "Orbit",
		},
	],
} as const satisfies Record<string, Area[]>;

export function get_children(location: AnyLocation) {
	if ("children" in location) {
		const children = [...location.children];
		if (location.type in areas) {
			children.unshift(...areas[location.type as keyof typeof areas]);
		}
		children.unshift(...areas.default);
		return children;
	}
	return null;
}

export function get_locations(path: string[]) {
	const path_locations: AnyLocation[] = [];

	for (const name of path) {
		const current_location = path_locations.slice(-1)[0];

		if (!current_location) {
			const location = locations.find((loc) => loc.name == name);
			if (!location) break;
			path_locations.push(location);
			continue;
		}

		if ("children" in current_location) {
			const location = get_children(current_location)?.find(
				(loc) => loc.name == name
			) as AnyLocation;
			if (!location) break;
			path_locations.push(location);
		} else {
			break;
		}
	}

	return path_locations;
}
