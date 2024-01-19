<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Codespan | Tokens.Generic;
</script>

<code class="rounded p-px dark:bg-gray-700">
	{token.text}
</code>
