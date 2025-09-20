<script lang="ts">
	import MediaQuery from "./MediaQuery.svelte";

	const sizes = {
		sm: "640px",
		md: "768px",
		lg: "1024px",
		xl: "1280px",
		"2xl": "1536px"
	};

	export let size: keyof typeof sizes;
</script>

<MediaQuery query="(min-width: {sizes[size]})" let:matches>
	<slot {matches} />
</MediaQuery>
