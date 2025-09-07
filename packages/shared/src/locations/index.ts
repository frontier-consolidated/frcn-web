import { Pyro } from "./systems/Pyro";
import { Stanton } from "./systems/Stanton";
import type { AnyFlatLocation, AnyLocation, Area, Galaxy } from "./types";

export type * from "./types";

export const locations = [Stanton, Pyro] satisfies Galaxy;

export const areas = {
	default: [
		{
			type: "AREA",
			name: "Anywhere"
		}
	],
	PLANET: [
		{
			type: "AREA",
			name: "Surface"
		},
		{
			type: "AREA",
			name: "Orbit"
		}
	],
	MOON: [
		{
			type: "AREA",
			name: "Surface"
		},
		{
			type: "AREA",
			name: "Orbit"
		}
	]
} as const satisfies Record<string, Area[]>;

const locationsFlat = [] as AnyFlatLocation[];
function unpackLocations(locations: AnyLocation[], path: AnyLocation[] = []) {
	for (const location of locations) {
		const locationPath = [...path, location];
		locationsFlat.push({
			...location,
			path: locationPath
		});
		if ("children" in location) {
			unpackLocations(location.children, locationPath);
		}
	}
}
unpackLocations(locations);

export function searchLocations(query: string) {
	return locationsFlat.filter((location) => {
		return location.name.toLowerCase().includes(query.toLowerCase());
	});
}

export function getChildren(location: AnyLocation) {
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

export function getLocations(path: string[]) {
	const pathLocations: AnyLocation[] = [];

	for (const name of path) {
		const currentLocation = pathLocations.slice(-1)[0];

		if (!currentLocation) {
			const location = locations.find((loc) => loc.name == name);
			if (!location) break;
			pathLocations.push(location);
			continue;
		}

		if ("children" in currentLocation) {
			const location = getChildren(currentLocation)?.find((loc) => loc.name == name) as AnyLocation;
			if (!location) break;
			pathLocations.push(location);
		} else {
			break;
		}
	}

	return pathLocations;
}
