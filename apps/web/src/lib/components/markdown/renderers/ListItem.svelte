<script lang="ts">
	import { Li } from "flowbite-svelte";
	import type { Tokens } from "marked";

	export let token: Tokens.ListItem | Tokens.Generic;
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	token;
</script>

<Li>
	<slot />
</Li>
