<script lang="ts">
	import { Popover } from "flowbite-svelte";
	import { InfoCircleSolid } from "flowbite-svelte-icons";
	import { twMerge } from "tailwind-merge";

	export let id: string | undefined = undefined;
	export let triggeredBy: string | undefined = undefined;
	export let size: "xs" | "sm" | "md" | "lg" | "xl" = "sm";
	export let iconPlacement: "left" | "right" = "right";
</script>

<slot name="icon">
	<InfoCircleSolid {id} {size} class={iconPlacement == "right" ? "ms-2" : "me-2"} />
</slot>
<Popover triggeredBy={triggeredBy ? triggeredBy : id ? `#${id}` : undefined} {...$$restProps} class={twMerge("font-medium text-sm", $$restProps.class)}>
	<slot />
</Popover>
