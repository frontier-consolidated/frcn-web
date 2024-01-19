<script lang="ts">
	import type { Tokens } from "marked";
	import { Li } from "flowbite-svelte";

	export let token: Tokens.ListItem | Tokens.Generic;
	token;
</script>

<Li>
	<slot />
</Li>
