<script lang="ts">
	import type { AnyLocation } from "@frcn/shared/locations";

	import LocationIcon from "./LocationIcon.svelte";

	export let value: AnyLocation;
</script>

<div class="flex items-center gap-1">
	<LocationIcon location={value} />
	{value.name}
</div>
