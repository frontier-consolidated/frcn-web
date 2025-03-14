import { planet, station, system, jumpPoint, moon, astroidField, outpost } from "../helpers";

export const Pyro = system("Pyro", [
	// star("Pyro"),
	planet("Pyro I", { coordinates: { azimuthal: -163.22, distance: 8.27 } }, [
		outpost("Rustville"),
		outpost("Gray Gardens Depot"),
		outpost("Stag's Rut")
	]),
	planet("Monox", { coordinates: { azimuthal: -55.22, distance: 10.62 } }, [
		outpost("Slowburn Depot"),
		outpost("Last Ditch"),
		outpost("Arid Reach"),
		outpost("Ostler's Claim"),
		outpost("Yang's Place"),
		outpost("Sunset Mesa"),
		outpost("Jackson's Swap")
	]),
	planet("Bloom", { coordinates: { azimuthal: 154.77, distance: 17.8 } }, [
		outpost("The Yard"),
		outpost("The Golden Riviera"),
		outpost("Narena's Rest"),
		outpost("Windfall"),
		outpost("Prospect Depot"),
		outpost("Carver's Ridge"),
		outpost("Bueno Ravine"),
		outpost("Shadowfall"),
		outpost("Shepherd's Rest"),
		outpost("Frigid Knot"),
		station("Orbituary", { coordinates: { azimuthal: 154.77, distance: 17.8 } })
	]),
	planet("Pyro V", { coordinates: { azimuthal: -95.22, distance: 42.93 } }, [
		astroidField("RAB-DELTA", { coordinates: { azimuthal: -95.35, distance: 42.78 } }),
		moon("Ignis", { coordinates: { azimuthal: -95.29, distance: 42.95 } }, [
			outpost("Ashland"),
			outpost("Kabir's Post")
		]),
		moon("Vatra", { coordinates: { azimuthal: -95.2, distance: 42.86 } }, [
			outpost("Seer's Canyon")
		]),
		moon("Adir", { coordinates: { azimuthal: -95.1, distance: 42.89 } }, [
			outpost("Prophet's Peak")
		]),
		moon("Fairo", { coordinates: { azimuthal: -95.25, distance: 43.06 } }, [
			outpost("Feo Canyon Depot")
		]),
		moon("Fuego", { coordinates: { azimuthal: -95.04, distance: 42.99 } }),
		moon("Vuur", { coordinates: { azimuthal: -95.42, distance: 42.84 } }),
		planet("Pyro IV", { coordinates: { azimuthal: -94.91, distance: 43.23 } }, [
			outpost("Dinger's Depot"),
			outpost("Goner's Deal"),
			outpost("Fallow Field"),
			outpost("Sacren's Plot"),
			outpost("Chawla's Beach"),
			astroidField("RAB-LAMDA", { coordinates: { azimuthal: -94.91, distance: 43.17 } }),
			astroidField("RAB-OVER", { coordinates: { azimuthal: -94.82, distance: 43.2 } }),
			astroidField("RAB-ECHO", { coordinates: { azimuthal: -94.98, distance: 43.26 } })
		])
	]),
	planet("Terminus"),
	astroidField("PYAM-EXHANG-0-1", {
		coordinates: { polar: 18.21, azimuthal: -150.63, distance: 2.56 }
	}),
	astroidField("PYAM-SUPVISR-3-4", {
		coordinates: { polar: 0.04, azimuthal: -145.2, distance: 17.78 }
	}),
	astroidField("PYAM-SUPVISR-3-5", {
		coordinates: { polar: 0.03, azimuthal: 44.83, distance: 17.78 }
	}),
	astroidField("RAB-ALPHA", { coordinates: { azimuthal: 23.02, distance: 7.65 } }),
	astroidField("RAB-TUNG", { coordinates: { azimuthal: 24.84, distance: 9.23 } }),
	astroidField("RAB-NOVEMBER", { coordinates: { azimuthal: -122.01, distance: 10.33 } }),
	astroidField("RAB-WHISKEY", { coordinates: { azimuthal: 159.42, distance: 19.58 } }),
	astroidField("RAB-KILO", { coordinates: { azimuthal: -32.82, distance: 17.74 } }),
	astroidField("RAB-IGNITION", { coordinates: { azimuthal: 47.89, distance: 17.8 } }),
	astroidField("RAB-BRAVO", { coordinates: { azimuthal: 88.12, distance: 16.78 } }),
	astroidField("RAB-YORK", { coordinates: { azimuthal: -171.33, distance: 13.89 } }),
	astroidField("RAB-CHARLIE", { coordinates: { azimuthal: 177.45, distance: 16.22 } }),
	astroidField("RAB-GULF", { coordinates: { azimuthal: 156.09, distance: 27.44 } }),
	astroidField("RAB-ROTH", { coordinates: { azimuthal: -111.72, distance: 27.82 } }),
	astroidField("RAB-FOXTROT", { coordinates: { azimuthal: -83.48, distance: 28.68 } }),
	astroidField("RAB-XENO", { coordinates: { azimuthal: -125.77, distance: 36.45 } }),
	astroidField("RAB-HELIO", { coordinates: { azimuthal: -89.03, distance: 42.29 } }),
	astroidField("CLUSTER BGR-560", {
		coordinates: { polar: -2.14, azimuthal: 136.55, distance: 18.72 }
	}),
	astroidField("CLUSTER NBD-102", {
		coordinates: { polar: -0.21, azimuthal: -37.13, distance: 20.67 }
	}),
	astroidField("CLUSTER CAJ-445", {
		coordinates: { polar: -1.02, azimuthal: 170.46, distance: 22.18 }
	}),
	astroidField("CLUSTER JWY-925", {
		coordinates: { polar: -1.07, azimuthal: -176.81, distance: 38.75 }
	}),
	astroidField("CLUSTER FSN-704", {
		coordinates: { polar: 1.08, azimuthal: -94.84, distance: 43.36 }
	}),
	astroidField("CLUSTER GRP-839", {
		coordinates: { polar: -0.69, azimuthal: -94.97, distance: 43.11 }
	}),
	astroidField("CLUSTER YKA-011", {
		coordinates: { polar: -0.95, azimuthal: -95.43, distance: 42.97 }
	}),
	astroidField("CLUSTER RSC-340", {
		coordinates: { polar: 0.52, azimuthal: -93.16, distance: 41.47 }
	}),
	astroidField("PYR1 L1", { coordinates: { azimuthal: -162.22, distance: 7.44 } }),
	astroidField("PYR1 L2", { coordinates: { azimuthal: -163.22, distance: 9.1 } }),
	astroidField("PYR1 L3", { coordinates: { azimuthal: 15.08, distance: 8.56 } }),
	astroidField("PYR1 L4", { coordinates: { azimuthal: -103.22, distance: 8.27 } }),
	astroidField("PYR1 L5", { coordinates: { azimuthal: 136.77, distance: 8.27 } }),
	astroidField("PYR2 L1", { coordinates: { azimuthal: -54.22, distance: 9.55 } }),
	astroidField("PYR2 L2", { coordinates: { azimuthal: -55.22, distance: 11.68 } }),
	astroidField("PYR2 L3", { coordinates: { azimuthal: 104.77, distance: 10.62 } }),
	station("Checkmate", { coordinates: { polar: 0.01, azimuthal: -5.19, distance: 10.59 } }),
	astroidField("PYR2 L5", { coordinates: { azimuthal: -125.22, distance: 10.62 } }),
	station("Starlight Service Station", { coordinates: { azimuthal: 155.79, distance: 16.01 } }),
	astroidField("PYR3 L2", { coordinates: { azimuthal: 154.77, distance: 19.58 } }),
	station("Patch City", { coordinates: { azimuthal: -35.26, distance: 17.79 } }),
	astroidField("PYR3 L4", { coordinates: { azimuthal: -145.22, distance: 17.8 } }),
	astroidField("PYR3 L5", { coordinates: { azimuthal: 44.77, distance: 17.8 } }),

	jumpPoint("Pyro - Cano Jump Point", [station("Cano Gateway")]),
	jumpPoint("Pyro - Terra Jump Point", [station("Terra Gateway")]),
	jumpPoint("Pyro - Stanton Jump Point", [station("Stanton Gateway")]),
	jumpPoint("Pyro - Nyx Jump Point", [station("Nyx Gateway")]),
	jumpPoint("Pyro - Castra Jump Point", [station("Castra Gateway")])
]);
