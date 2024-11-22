type Location = {
	name: string;
	coordinates?: string;
};

type SurfaceSpaceLocation = Location & {
	inSpace: boolean;
};

type Surface<Location extends SurfaceSpaceLocation> = Location & {
	inSpace: false;
};

type Space<Location extends SurfaceSpaceLocation> = Location & {
	inSpace: true;
};

//

export type Area = Location & {
	type: "AREA";
};

export type Outpost = Location & {
	type: "OUTPOST";
};

export type City = Location & {
	type: "CITY";
};

export type Prison = Location & {
	type: "PRISON";
};

export type Station = Location & {
	type: "STATION";
};

export type CommArray = Location & {
	type: "COMM_ARRAY";
};

export type SecurityPost = SurfaceSpaceLocation & {
	type: "SECURITY_POST";
};

export type RaceTrack = SurfaceSpaceLocation & {
	type: "RACE_TRACK";
};

export type SurfacePoi = Outpost | City | Prison | Surface<SecurityPost> | Surface<RaceTrack>;
export type SpacePoi = Station | CommArray | Space<SecurityPost> | Space<RaceTrack>;

export type LagrangePoint = Location & {
	type: "LAGRANGE_POINT";
	children: (AstroidField | SpacePoi | Area)[];
};

export type JumpPoint = Location & {
	type: "JUMP_POINT";
	children: (SpacePoi | Area)[];
};

export type AstroidField = Location & {
	type: "ASTROID_FIELD";
};

export type Moon = Location & {
	type: "MOON";
	children: (SurfacePoi | SpacePoi | Area)[];
};

export type Planet = Location & {
	type: "PLANET";
	children: (Moon | SpacePoi | SurfacePoi | Area)[];
};

export type Star = Location & {
	type: "STAR";
};

export type System = Location & {
	type: "SYSTEM";
	children: (Star | Planet | LagrangePoint | JumpPoint | Area)[];
};

export type AnyLocation =
	| System
	| Star
	| Planet
	| Moon
	| AstroidField
	| JumpPoint
	| LagrangePoint
	| SurfacePoi
	| SpacePoi
	| Area;
export type Galaxy = System[];
