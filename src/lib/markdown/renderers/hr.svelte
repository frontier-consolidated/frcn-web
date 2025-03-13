<script lang="ts">
	import type { Tokens } from "marked";

	import Separator from "$lib/ui/separator.svelte";

	export let token: Tokens.Hr | Tokens.Generic;
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	token;
</script>

<Separator class="my-4" decorative={false} />
<slot />
