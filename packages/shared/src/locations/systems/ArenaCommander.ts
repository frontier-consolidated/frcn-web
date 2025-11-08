import { planet, station, system, jumpPoint, moon, astroidField, outpost, gameMode } from "../helpers";

export const ArenaCommander = system("Arena Commander", [
    station("Free Flight", { coordinates: { azimuthal: null, distance: null } }),
    station("Ship PVP", { coordinates: { azimuthal: null, distance: null } }),
    station("Racing", { coordinates: { azimuthal: null, distance: null } }),
    station("Gun rush / FPS", { coordinates: { azimuthal: null, distance: null } }),
    station("Other / Experimental", { coordinates: { azimuthal: null, distance: null } })
]);
