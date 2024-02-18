<script lang="ts">
	import { List } from "flowbite-svelte";
	import type { Tokens } from "marked";

	export let token: Tokens.List | Tokens.Generic;
	$: start = token.start as number;
</script>

{#if token.ordered}
	<List tag="ol" {start} position="outside" class="pl-4">
		<slot />
	</List>
{:else}
	<List tag="ul" position="outside" class="pl-4">
		<slot />
	</List>
{/if}
