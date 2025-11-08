type Location = {
	name: string;
	coordinates?: SphericalCoordinates;
};

export type SphericalCoordinates = {
	distance: number;
	azimuthal: number;
	polar?: number;
};

type LocationWithCoordinates = Location & {
	coordinates: SphericalCoordinates;
};

type SurfaceSpaceLocation = Location & {
	inSpace: boolean;
};

type Surface<Location extends SurfaceSpaceLocation> = Location & {
	inSpace: false;
};

type Space<Location extends SurfaceSpaceLocation> = Location &
	LocationWithCoordinates & {
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

export type GameMode = Location & {
	type: "GAME_MODE";
};

export type Station = LocationWithCoordinates & {
	type: "STATION";
};

export type CommArray = LocationWithCoordinates & {
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

export type LagrangePoint = LocationWithCoordinates & {
	type: "LAGRANGE_POINT";
	children: (AstroidField | SpacePoi | Area)[];
};

export type JumpPoint = LocationWithCoordinates & {
	type: "JUMP_POINT";
};

export type AstroidField = LocationWithCoordinates & {
	type: "ASTROID_FIELD";
};

export type Moon = LocationWithCoordinates & {
	type: "MOON";
	children: (SurfacePoi | SpacePoi | Area)[];
};

export type Planet = LocationWithCoordinates & {
	type: "PLANET";
	children: (Planet | Moon | AstroidField | SpacePoi | SurfacePoi | Area)[];
};

export type Star = LocationWithCoordinates & {
	type: "STAR";
};

export type System = Location & {
	type: "SYSTEM";
	children: (Star | Planet | LagrangePoint | JumpPoint | Station | AstroidField | Area)[];
};

export type Galaxy = System[];

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

export type AnyFlatLocation = AnyLocation & {
	path: AnyLocation[];
};
