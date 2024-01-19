<script lang="ts">
	import type { Tokens } from "marked";

	export let slice = 1;
	export let token: Tokens.Generic;
	$: newlines = Array.from(token.raw.replace(/.+(?=[\n\r]+)$/, "").matchAll(/[\n\r]/g)).slice(
		slice
	);
</script>

{#each newlines as _}
	<br />
{/each}
