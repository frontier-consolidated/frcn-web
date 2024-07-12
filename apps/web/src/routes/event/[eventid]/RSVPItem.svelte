<script lang="ts">
	import { Input, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { DatabaseSolid, TrashBinSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import { EmojiPickerInput, Field, FieldValidator } from "$lib/components";
	import type { Emoji } from "$lib/components/emoji/types";

	import type { PageData } from "./$types";

	const INFINITY = "∞";

	export let data: PageData;
	export let roles: PageData["rsvpRoles"];
	export let role: PageData["rsvpRoles"][number];
	export let validator: FieldValidator;

	let edit_role = structuredClone(role);

	function update_role(edit: PageData["rsvpRoles"][number]) {
		const index = roles.findIndex(r => r.id === role.id);
		const updated_roles = [...roles.filter((r) => r.id != role.id)];
		updated_roles.splice(index, 0, edit);
		roles = updated_roles;
		role = edit;
		return structuredClone(role);
	}

	$: {
		if (
			role.name !== edit_role.name ||
			role.limit !== edit_role.limit ||
			role.emoji.id !== edit_role.emoji.id
		) {
			edit_role = update_role(edit_role);
		}
	}

	let emoji_input: Emoji | null;
	$: {
		if (emoji_input) {
			const id = emoji_input.id ?? emoji_input.name;
			if (id != edit_role.emoji.id) {
				edit_role.emoji = {
					id,
					name: emoji_input.name,
					image: emoji_input.imageUrl,
				};
				edit_role = update_role(edit_role);
			}
		}
	}
	$: additionalEmojis = data.options?.emojis
		? (data.options.emojis.emojis.map((emoji) => ({
				id: emoji.id,
				name: emoji.name,
				names: [emoji.name],
				imageUrl: emoji.image,
				category: data.options!.emojis.serverName.toLowerCase(),
			})) as Emoji[])
		: [];

	let limit_input = edit_role.limit == 0 ? INFINITY : `${edit_role.limit}`;
</script>

<TableBodyRow>
	<TableBodyCell class="text-center">
		<EmojiPickerInput init={edit_role.emoji.id} {additionalEmojis} categoryIcons={data.options?.emojis ? {
			[data.options.emojis.serverName.toLowerCase()]: data.options.emojis.serverAvatar ?? DatabaseSolid
		} : undefined} bind:value={emoji_input} />
	</TableBodyCell>
	<TableBodyCell>
		<Field {validator} for="role-name-{role.id}" value={edit_role.name} required>
			<Input
				id="role-name-{role.id}"
				name="event-role-name"
				class="!bg-transparent !border-transparent !p-1 text-ellipsis rounded"
				placeholder="Role name"
				maxlength="255"
				bind:value={edit_role.name}
			/>
		</Field>
	</TableBodyCell>
	<TableBodyCell class="text-center">
		<Input
			id="role-user-limit-{role.id}"
			name="event-role-user-limit"
			min="0"
			pattern="([0-9]+|{INFINITY})"
			class="!bg-transparent !border-transparent !p-1 no-inner-spin text-center rounded"
			bind:value={limit_input}
			on:blur={() => {
				let num = Number(limit_input);
				if (isNaN(num)) num = 0;
				num = Math.floor(Math.max(0, num));

				if (num == 0) {
					limit_input = INFINITY;
					edit_role.limit = 0;
				} else {
					limit_input = `${num}`;
					edit_role.limit = num;
				}
			}}
			on:keydown={(ev) => {
				let num = Number(limit_input);
				if (isNaN(num)) num = 0;

				let update = false;
				if (ev.key == "ArrowDown") {
					num--;
					update = true;
				} else if (ev.key == "ArrowUp") {
					num++;
					update = true;
				}

				if (update) limit_input = `${Math.floor(Math.max(0, num))}`;
			}}
		/>
	</TableBodyCell>
	<TableBodyCell>
		<div class="flex items-center justify-center">
			<TrashBinSolid
				aria-disabled={roles.length <= 1}
				class={twMerge("dark:text-white dark:hover:text-red-600", roles.length <= 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
				on:click={() => {
					if (roles.length <= 1) return;
					roles = roles.filter((r) => r.id != role.id);
				}}
			/>
		</div>
	</TableBodyCell>
</TableBodyRow>
