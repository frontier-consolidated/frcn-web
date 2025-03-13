<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Blockquote | Tokens.Generic;
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	token;
</script>

<blockquote
	class="font-normal text-left text-inherit mb-4 px-4 py-2 border-s-4 border-muted [&_p]:mb-0"
>
	<slot />
</blockquote>
