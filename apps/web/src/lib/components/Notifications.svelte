<script lang="ts">
	import { Toast } from "flowbite-svelte";
	import { ExclamationCircleSolid, FaceGrinSolid, InfoCircleSolid } from "flowbite-svelte-icons";

	import {
		notifications,
		type Notification,
		drop_notification,
	} from "$lib/stores/NotificationStore";

	function get_color(
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
			case "info":
				return "blue";
			case "success":
				return "green";
		}
	}

	function get_icon(type: Notification["type"]) {
		switch (type) {
			case "error":
				return ExclamationCircleSolid;
			case "info":
				return InfoCircleSolid;
			case "success":
				return FaceGrinSolid;
		}
	}
</script>

<div id="notifications" class="fixed flex flex-col-reverse gap-2 bottom-0 left-0 w-64 m-8 z-100">
	{#each $notifications as notification}
		<Toast
			color={get_color(notification.type)}
			on:close={() => {
				drop_notification(notification.id);
			}}
		>
			<svelte:component this={get_icon(notification.type)} slot="icon" class="w-5 h-5" tabindex="-1" />
			{notification.message}
		</Toast>
	{/each}
</div>
