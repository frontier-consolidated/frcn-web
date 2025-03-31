<script lang="ts" generics="T extends Thing">
	import type { Thing, WithContext } from "schema-dts";

	import InlineScript from "$lib/components/inline-script.svelte";

	let { data }: { data: WithContext<T> } = $props();
</script>

<InlineScript type="application/ld+json" source={JSON.stringify(data)} />
