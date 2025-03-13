<script lang="ts">
	import type { Tokens } from "marked";
	import { tv } from "tailwind-variants";

	const variants = tv({
		base: "font-heading my-[8px] text-white",
		variants: {
			tag: {
				h1: "text-[32px]",
				h2: "text-[28px]",
				h3: "text-[24px]",
				h4: "text-[20px]",
				h5: "text-[16px]",
				h6: "text-[14px]"
			}
		},
		defaultVariants: {
			tag: "h1"
		}
	});

	const headings = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

	export let token: Tokens.Heading | Tokens.Generic;

	$: tag = headings[token.depth + 1] as (typeof headings)[number];
</script>

<svelte:element this={tag} class={variants({ tag })}>
	<slot />
</svelte:element>
