<script lang="ts">
	import type { RSVPRole } from "$lib/data/types";
	import { Input, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { TrashBinSolid } from "flowbite-svelte-icons";

	const INFINITY = "∞";

	export let roles: RSVPRole[];
	export let role: RSVPRole;

	let limitInput = role.limit == 0 ? INFINITY : `${role.limit}`;
</script>

<TableBodyRow>
	<TableBodyCell class="text-center">🚀</TableBodyCell>
	<TableBodyCell>
		<Input
			class="!bg-transparent !border-transparent !p-1 text-ellipsis"
			placeholder="Role name"
			bind:value={role.name}
		/>
	</TableBodyCell>
	<TableBodyCell class="text-center">
		<Input
			min="0"
			pattern="([0-9]+|{INFINITY})"
			class="!bg-transparent !border-transparent !p-1 no-inner-spin text-center"
			bind:value={limitInput}
			on:blur={() => {
				console.log("blur");
				let num = Number(limitInput);
				if (isNaN(num)) num = 0;
				num = Math.floor(Math.max(0, num));

				if (num == 0) {
					limitInput = INFINITY;
					role.limit = 0;
				} else {
					limitInput = `${num}`;
					role.limit = num;
				}
			}}
			on:keydown={(ev) => {
				console.log("key", ev.key);
				let num = Number(limitInput);
				if (isNaN(num)) num = 0;

				let update = false;
				if (ev.key == "ArrowDown") {
					num--;
					update = true;
				} else if (ev.key == "ArrowUp") {
					num++;
					update = true;
				}

				if (update) limitInput = `${Math.floor(Math.max(0, num))}`;
			}}
		/>
	</TableBodyCell>
	<TableBodyCell>
		<div class="flex items-center justify-center">
			<TrashBinSolid
				class="cursor-pointer dark:text-white dark:hover:text-red-600"
				on:click={() => {
					roles = roles.filter((r) => r.id != role.id);
				}}
			/>
		</div>
	</TableBodyCell>
</TableBodyRow>
