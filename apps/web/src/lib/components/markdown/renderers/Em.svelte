<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Em | Tokens.Generic;
	token;
</script>

<em>
	<slot />
</em>
