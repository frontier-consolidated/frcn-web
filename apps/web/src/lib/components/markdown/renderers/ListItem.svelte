<script lang="ts">
	import { Li } from "flowbite-svelte";
	import type { Tokens } from "marked";

	export let token: Tokens.ListItem | Tokens.Generic;
	token;
</script>

<Li>
	<slot />
</Li>
