<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Strong | Tokens.Generic;
	token;
</script>

<strong>
	<slot />
</strong>
