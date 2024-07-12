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
	let image_src: string | null = null;
	$: {
		const custom_icon = categoryIcons[category];
		image_src = null;
		if (custom_icon) {
			if (typeof custom_icon === "string") {
				image_src = custom_icon;
			} else {
				icon = custom_icon;
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

{#if image_src}
	<img src={image_src} alt="Emoji category icon" class="shrink-0 w-6 h-6 me-2 object-contain" {...$$restProps} />
{:else}
	<svelte:component this={icon} class="shrink-0 w-6 h-6 me-2" {...$$restProps} />
{/if}
