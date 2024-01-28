<script lang="ts">
	import { goto } from "$app/navigation";
	import { Permission, hasPermission } from "@frcn/shared";
	import { Button, Heading, TabItem, Tabs } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";

	import { Mutations, apollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";
	import { user } from "$lib/stores/UserStore";

	import type { PageData } from "./$types";
	import EventsTimeline from "./EventsTimeline.svelte";

	export let data: PageData;
</script>

<svelte:head>
	<title>Events</title>
	<meta name="description" content="Frontier Consolidated - Search Events" />
</svelte:head>

<Heading tag="h3">Events</Heading>
{#if hasPermission($user.data?.permissions ?? 0, Permission.CreateEvents)}
	<div class="flex justify-end">
		<Button
			on:click={async () => {
				try {
					const { data: createData } = await apollo.mutate({
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
	</div>
{/if}

<Tabs contentClass="p-4" style="underline">
	<TabItem title="Timeline" open>
		<EventsTimeline {data} />
	</TabItem>
	<TabItem title="Calendar">
		
	</TabItem>
</Tabs>
