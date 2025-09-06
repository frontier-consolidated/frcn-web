<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell } from "flowbite-svelte";
	import { v4 as uuidv4 } from "uuid";

	import { Tooltip, type FieldValidator, Button } from "$lib/components";

	import type { PageData } from "./$types";
	import RsvpItem from "./RSVPItem.svelte";

	export let data: PageData;
	export let value: PageData["rsvpRoles"] = [];
	export let validator: FieldValidator;
</script>

<Table divClass="relative" {...$$restProps}>
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
				<RsvpItem {validator} {data} bind:roles={value} {role} />
			{/key}
		{/each}
	</TableBody>
</Table>
<div class="flex w-full items-center justify-center p-2">
	<Button
		on:click={() => {
			value = [
				...value,
				{
					id: uuidv4(),
					name: "",
					emoji: {
						id: "white_check_mark",
						name: "white_check_mark"
					},
					limit: 0
				}
			];
		}}>Add Role</Button
	>
</div>
