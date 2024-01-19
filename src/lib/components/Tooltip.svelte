<script lang="ts">
	import { Popover } from "flowbite-svelte";
	import { InfoCircleSolid } from "flowbite-svelte-icons";

	export let id: string;
	export let size: "xs" | "sm" | "md" | "lg" | "xl" = "md";
	export let placement: "left" | "right" = "right";
</script>

<InfoCircleSolid {id} {size} class={placement == "right" ? "ms-2" : "me-2"} />
<Popover triggeredBy="#{id}" {...$$restProps}>
	<slot />
</Popover>
