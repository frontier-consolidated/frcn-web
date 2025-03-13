<script lang="ts">
	import type { Thing, WithContext } from "schema-dts";

	// eslint-disable-next-line no-undef
	type T = $$Generic<Thing>;
	export let data: WithContext<T>;
	$: scriptValue =
		`<TAG_PLACEHOLDER type="application/ld+json">${JSON.stringify(data)}</TAG_PLACEHOLDER>`.replaceAll(
			"TAG_PLACEHOLDER",
			"script"
		);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html scriptValue}
</svelte:head>
