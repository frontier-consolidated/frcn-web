import { stat } from "fs";
import { planet, station, system, jumpPoint, moon, astroidField, outpost } from "../helpers";

export const Nyx = system("Nyx", [
	planet("Nyx I", {}),
	planet("Nyx II", {}),
	planet("Nyx III", {}),

	station("Levski", {}),
	station("People's Service Station ALPHA", {}),
	station("People's Service Station DELTA", {}),
	station("People's Service Station THETA", {}),
	station("People's Service Station LAMBDA", {}),
	astroidField("Nyx belt alpha", {}),
	astroidField("Nyx belt beta", {}),

	jumpPoint("Pyro Gateway", {}),
	jumpPoint("Stanton Gateway", {})

]);
