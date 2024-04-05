<script lang="ts">
	import { Permission, hasOneOfPermissions, hasPermission } from "@frcn/shared";
	import { CirclePlusSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	import { Button } from "$lib/components";
	import { user } from "$lib/stores/UserStore";

	import { createEvent } from "./helpers";

    export let startAt: Date | undefined = undefined
</script>

{#if hasOneOfPermissions($user.data?.permissions ?? 0, [Permission.CreateEvents, Permission.ManageEvents])}
    <Button
        {...$$restProps}
        class={twMerge("sm:shrink-0", $$restProps.class)}
        on:click={async () => {
            await createEvent(startAt)
        }}
    >
        <CirclePlusSolid class="me-2 outline-none" tabindex="-1" /> Create New Event
    </Button>
{/if}