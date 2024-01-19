<script lang="ts">
	import type { AnyLocation } from "$lib/data/locations/types";
	import LocationIcon from "./LocationIcon.svelte";

	export let value: AnyLocation;
</script>

<div class="flex items-center gap-1">
	<LocationIcon location={value} />
	{value.name}
</div>
