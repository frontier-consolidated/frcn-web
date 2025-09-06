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
	AstroidField
} from "./types";

export function system(name: string, children: System["children"] = []) {
	return {
		type: "SYSTEM",
		name,
		children
	} satisfies System;
}

export function jumpPoint(name: string, children: JumpPoint["children"]) {
	return {
		type: "JUMP_POINT",
		name,
		children
	} satisfies JumpPoint;
}

export function lagrangePoint(name: string, children: LagrangePoint["children"]) {
	return {
		type: "LAGRANGE_POINT",
		name,
		children
	} satisfies LagrangePoint;
}

export function astroidField(name: string) {
	return {
		type: "ASTROID_FIELD",
		name
	} satisfies AstroidField;
}

export function star(name: string) {
	return {
		type: "STAR",
		name
	} satisfies Star;
}

export function planet(name: string, children: Planet["children"] = []) {
	return {
		type: "PLANET",
		name,
		children
	} satisfies Planet;
}

export function moon(name: string, children: Moon["children"] = []) {
	return {
		type: "MOON",
		name,
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

export function raceTrack(name: string, inSpace: boolean = false) {
	return {
		type: "RACE_TRACK",
		inSpace,
		name
	} satisfies RaceTrack;
}

export function station(name: string) {
	return {
		type: "STATION",
		name
	} satisfies Station;
}

export function commArray(name: string) {
	return {
		type: "COMM_ARRAY",
		name
	} satisfies CommArray;
}

export function securityPost(name: string, inSpace: boolean = false) {
	return {
		type: "SECURITY_POST",
		inSpace,
		name
	} satisfies SecurityPost;
}
