<script lang="ts">
	import type { Tokens } from "marked";

	import Link from "$lib/ui/link.svelte";

	export let token: Tokens.Link | Tokens.Generic;
</script>

<Link
	href={token.href}
	title={token.title}
	target={token.href.startsWith("http") ? "_blank" : undefined}
	class="break-all"
>
	<slot />
</Link>
