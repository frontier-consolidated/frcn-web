<script lang="ts">
	import { goto } from "$app/navigation";
	import { strings } from "@frcn/shared";
	import { Breadcrumb, BreadcrumbItem, Button, Card, Heading, Pagination, TabItem, Tabs, Timeline, TimelineItem } from "flowbite-svelte";
	import { CalendarMonthSolid, CirclePlusSolid } from "flowbite-svelte-icons";

	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import LocationBreadcrumbItem from "$lib/components/location/LocationBreadcrumbItem.svelte";
	import { Mutations, apollo } from "$lib/graphql";
	import { pushNotification } from "$lib/stores/NotificationStore";

	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<svelte:head>
	<title>Events</title>
	<meta name="description" content="Frontier Consolidated - Search Events" />
</svelte:head>

<Heading tag="h3">Events</Heading>
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

<Tabs contentClass="p-4" style="underline">
	<TabItem title="Timeline" open>
		<div class="flex flex-col items-center">
			<Timeline class="w-full">
				{#each data.events as event}
					<TimelineItem>
						<div class="mb-2">
							<TimeBadge id="test-event-time" format="datetime-relative" value={event.startAt ?? 0} />
						</div>
						<Card
							img={event.imageUrl ?? undefined}
							horizontal
							class="w-full !max-w-none"
							padding="none"
							href="/event/{event.id}"
						>
							<div class="flex flex-col gap-2 px-4 py-2">
								<span class="text-xl font-semibold dark:text-white">
									{event.name}
									<Breadcrumb
										ariaLabel="Event Type and Location"
										olClass="inline-flex flex-wrap items-center space-x-1 md:space-x-3 rtl:space-x-reverse"
									>
										{#if event.eventType}
											<BreadcrumbItem home>
												<svelte:fragment slot="icon">
													<CalendarMonthSolid class="w-4 h-4 me-2" />
												</svelte:fragment>
												{strings.toTitleCase(event.eventType)} Event
											</BreadcrumbItem>
										{/if}
										{#if event.location}
											{#each event.location as item}
												<LocationBreadcrumbItem location={item} />
											{/each}
										{:else}
											<BreadcrumbItem>???</BreadcrumbItem>
										{/if}
									</Breadcrumb>
								</span>
								<div>
									<span class="block text-md font-semibold dark:text-white">
										Summary
									</span>
									<span class="dark:text-gray-400">
										{event.summary}
									</span>
								</div>
							</div>
						</Card>
					</TimelineItem>
				{/each}
			</Timeline>
			<Pagination pages={[
				{ name: `${data.page + 1}`, href: `/events?page=${data.page}` },
				{ name: `${data.page + 2}`, href: `/events?page=${data.page}` }
			]} />
		</div>
	</TabItem>
	<TabItem title="Calendar">
		
	</TabItem>
</Tabs>
