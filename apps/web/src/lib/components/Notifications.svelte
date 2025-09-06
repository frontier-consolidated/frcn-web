<script lang="ts">
	import { Toast } from "flowbite-svelte";
	import { ExclamationCircleSolid, FaceGrinSolid, InfoCircleSolid } from "flowbite-svelte-icons";

	import {
		notifications,
		type Notification,
		dropNotification
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
			case "info":
				return "blue";
			case "success":
				return "green";
		}
	}

	function getIcon(type: Notification["type"]) {
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

<div id="notifications" class="z-100 fixed bottom-0 left-0 m-8 flex w-64 flex-col-reverse gap-2">
	{#each $notifications as notification}
		<Toast
			color={getColor(notification.type)}
			on:close={() => {
				dropNotification(notification.id);
			}}
		>
			<svelte:component
				this={getIcon(notification.type)}
				slot="icon"
				class="h-5 w-5"
				tabindex="-1"
			/>
			{notification.message}
		</Toast>
	{/each}
</div>
