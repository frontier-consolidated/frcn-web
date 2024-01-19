<script lang="ts">
	import { Blockquote } from "flowbite-svelte";
	import type { Tokens } from "marked";
	import BreakFix from "./BreakFix.svelte";

	export let token: Tokens.Blockquote | Tokens.Generic;
	token;
</script>

<Blockquote size="base" italic={false} border class="px-4 pb-2 font-normal dark:text-inherit">
	<slot />
</Blockquote>
<BreakFix {token} />
