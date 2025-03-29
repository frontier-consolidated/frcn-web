<script lang="ts">
	import { onMount } from "svelte";
	import { twMerge } from "tailwind-merge";

	import MoreButton from "./more-button.svelte";

	import { page } from "$app/state";

	export type NavItem = { name: string; href: string; isActive?: (url: URL) => boolean };

	let { items, class: className }: { items: NavItem[]; class?: string } = $props();

	let showMore = $state(true);
	let moreItems = $state<NavItem[]>([]);
	let navList: HTMLUListElement;

	function toggleMoreButton() {
		if (!navList) return;

		if (navList.scrollHeight <= navList.clientHeight) {
			moreItems = [];
			showMore = false;
			return;
		}

		let hiddenStartIndex = -1;

		const itemElements = Array.from(navList.querySelectorAll("li a")) as HTMLAnchorElement[];
		for (let i = 0; i < itemElements.length; i++) {
			const itemEl = itemElements[i];
			const offset = itemEl.offsetTop - navList.offsetTop;

			const visible = offset < navList.offsetHeight;
			if (!visible && hiddenStartIndex === -1) {
				hiddenStartIndex = i;
			}

			itemEl.tabIndex = visible ? 0 : -1;
		}

		if (hiddenStartIndex !== -1) {
			const hiddenItems = items.slice(hiddenStartIndex);
			if (hiddenItems.length !== moreItems.length) {
				moreItems = hiddenItems;
				showMore = !!hiddenItems.length;
			}
		}
	}

	function initNavList(el: HTMLUListElement) {
		navList = el;
		toggleMoreButton();
	}

	onMount(() => {
		window.addEventListener("resize", toggleMoreButton);
		toggleMoreButton();
		return () => {
			window.removeEventListener("resize", toggleMoreButton);
		};
	});
</script>

<ul
	use:initNavList
	class={twMerge(
		"flex justify-end items-start flex-wrap gap-x-8 gap-y-1.5 h-[26px] overflow-hidden",
		className
	)}
>
	{#each items as item (item.href)}
		{@const active = item.isActive ? item.isActive(page.url) : page.url.pathname === item.href}
		<li>
			<a
				href={item.href}
				class={twMerge(
					"group/nav-item hover:opacity-100 transition-opacity",
					active ? "opacity-100" : "opacity-90"
				)}
			>
				<span class="font-medium">{item.name}</span>
				<div
					class={twMerge(
						"bg-text/90 h-[2px] group-hover/nav-item:w-full transition-all",
						active ? "w-full" : "w-[14px]"
					)}
				></div>
			</a>
		</li>
	{/each}
</ul>
{#if showMore}
	<MoreButton items={moreItems} />
{/if}
