<script lang="ts">
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { Table, TableBody, TableHead, TableHeadCell, Button } from "flowbite-svelte";
	import RsvpItem from "./RSVPItem.svelte";
	import type { RSVPRole } from "$lib/data/types";

	export let value: RSVPRole[] = [];
</script>

<Table>
	<TableHead>
		<TableHeadCell class="w-16">
			<div class="flex items-center">
				Emoji <Tooltip id="rsvp-emoji-info" class="normal-case">
					The discord emoji used to represent this RSVP role
				</Tooltip>
			</div>
		</TableHeadCell>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell class="w-32">
			<div class="flex items-center">
				Limit <Tooltip id="rsvp-limit-info" class="normal-case">
					The maximum number of users that can RSVP for this role
				</Tooltip>
			</div>
		</TableHeadCell>
		<TableHeadCell class="w-16"></TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each value as role}
			{#key role.id}
				<RsvpItem bind:roles={value} {role} />
			{/key}
		{/each}
	</TableBody>
</Table>
<div class="flex items-center justify-center p-2 w-full">
	<Button
		on:click={() => {
			const id = crypto.randomUUID();
			value = [
				...value,
				{
					id,
					name: "",
					limit: 0,
				},
			];
		}}>Add Role</Button
	>
</div>
