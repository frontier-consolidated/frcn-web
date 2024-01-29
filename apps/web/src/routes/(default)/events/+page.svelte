<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Button, Heading, TabItem, Tabs, Search } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";
	import { queryParam } from "sveltekit-search-params"

	import { Mutations, getApollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import EventsTimeline from "./EventsTimeline.svelte";

	export let data: PageData;

	const search = queryParam("q")
</script>

<svelte:head>
	<title>Events</title>
	<meta name="description" content="Frontier Consolidated - Search Events" />
</svelte:head>

<Heading tag="h3">Events</Heading>
<section class="flex flex-col gap-2 mt-4">
	<div>
		<div class="flex flex-col sm:flex-row gap-2">
			<Search size="md" placeholder="Search by name" class="flex-1 sm:w-96" bind:value={$search} />
			{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
				<Button
					class="self-end sm:shrink-0"
					on:click={async () => {
						try {
							const { data: createData } = await getApollo().mutate({
								mutation: Mutations.CREATE_EVENT,
							});
				
							if (createData && createData.event) {
								goto(`/event/${createData.event}`);
							}
						} catch (err) {
							pushNotification({
								type: "error",
								message: "Failed to create event"
							})
							console.log(err)
						}
					}}
				>
					<CirclePlusSolid class="me-2" /> Create New Event
				</Button>
			{/if}
		</div>
	</div>
	<Tabs contentClass="p-4" style="underline">
		<TabItem title="Timeline" open={$page.url.hash !== "#calendar"} on:click={() => window.location.hash = "#timeline"}>
			<EventsTimeline {data} />
		</TabItem>
		<TabItem title="Calendar" open={$page.url.hash === "#calendar"} on:click={() => window.location.hash = "#calendar"}>
			
		</TabItem>
	</Tabs>
</section>
