<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";

	import AstroidFieldSvg from "./icons/AstroidField.svg?raw";
	import CitySvg from "./icons/City.svg?raw";
	import JumpPointSvg from "./icons/JumpPoint.svg?raw";
	import MarkerSvg from "./icons/Marker.svg?raw";
	import MoonSvg from "./icons/Moon.svg?raw";
	import OutpostSvg from "./icons/Outpost.svg?raw";
	import PlanetSvg from "./icons/Planet.svg?raw";
	import StationSvg from "./icons/Station.svg?raw";
	import SystemSvg from "./icons/System.svg?raw";

	export let location: AnyLocation;

	let svg: string = "";
	switch (location.type) {
		case "SYSTEM":
			svg = SystemSvg;
			break;
		case "PLANET":
			svg = PlanetSvg;
			break;
		case "MOON":
			svg = MoonSvg;
			break;
		case "STATION":
		case "COMM_ARRAY":
			svg = StationSvg;
			break;
		case "JUMP_POINT":
			svg = JumpPointSvg;
			break;
		case "CITY":
			svg = CitySvg;
			break;
		case "OUTPOST":
			svg = OutpostSvg;
			break;
		case "ASTROID_FIELD":
			svg = AstroidFieldSvg;
			break;
		default:
			svg = MarkerSvg;
			break;
	}

	$: elements = svg.replace(/<svg[ \n]([^>]*)>/, "").replace("</svg>", "");
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="64"
	height="64"
	viewBox="0 0 64 64"
	class="me-2 h-6 w-6 shrink-0"
	{...$$restProps}
>
	<title>{location.type}</title>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html elements}
</svg>
