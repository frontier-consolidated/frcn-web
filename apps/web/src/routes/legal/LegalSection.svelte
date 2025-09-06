<script lang="ts">
	import { Heading } from "flowbite-svelte";

	export let title: string | undefined = undefined;
	export let id: string | undefined = undefined;
</script>

<section {id} class="flex flex-col gap-4 text-gray-600 dark:text-gray-300">
	{#if title}
		<Heading tag="h2" class="group text-xl font-medium text-gray-800 dark:text-white">
			{title}
			{#if id}
				<a
					href="#{id}"
					class="text-primary-700 dark:text-primary-700 ms-1 font-black opacity-0 transition-opacity group-hover:opacity-100"
					>#</a
				>
			{/if}
		</Heading>
	{/if}
	<slot />
</section>
