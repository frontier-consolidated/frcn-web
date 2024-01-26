<script lang="ts">
	import { List } from "flowbite-svelte";
	import type { Tokens } from "marked";

	export let token: Tokens.List | Tokens.Generic;
	$: start = token.start as number;
</script>

{#if token.ordered}
	<List tag="ol" {start}>
		<slot />
	</List>
{:else}
	<List tag="ul">
		<slot />
	</List>
{/if}
