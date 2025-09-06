<script lang="ts">
	import { getChildren, locations, searchLocations } from "@frcn/shared/locations";
	import type { AnyLocation } from "@frcn/shared/locations";
	import { Input, Modal } from "flowbite-svelte";
	import { SearchSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import Button from "../Button.svelte";
	import LocationIcon from "./LocationIcon.svelte";

	export let value: AnyLocation[] = [];
	export let open: boolean = false;

	let selectedValue: AnyLocation[] = [...value];

	let searchInput = "";
	$: searchResults = searchInput ? searchLocations(searchInput) : [];

	let uls: HTMLUListElement[] = [];
	function initUl(ul: HTMLUListElement, index: number) {
		uls[index] = ul;
		ul.scrollIntoView({
			inline: "end"
		});
	}

	function initLi(li: HTMLLIElement, selected: boolean) {
		if (selected) {
			li.scrollIntoView({
				block: "center",
				inline: "center"
			});
		}
	}
</script>

<Modal
	size="lg"
	bodyClass="px-2 py-2"
	bind:open
	on:close={() => {
		selectedValue = [...value];
	}}
>
	<svelte:fragment slot="header">
		<div class="flex w-full items-center justify-end px-4">
			<div class="max-w-xs">
				<Input bind:value={searchInput} placeholder="Search...">
					<SearchSolid slot="left" size="sm" class="ms-1" tabindex="-1" />
				</Input>
			</div>
		</div>
	</svelte:fragment>
	{#if searchInput}
		<ul class="flex h-96 w-full flex-col gap-1 overflow-y-auto">
			{#each searchResults as location}
				{@const selected = selectedValue.at(-1) === location.path.at(-1)}
				<li>
					{#key location}
						<button
							class={twMerge(
								"flex w-full items-center p-3 text-left text-white hover:bg-gray-700",
								selected && "bg-primary-700 hover:bg-primary-600"
							)}
							on:click={() => {
								selectedValue = [...location.path];
							}}
						>
							<LocationIcon {location} />
							<span>{location.name}</span>
						</button>
					{/key}
				</li>
			{/each}
		</ul>
	{:else}
		<div class="flex h-96 w-full gap-1 overflow-x-scroll">
			{#each new Array(Math.max(3, selectedValue.length + 1)) as _, i}
				{@const selectable =
					i === 0
						? locations
						: selectedValue[i - 1]
							? (getChildren(selectedValue[i - 1]) ?? [])
							: []}
				{#if i < 3 || selectable.length}
					<ul
						class="flex w-full min-w-[15rem] max-w-[18rem] flex-col overflow-y-auto rounded bg-gray-900"
						use:initUl={i}
					>
						{#each selectable as location}
							{@const selected = selectedValue[i] === location}
							<li use:initLi={selected}>
								{#key location}
									<button
										class={twMerge(
											"flex w-full items-center p-3 text-left text-white hover:bg-gray-700",
											selected && "bg-primary-700 hover:bg-primary-600"
										)}
										on:click={() => {
											selectedValue = [...selectedValue.slice(0, i), location];
										}}
									>
										<LocationIcon {location} />
										<span>{location.name}</span>
									</button>
								{/key}
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		</div>
	{/if}
	<svelte:fragment slot="footer">
		<Button color="alternative" on:click={() => (open = false)}>Cancel</Button>
		<Button
			on:click={async () => {
				value = [...selectedValue];
				open = false;
			}}
		>
			Confirm
		</Button>
	</svelte:fragment>
</Modal>
