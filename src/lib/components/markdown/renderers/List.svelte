<script lang="ts">
	import type { Tokens } from "marked";
	import { List } from "flowbite-svelte";

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
