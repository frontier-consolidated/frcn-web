import type {
	JumpPoint,
	LagrangePoint,
	Moon,
	Planet,
	Star,
	System,
	City,
	Outpost,
	Prison,
	RaceTrack,
	Station,
	CommArray,
	SecurityPost,
	AstroidField,
	SphericalCoordinates,
	GameMode
} from "./types";

type InSpaceData =
	| {
			inSpace: false;
	  }
	| {
			inSpace: true;
			coordinates: SphericalCoordinates;
	  };

type OrbitalData = {
	coordinates: SphericalCoordinates;
};

export function system(name: string, children: System["children"] = []) {
	return {
		type: "SYSTEM",
		name,
		children
	} satisfies System;
}

export function jumpPoint(name: string, data: OrbitalData) {
	return {
		type: "JUMP_POINT",
		name,
		coordinates: data.coordinates
	} satisfies JumpPoint;
}

export function lagrangePoint(
	name: string,
	data: OrbitalData,
	children: LagrangePoint["children"]
) {
	return {
		type: "LAGRANGE_POINT",
		name,
		coordinates: data.coordinates,
		children
	} satisfies LagrangePoint;
}

export function astroidField(name: string, data: OrbitalData) {
	return {
		type: "ASTROID_FIELD",
		name,
		coordinates: data.coordinates
	} satisfies AstroidField;
}

export function star(name: string, data: OrbitalData) {
	return {
		type: "STAR",
		name,
		coordinates: data.coordinates
	} satisfies Star;
}

export function planet(name: string, data: OrbitalData, children: Planet["children"] = []) {
	return {
		type: "PLANET",
		name,
		coordinates: data.coordinates,
		children
	} satisfies Planet;
}

export function moon(name: string, data: OrbitalData, children: Moon["children"] = []) {
	return {
		type: "MOON",
		name,
		coordinates: data.coordinates,
		children
	} satisfies Moon;
}

export function city(name: string) {
	return {
		type: "CITY",
		name
	} satisfies City;
}

export function outpost(name: string) {
	return {
		type: "OUTPOST",
		name
	} satisfies Outpost;
}

export function prison(name: string) {
	return {
		type: "PRISON",
		name
	} satisfies Prison;
}

export function raceTrack(name: string, data: InSpaceData = { inSpace: false }) {
	return {
		type: "RACE_TRACK",
		inSpace: data.inSpace,
		coordinates: "coordinates" in data ? data.coordinates : undefined,
		name
	} satisfies RaceTrack;
}

export function station(name: string, data: OrbitalData) {
	return {
		type: "STATION",
		name,
		coordinates: data.coordinates
	} satisfies Station;
}

export function commArray(name: string, data: OrbitalData) {
	return {
		type: "COMM_ARRAY",
		name,
		coordinates: data.coordinates
	} satisfies CommArray;
}

export function securityPost(name: string, data: InSpaceData = { inSpace: false }) {
	return {
		type: "SECURITY_POST",
		inSpace: data.inSpace,
		coordinates: "coordinates" in data ? data.coordinates : undefined,
		name
	} satisfies SecurityPost;
}

export function gameMode(name: string) {
	return {
		type: "GAME_MODE",
		name
	} satisfies GameMode;
}