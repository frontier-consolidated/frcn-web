<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Codespan | Tokens.Generic;
</script>

<code class="rounded-md px-1 py-0.5 bg-muted whitespace-break-spaces">{token.text}<slot /></code>
