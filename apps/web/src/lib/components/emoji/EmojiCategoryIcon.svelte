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
	import type { ComponentType, SvelteComponent } from "svelte";

	export let category: string;
	export let categoryIcons: Record<string, string | ComponentType<SvelteComponent>> = {};

	let icon: any;
	let imageSrc: string | null = null;
	$: {
		const customIcon = categoryIcons[category];
		imageSrc = null;
		if (customIcon) {
			if (typeof customIcon === "string") {
				imageSrc = customIcon;
			} else {
				icon = customIcon;
			}
		} else {
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
		}
	}
</script>

{#if imageSrc}
	<img src={imageSrc} alt="Emoji category icon" class="shrink-0 w-6 h-6 me-2 object-contain" {...$$restProps} />
{:else}
	<svelte:component this={icon} class="shrink-0 w-6 h-6 me-2" {...$$restProps} />
{/if}
