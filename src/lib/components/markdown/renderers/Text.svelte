<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Text | Tokens.Generic;
	token;
</script>

<slot />
