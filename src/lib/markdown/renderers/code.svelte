<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Code | Tokens.Generic;
</script>

<pre
	class="language-{token.lang} block mb-4 p-4 w-full border bg-muted/20 rounded whitespace-break-spaces">
	<code>{token.text}<slot /></code>
</pre>
