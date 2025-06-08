<script lang="ts">
	import { config } from "$lib/config";

	import Schema from "./schema.svelte";
</script>

<Schema
	data={{
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: config.name,
		description: config.meta.description,
		url: `https://${config.domain}/`,
		author: config.creator,
		datePublished: config.meta.publishDate,
		applicationCategory: config.meta.appCategory
	}}
/>
