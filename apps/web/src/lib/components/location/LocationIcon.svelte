<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";

	import AstroidFieldSvg from "./icons/AstroidField.svg";
	import CitySvg from "./icons/City.svg";
	import JumpPointSvg from "./icons/JumpPoint.svg";
	import MarkerSvg from "./icons/Marker.svg";
	import MoonSvg from "./icons/Moon.svg";
	import OutpostSvg from "./icons/Outpost.svg";
	import PlanetSvg from "./icons/Planet.svg";
	import StationSvg from "./icons/Station.svg";
	import SystemSvg from "./icons/System.svg";

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
	class="shrink-0 w-6 h-6 me-2"
	{...$$restProps}
>
	<title>{location.type}</title>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html elements}
</svg>
