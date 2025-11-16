import { planet, station, system, jumpPoint, moon, astroidField, outpost, gameMode } from "../helpers";

export const ArenaCommander = {
    ...gameMode("Arena Commander", [
        gameMode("Free Flight"),
        gameMode("Ship PVP"),
        gameMode("Racing"),
        gameMode("FPS"),
        gameMode("Other / Experimental")
    ]),
    noAnywhere: true
};
