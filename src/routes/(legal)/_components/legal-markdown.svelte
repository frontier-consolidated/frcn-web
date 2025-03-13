<script lang="ts">
	import Heading from "./heading.svelte";

	import { config } from "$lib/config";
	import { Markdown } from "$lib/markdown";
	import { insert_template_data } from "$lib/templating";

	export let source: string;
</script>

<Markdown
	source={insert_template_data(source, { config })}
	components={{ heading: Heading }}
	class="text-base text-text-tertiary mx-auto w-full px-[16px] py-[68px] max-w-[648px]"
/>
