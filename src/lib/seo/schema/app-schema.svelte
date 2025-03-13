<script lang="ts">
	import Schema from "./schema.svelte";

	import { config } from "$lib/config";
</script>

<Schema
	data={{
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: config.name,
		description: config.meta.description,
		url: `https://${config.domain}/`,
		author: config.creator,
		datePublished: config.meta.publish_date,
		applicationCategory: config.meta.app_category
	}}
/>
