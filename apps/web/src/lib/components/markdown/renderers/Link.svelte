<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Link | Tokens.Generic;
</script>

<a href={token.href} title={token.title}>
	<slot />
</a>
