<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";
	import SystemIcon from "./icons/System.svelte";
	import PlanetIcon from "./icons/Planet.svelte";
	import MoonIcon from "./icons/Moon.svelte";
	import OutpostIcon from "./icons/Outpost.svelte";
	import CityIcon from "./icons/City.svelte";
	import OrbitalMarkerIcon from "./icons/OrbitalMarker.svelte";
	import StationIcon from "./icons/Station.svelte";

	export let location: AnyLocation;

	let icon: any;
	switch (location.type) {
		case "SYSTEM":
			icon = SystemIcon;
			break;
		case "PLANET":
			icon = PlanetIcon;
			break;
		case "MOON":
			icon = MoonIcon;
			break;
		case "STATION":
		case "COMM_ARRAY":
			icon = StationIcon;
			break;
		case "LAGRANGE_POINT":
		case "JUMP_POINT":
			icon = OrbitalMarkerIcon;
			break;
		case "CITY":
			icon = CityIcon;
			break;
		case "OUTPOST":
			icon = OutpostIcon;
			break;
		default:
			icon = null;
			break;
	}
</script>

{#if icon != null}
	<svelte:component this={icon} class="shrink-0 w-6 h-6 me-2" {...$$restProps} />
{:else}
	<svg class="w-0 h-0"></svg>
{/if}
