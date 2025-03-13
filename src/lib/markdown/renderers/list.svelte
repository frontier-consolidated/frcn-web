<script lang="ts">
	import type { Tokens } from "marked";

	import { List } from "$lib/ui/list";

	export let token: Tokens.List | Tokens.Generic;
	$: start = token.start as number;
</script>

{#if token.ordered}
	<List.Root tag="ol" {start} class="mb-4">
		<slot />
	</List.Root>
{:else}
	<List.Root tag="ul" class="mb-4">
		<slot />
	</List.Root>
{/if}
