<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let { children, href, ...rest }: { children: Snippet } & HTMLAnchorAttributes = $props();
</script>

<a
	{href}
	target={href?.startsWith("http") ? "_blank" : undefined}
	class="text-text-link hover:underline"
	{...rest}
>
	{@render children()}
</a>
