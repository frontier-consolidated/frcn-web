<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Paragraph | Tokens.Generic;
	token;
</script>

<p>
	<slot />
</p>
