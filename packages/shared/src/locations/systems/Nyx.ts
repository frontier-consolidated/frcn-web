import { stat } from "fs";
import { planet, station, system, jumpPoint, moon, astroidField, outpost } from "../helpers";

export const Nyx = system("Nyx", [
	planet("Nyx I", { coordinates: { azimuthal: null, distance: null } }),
	planet("Nyx II", { coordinates: { azimuthal: null, distance: null } }),
	planet("Nyx III", { coordinates: { azimuthal: null, distance: null } }),


	astroidField("Nyx belt alpha", { coordinates: { azimuthal: null, distance: null } }),
		station("Levski", { coordinates: { azimuthal: null, distance: null } }),
	astroidField("Nyx belt beta", { coordinates: { azimuthal: null, distance: null } }),

	
	jumpPoint("Pyro Gateway", {
		coordinates: { azimuthal: null, distance: null }
	}),
	jumpPoint("Stanton Gateway", {
		coordinates: { azimuthal: null, distance: null }
	})

]);
