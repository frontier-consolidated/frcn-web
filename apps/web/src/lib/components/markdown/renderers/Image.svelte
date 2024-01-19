<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Image | Tokens.Generic;
</script>

<img src={token.href} title={token.title} alt={token.text} />
