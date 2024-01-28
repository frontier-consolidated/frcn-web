<script lang="ts">
	import {
		FaceGrinSolid,
		GlobeSolid,
		StoreSolid,
		NewspaperSolid,
		MapPinAltSolid,
		GiftBoxSolid,
		HeartSolid,
		FlagOutline,
		ExclamationCircleSolid,
	} from "flowbite-svelte-icons";

	export let category: string;

	let icon: any;
	switch (category) {
		case "people":
			icon = FaceGrinSolid;
			break;
		case "nature":
			icon = GlobeSolid;
			break;
		case "food":
			icon = StoreSolid;
			break;
		case "activity":
			icon = NewspaperSolid;
			break;
		case "travel":
			icon = MapPinAltSolid;
			break;
		case "objects":
			icon = GiftBoxSolid;
			break;
		case "symbols":
			icon = HeartSolid;
			break;
		case "flags":
			icon = FlagOutline;
			break;
		default:
			icon = ExclamationCircleSolid;
			break;
	}
</script>

<svelte:component this={icon} class="shrink-0 w-6 h-6 me-2" {...$$restProps} />
