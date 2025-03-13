<script lang="ts">
	import type { Tokens } from "marked";
	import { twMerge } from "tailwind-merge";

	import Checkbox from "$lib/ui/checkbox.svelte";
	import { List } from "$lib/ui/list";

	export let token: Tokens.ListItem | Tokens.Generic;
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	token;
</script>

<List.Item class={twMerge("relative", token.task && "list-none")}>
	{#if token.task}
		<Checkbox disabled checked={token.checked} class="absolute top-1 right-[calc(100%+0.5rem)]" />
	{/if}
	<slot />
</List.Item>
