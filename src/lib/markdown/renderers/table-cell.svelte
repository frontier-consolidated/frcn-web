<!-- <script lang="ts">
	import type { Tokens } from "marked";

	import * as Table from "$lib/components/ui/table";

	export let align: "left" | "center" | "right" | null | undefined;
	export let token: Tokens.TableCell | Tokens.Generic;
	export let header = false;
	token;
</script>

{#if header}
	<Table.Head align={align ?? undefined}>
		<slot />
	</Table.Head>
{:else}
	<Table.Cell align={align ?? undefined}>
		<slot />
	</Table.Cell>
{/if} -->
