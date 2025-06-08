<script lang="ts">
	import { ChevronDownIcon } from "lucide-svelte";
	import { Popover } from "melt/builders";
	import { twMerge } from "tailwind-merge";

	import { page } from "$app/state";

	import type { NavItem } from "./nav-list.svelte";

	let { items }: { items: NavItem[] } = $props();

	const popover = new Popover({
		floatingConfig: {
			computePosition: {
				placement: "bottom-end",
				strategy: "absolute"
			},
			offset: {
				mainAxis: 36,
				crossAxis: 16
			},
			sameWidth: false
		}
	});
</script>

<button
	{...popover.trigger}
	class="more-button flex cursor-pointer items-center gap-1 opacity-90 transition-opacity hover:opacity-100"
>
	<span class="font-medium">More</span>
	<ChevronDownIcon
		class={twMerge("size-5 transition-transform", popover.open && "rotate-180")}
		strokeWidth="3"
	/>
</button>
<ul
	{...popover.content}
	class="bg-background border-border overflow-hidden rounded-[3px] border-1 border-t-0"
>
	{#each items as item (item.href)}
		{@const active = item.isActive ? item.isActive(page.url) : page.url.pathname === item.href}
		<a
			href={item.href}
			class="group/nav-item text-text block bg-white/0 px-2 py-1.5 hover:bg-white/5"
		>
			<div class="w-fit">
				<span class="font-medium">{item.name}</span>
				<div
					class={twMerge(
						"bg-text/90 h-[2px] transition-all group-hover/nav-item:w-full",
						active ? "w-full" : "w-[14px]"
					)}
				></div>
			</div>
		</a>
	{/each}
</ul>

<style>
	@media (scripting: none) {
		.more-button {
			display: none;
		}
	}
</style>
