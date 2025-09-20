<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Strong | Tokens.Generic;
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	token;
</script>

<strong>
	<slot />
</strong>
