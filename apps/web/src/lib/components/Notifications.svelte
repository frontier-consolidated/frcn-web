<script lang="ts">
	import { Toast } from "flowbite-svelte";
	import { ExclamationCircleSolid } from "flowbite-svelte-icons";

	import {
		notifications,
		type Notification,
		dropNotification,
	} from "$lib/stores/NotificationStore";

	function getColor(
		type: Notification["type"]
	):
		| "gray"
		| "red"
		| "yellow"
		| "green"
		| "indigo"
		| "purple"
		| "blue"
		| "primary"
		| "orange"
		| "none" {
		switch (type) {
			case "error":
				return "red";
		}
	}

	function getIcon(type: Notification["type"]) {
		switch (type) {
			case "error":
				return ExclamationCircleSolid;
		}
	}
</script>

<div id="notifications" class="fixed flex flex-col-reverse gap-2 bottom-0 left-0 w-64 m-8">
	{#each $notifications as notification}
		<Toast
			color={getColor(notification.type)}
			on:close={() => {
				dropNotification(notification.id);
			}}
		>
			<svelte:component this={getIcon(notification.type)} slot="icon" class="w-5 h-5" />
			{notification.message}
		</Toast>
	{/each}
</div>
