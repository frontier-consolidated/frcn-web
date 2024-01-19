<script lang="ts">
	import { Heading } from "flowbite-svelte";
	import type { Tokens } from "marked";

	export let token: Tokens.Heading | Tokens.Generic;
</script>

{#if token.depth === 1}
	<Heading tag="h1">
		<slot />
	</Heading>
{:else if token.depth === 2}
	<Heading tag="h2">
		<slot />
	</Heading>
{:else if token.depth === 3}
	<Heading tag="h3">
		<slot />
	</Heading>
{:else if token.depth === 4}
	<Heading tag="h4">
		<slot />
	</Heading>
{:else if token.depth === 5}
	<Heading tag="h5">
		<slot />
	</Heading>
{:else if token.depth === 6}
	<Heading tag="h6">
		<slot />
	</Heading>
{/if}
