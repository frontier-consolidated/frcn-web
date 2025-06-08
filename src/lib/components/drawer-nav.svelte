<script lang="ts">
	import type { Component, ComponentType, SvelteComponentTyped } from "svelte";
	import { twMerge } from "tailwind-merge";

	import { page } from "$app/state";

	import Button from "./ui/button.svelte";

	export type Item = {
		name: string;
		href: string;
		image?: { src: string; alt: string };
		Icon?: Component | ComponentType<SvelteComponentTyped>;
		isActive?: (url: URL) => boolean;
	};

	export type SectionTitle = {
		title: string;
	};

	let { items, class: className }: { items: (SectionTitle | Item)[]; class?: string } = $props();
</script>

<nav class={twMerge("flex flex-col gap-1.5 px-6", className)}>
	{#each items as item ("title" in item ? `section:${item.title}` : `${item.name}:${item.href}`)}
		{#if "title" in item}
			<span class="pt-5 text-sm font-medium">{item.title}</span>
		{:else}
			{@const active = item.isActive ? item.isActive(page.url) : page.url.pathname === item.href}
			{#snippet buttonIcon(cls: string)}
				{#if item.image}
					<img src={item.image.src} class={cls} alt={item.image.alt} />
				{:else if item.Icon}
					<item.Icon class={cls} />
				{/if}
			{/snippet}
			<Button
				href={item.href}
				icon={buttonIcon}
				color={active ? "secondary" : "ghost"}
				corners="none small"
			>
				<span class="line-clamp-1 font-medium">{item.name}</span>
			</Button>
		{/if}
	{/each}
</nav>
