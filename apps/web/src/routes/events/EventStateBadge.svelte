<script lang="ts">
	import { Badge, Indicator } from "flowbite-svelte";

	import { EventState } from "$lib/graphql/__generated__/graphql";

	export let large = true;
	export let event: { state: EventState; posted: boolean };
</script>

{#if event.state === EventState.Started}
	<Badge {large} color="green" class="px-2.5 py-0.5">
		<Indicator color="green" size="xs" class="relative me-2">
			<Indicator color="green" size="xs" class="absolute left-0 top-0 animate-ping" />
		</Indicator>
		Started
	</Badge>
{:else if event.state === EventState.Ended}
	<Badge {large} color="red" class="px-2.5 py-0.5">Ended</Badge>
{:else if event.state === EventState.Archived}
	<Badge {large} color="dark" class="px-2.5 py-0.5">Archived</Badge>
{:else if !event.posted}
	<Badge {large} color="blue" class="px-2.5 py-0.5">Draft</Badge>
{/if}
