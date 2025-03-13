import { planet, station, system, jumpPoint } from "../helpers";

export const Pyro = system("Pyro", [
	// star("Stanton"),
	planet("Pyro I"),
	planet("Monox"),
	planet("Bloom"),
	planet("Pyro IV"),
	planet("Pyro V"),
	planet("Terminus"),
	jumpPoint("Pyro - Cano Jump Point", [station("Cano Gateway")]),
	jumpPoint("Pyro - Terra Jump Point", [station("Terra Gateway")]),
	jumpPoint("Pyro - Stanton Jump Point", [station("Stanton Gateway")]),
	jumpPoint("Pyro - Nyx Jump Point", [station("Nyx Gateway")]),
	jumpPoint("Pyro - Castra Jump Point", [station("Castra Gateway")])
]);
