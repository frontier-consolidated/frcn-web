<script lang="ts">
	import { Button, Card, Heading, Timeline, TimelineItem } from "flowbite-svelte";
	import { CirclePlusSolid } from "flowbite-svelte-icons";
	import TimeBadge from "$lib/components/datetime/TimeBadge.svelte";
	import { Mutations, apollo } from "$lib/graphql";
	import { goto } from "$app/navigation";
</script>

<svelte:head>
	<title>Events</title>
	<meta name="description" content="Frontier Consolidated - Search Events" />
</svelte:head>

<Heading tag="h3">Events</Heading>
<div class="flex justify-end">
	<Button
		on:click={async () => {
			const { data, errors } = await apollo.mutate({
				mutation: Mutations.CREATE_EVENT,
			});

			if (data && data.event) {
				goto(`/event/${data.event}`);
			}
		}}
	>
		<CirclePlusSolid class="me-2" /> Create New Event
	</Button>
</div>
<Timeline>
	<TimelineItem>
		<div class="mb-2">
			<TimeBadge id="test-event-time" format="datetime" value={1705853606000} />
		</div>
		<Card
			img="https://cdn.discordapp.com/attachments/1172594075300544582/1195683385310449684/EventImage3.png?ex=65be1c6d&is=65aba76d&hm=6bc06d24e2a84c45cd493b96c37d9f0c2e4741f29ab49ad00ee9637f9141c7d0&"
			horizontal
			class="w-full !max-w-none"
		></Card>
	</TimelineItem>
</Timeline>
