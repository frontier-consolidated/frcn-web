<script lang="ts">
	import { Button } from "flowbite-svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex justify-end">
	<Button href="/event/asdjkasd">Create New Event</Button>
</div>
