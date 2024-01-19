<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Space | Tokens.Generic;
	$: newlines = Array.from(token.raw.replace(/^[\n\r]/, "").matchAll(/[\n\r]/g));
</script>

{#each newlines as _}
	<br />
{/each}<slot />
