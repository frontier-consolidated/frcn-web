<script lang="ts">
	import { ChevronDownIcon } from "lucide-svelte";
	import { Popover } from "melt/builders";
	import { twMerge } from "tailwind-merge";

	import type { NavItem } from "./nav-list.svelte";

	import { page } from "$app/state";

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
	class="more-button flex gap-1 items-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
>
	<span class="font-medium">More</span>
	<ChevronDownIcon
		class={twMerge("size-5 transition-transform", popover.open && "rotate-180")}
		strokeWidth="3"
	/>
</button>
<ul
	{...popover.content}
	class="bg-background rounded-[3px] border-1 border-t-0 border-border overflow-hidden"
>
	{#each items as item (item.href)}
		{@const active = item.isActive ? item.isActive(page.url) : page.url.pathname === item.href}
		<a
			href={item.href}
			class="group/nav-item block px-2 py-1.5 text-text bg-white/0 hover:bg-white/5"
		>
			<div class="w-fit">
				<span class="font-medium">{item.name}</span>
				<div
					class={twMerge(
						"bg-text/90 h-[2px] group-hover/nav-item:w-full transition-all",
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
