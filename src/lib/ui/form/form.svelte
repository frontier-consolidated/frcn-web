<script lang="ts">
	import type { SuperForm } from "sveltekit-superforms";
	import { twMerge } from "tailwind-merge";

	export let form: SuperForm<any, any>;
	export let method: "get" | "post" | "dialog" | "none" = "post";

	const { enhance } = form;
</script>

<form
	method={method === "none" ? undefined : method}
	enctype="multipart/form-data"
	{...$$restProps}
	class={twMerge("flex-1 flex flex-col gap-[16px]", $$restProps.class)}
	use:enhance
>
	<slot />
</form>
