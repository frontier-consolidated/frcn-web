<script lang="ts">
	import { Input, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import type { PageData } from "./$types";
	import EmojiPickerInput from "$lib/components/emoji/EmojiPickerInput.svelte";
	import type { Emoji } from "$lib/components/emoji/types";

	const INFINITY = "∞";

	export let data: PageData;
	export let roles: PageData["roles"];
	export let role: PageData["roles"][number];
	let editRole = structuredClone(role);

	function updateRole(edit: PageData["roles"][number]) {
		roles = [...roles.filter((r) => r.id != role.id), edit];
		role = edit;
		return structuredClone(role);
	}

	$: {
		if (
			role.name !== editRole.name ||
			role.limit !== editRole.limit ||
			role.emoji.id !== editRole.emoji.id
		) {
			editRole = updateRole(editRole);
		}
	}

	let emojiInput: Emoji | null;
	$: {
		if (emojiInput) {
			const id = emojiInput.id ?? emojiInput.name;
			if (id != editRole.emoji.id) {
				editRole.emoji = {
					id,
					name: emojiInput.name,
					image: emojiInput.imageUrl,
				};
				editRole = updateRole(editRole);
			}
		}
	}
	$: additionalEmojis = data.options?.emojis
		? (data.options?.emojis.map((emoji) => ({
				id: emoji.id,
				name: emoji.name,
				names: [emoji.name],
				imageUrl: emoji.image,
				category: "custom",
			})) as Emoji[])
		: [];

	let limitInput = editRole.limit == 0 ? INFINITY : `${editRole.limit}`;
</script>

<TableBodyRow>
	<TableBodyCell class="text-center">
		<EmojiPickerInput init={editRole.emoji.id} {additionalEmojis} bind:value={emojiInput} />
	</TableBodyCell>
	<TableBodyCell>
		<Input
			name="Event Role Name"
			class="!bg-transparent !border-transparent !p-1 text-ellipsis"
			placeholder="Role name"
			bind:value={editRole.name}
		/>
	</TableBodyCell>
	<TableBodyCell class="text-center">
		<Input
			name="Event Role User Limit"
			min="0"
			pattern="([0-9]+|{INFINITY})"
			class="!bg-transparent !border-transparent !p-1 no-inner-spin text-center"
			bind:value={limitInput}
			on:blur={() => {
				let num = Number(limitInput);
				if (isNaN(num)) num = 0;
				num = Math.floor(Math.max(0, num));

				if (num == 0) {
					limitInput = INFINITY;
					editRole.limit = 0;
				} else {
					limitInput = `${num}`;
					editRole.limit = num;
				}
			}}
			on:keydown={(ev) => {
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
				aria-disabled={roles.length <= 1}
				class="{roles.length <= 1
					? 'cursor-not-allowed opacity-50'
					: 'cursor-pointer'} dark:text-white dark:hover:text-red-600"
				on:click={() => {
					if (roles.length <= 1) return;
					roles = roles.filter((r) => r.id != role.id);
				}}
			/>
		</div>
	</TableBodyCell>
</TableBodyRow>